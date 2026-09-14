import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import {
  emptyAppearance,
  type Appearance,
  type BackupPayload,
  type CachedBook,
  type CachedLesson,
  type HistoryEntry,
  type Profile,
  type StorageMode,
  type StreakState,
} from '../types'
import { emptyStreak } from './streak'
import { normalizeTheme } from './theme'

const DB_NAME = 'randon'
const DB_VERSION = 2
const FALLBACK_KEY = 'randon:fallback-v1'

interface RandonDB extends DBSchema {
  kv: {
    key: string
    value: { key: string; value: unknown }
  }
  history: {
    key: string
    value: HistoryEntry
    indexes: { 'by-date': string; 'by-lesson': string }
  }
  cachedLessons: {
    key: string
    value: CachedLesson
  }
  bookCache: {
    key: string
    value: CachedBook
  }
}

export type PersistedState = {
  profile: Profile | null
  streak: StreakState
  history: HistoryEntry[]
  cachedLessons: CachedLesson[]
  savedBookIds: string[]
  appearance: Appearance
  bookCache: CachedBook[]
}

type FallbackBundle = PersistedState

function emptyState(): PersistedState {
  return {
    profile: null,
    streak: emptyStreak(),
    history: [],
    cachedLessons: [],
    savedBookIds: [],
    appearance: emptyAppearance(),
    bookCache: [],
  }
}

export function normalizeCached(item: CachedLesson): CachedLesson {
  return {
    ...item,
    progress: typeof item.progress === 'number' ? item.progress : 0.2,
    finishedAt: item.finishedAt ?? null,
  }
}

function normalizeAppearance(value: Partial<Appearance> | undefined): Appearance {
  const merged = { ...emptyAppearance(), ...value }
  return { ...merged, theme: normalizeTheme(value?.theme ?? merged.theme) }
}

function readFallback(): FallbackBundle | null {
  try {
    const raw = localStorage.getItem(FALLBACK_KEY)
    if (!raw) return null
    return JSON.parse(raw) as FallbackBundle
  } catch {
    return null
  }
}

function writeFallback(state: PersistedState) {
  localStorage.setItem(FALLBACK_KEY, JSON.stringify(state))
}

let memoryState: PersistedState = emptyState()
let dbPromise: Promise<IDBPDatabase<RandonDB>> | null = null

async function openRandonDB() {
  if (!dbPromise) {
    dbPromise = openDB<RandonDB>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains('kv')) {
          database.createObjectStore('kv', { keyPath: 'key' })
        }
        if (!database.objectStoreNames.contains('history')) {
          const history = database.createObjectStore('history', {
            keyPath: 'id',
          })
          history.createIndex('by-date', 'dateKey')
          history.createIndex('by-lesson', 'lessonId')
        }
        if (!database.objectStoreNames.contains('cachedLessons')) {
          database.createObjectStore('cachedLessons', { keyPath: 'id' })
        }
        if (!database.objectStoreNames.contains('bookCache')) {
          database.createObjectStore('bookCache', { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}

export async function detectAndLoad(): Promise<{
  state: PersistedState
  mode: StorageMode
  notice: string | null
}> {
  try {
    const db = await openRandonDB()
    const profile = ((await db.get('kv', 'profile'))?.value ?? null) as Profile | null
    const streak = ((await db.get('kv', 'streak'))?.value ??
      emptyStreak()) as StreakState
    const history = await db.getAll('history')
    const cachedLessons = await db.getAll('cachedLessons')
    const bookCache = await db.getAll('bookCache')
    const savedBookIds = ((await db.get('kv', 'savedBookIds'))?.value ?? []) as string[]
    return {
      state: {
        profile,
        streak: { ...emptyStreak(), ...streak },
        history: history.sort((a, b) => b.openedAt.localeCompare(a.openedAt)),
        cachedLessons: cachedLessons.map(normalizeCached),
        savedBookIds: Array.from(
          new Set([...savedBookIds, ...bookCache.map((book) => book.id)]),
        ),
        appearance: normalizeAppearance(
          ((await db.get('kv', 'appearance'))?.value ?? {}) as Partial<Appearance>,
        ),
        bookCache,
      },
      mode: 'indexeddb',
      notice: null,
    }
  } catch (error) {
    const fallback = readFallback()
    if (fallback) {
      return {
        state: {
          ...emptyState(),
          ...fallback,
          savedBookIds: fallback.savedBookIds ?? [],
          appearance: normalizeAppearance(fallback.appearance),
          cachedLessons: (fallback.cachedLessons ?? []).map(normalizeCached),
          bookCache: fallback.bookCache ?? [],
        },
        mode: 'localstorage',
        notice:
          'IndexedDB was blocked, so Randon is using this browser’s local storage instead. Export a backup if you care about this library.',
      }
    }
    try {
      writeFallback(emptyState())
      return {
        state: emptyState(),
        mode: 'localstorage',
        notice:
          'IndexedDB is unavailable. Progress will be saved in local storage on this device only.',
      }
    } catch {
      memoryState = emptyState()
      return {
        state: memoryState,
        mode: 'memory',
        notice: error instanceof Error ? error.message : 'Storage is unavailable.',
      }
    }
  }
}

async function persistKv(mode: StorageMode, state: PersistedState) {
  if (mode === 'memory') {
    memoryState = state
    return
  }
  if (mode === 'localstorage') {
    writeFallback(state)
    return
  }
  const db = await openRandonDB()
  const tx = db.transaction(['kv', 'history', 'cachedLessons', 'bookCache'], 'readwrite')
  await tx.objectStore('kv').put({ key: 'profile', value: state.profile })
  await tx.objectStore('kv').put({ key: 'streak', value: state.streak })
  await tx.objectStore('kv').put({ key: 'savedBookIds', value: state.savedBookIds })
  await tx.objectStore('kv').put({ key: 'appearance', value: state.appearance })
  const historyStore = tx.objectStore('history')
  const existingHistory = await historyStore.getAll()
  const nextIds = new Set(state.history.map((entry) => entry.id))
  await Promise.all(
    existingHistory
      .filter((entry) => !nextIds.has(entry.id))
      .map((entry) => historyStore.delete(entry.id)),
  )
  await Promise.all(state.history.map((entry) => historyStore.put(entry)))
  const cacheStore = tx.objectStore('cachedLessons')
  const existingCache = await cacheStore.getAll()
  const cacheIds = new Set(state.cachedLessons.map((item) => item.id))
  await Promise.all(
    existingCache
      .filter((item) => !cacheIds.has(item.id))
      .map((item) => cacheStore.delete(item.id)),
  )
  await Promise.all(state.cachedLessons.map((item) => cacheStore.put(item)))
  const bookStore = tx.objectStore('bookCache')
  const existingBooks = await bookStore.getAll()
  const bookIds = new Set(state.bookCache.map((item) => item.id))
  await Promise.all(
    existingBooks
      .filter((item) => !bookIds.has(item.id))
      .map((item) => bookStore.delete(item.id)),
  )
  await Promise.all(state.bookCache.map((item) => bookStore.put(item)))
  await tx.done
}

export async function saveState(
  mode: StorageMode,
  state: PersistedState,
): Promise<void> {
  try {
    await persistKv(mode, state)
  } catch (error) {
    if (mode === 'indexeddb') {
      try {
        writeFallback(state)
        return
      } catch {
        memoryState = state
        throw error
      }
    }
    throw error
  }
}

export async function clearAll(mode: StorageMode): Promise<void> {
  memoryState = emptyState()
  try {
    localStorage.removeItem(FALLBACK_KEY)
  } catch {
    /* ignore */
  }
  if (mode === 'indexeddb') {
    try {
      const db = await openRandonDB()
      const tx = db.transaction(
        ['kv', 'history', 'cachedLessons', 'bookCache'],
        'readwrite',
      )
      await tx.objectStore('kv').clear()
      await tx.objectStore('history').clear()
      await tx.objectStore('cachedLessons').clear()
      await tx.objectStore('bookCache').clear()
      await tx.done
    } catch {
      /* ignore */
    }
  }
}

export function toBackup(state: PersistedState): BackupPayload {
  return {
    version: 1,
    app: 'randon',
    exportedAt: new Date().toISOString(),
    ...state,
  }
}

export function fromBackup(payload: BackupPayload): PersistedState {
  const bookCache = payload.bookCache ?? []
  return {
    profile: payload.profile,
    streak: { ...emptyStreak(), ...payload.streak },
    history: payload.history ?? [],
    cachedLessons: (payload.cachedLessons ?? []).map(normalizeCached),
    savedBookIds: Array.from(
      new Set([...(payload.savedBookIds ?? []), ...bookCache.map((book) => book.id)]),
    ),
    appearance: normalizeAppearance(payload.appearance),
    bookCache,
  }
}

export function parseBackup(raw: string): BackupPayload {
  const data = JSON.parse(raw) as BackupPayload
  if (data?.app !== 'randon' || data?.version !== 1) {
    throw new Error('This file is not a Randon backup.')
  }
  return data
}
