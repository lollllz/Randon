import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { pickDailyLesson } from '../lib/daily'
import {
  clearAll,
  detectAndLoad,
  fromBackup,
  saveState,
  toBackup,
  type PersistedState,
} from '../lib/db'
import { localDateKey } from '../lib/dates'
import { emptyStreak, recordDailyOpen } from '../lib/streak'
import {
  applyResolvedTheme,
  rememberThemePreference,
  resolveTheme,
  subscribeSystemTheme,
} from '../lib/theme'
import {
  emptyAppearance,
  type Appearance,
  type BackupPayload,
  type CachedBook,
  type CachedLesson,
  type HistoryEntry,
  type Lesson,
  type Profile,
  type StorageMode,
  type StorageNotice,
  type StreakState,
  type TopicId,
} from '../types'

type RandonContextValue = {
  status: 'booting' | 'ready'
  mode: StorageMode
  notice: StorageNotice
  profile: Profile | null
  streak: StreakState
  history: HistoryEntry[]
  cachedLessons: CachedLesson[]
  todayKey: string
  dailyLesson: Lesson | null
  persistError: string | null
  savedBookIds: string[]
  bookCache: CachedBook[]
  appearance: Appearance
  completeOnboarding: (topics: TopicId[]) => Promise<void>
  updateTopics: (topics: TopicId[]) => Promise<void>
  openLesson: (lesson: Lesson, wasDaily: boolean) => Promise<void>
  updateLessonProgress: (lessonId: string, progress: number) => Promise<void>
  finishLesson: (lessonId: string) => Promise<void>
  saveBook: (book: CachedBook) => Promise<void>
  updateAppearance: (patch: Partial<Appearance>) => Promise<void>
  restoreBackup: (payload: BackupPayload) => Promise<void>
  resetAll: () => Promise<void>
  dismissNotice: () => void
  backupPayload: () => BackupPayload
  lessonFromCache: (id: string) => Lesson | undefined
  bookText: (id: string) => string | undefined
}

const RandonContext = createContext<RandonContextValue | null>(null)

export function RandonProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'booting' | 'ready'>('booting')
  const [mode, setMode] = useState<StorageMode>('indexeddb')
  const [notice, setNotice] = useState<StorageNotice>(null)
  const [persistError, setPersistError] = useState<string | null>(null)
  const [state, setState] = useState<PersistedState>({
    profile: null,
    streak: emptyStreak(),
    history: [],
    cachedLessons: [],
    savedBookIds: [],
    appearance: emptyAppearance(),
    bookCache: [],
  })
  const [todayKey, setTodayKey] = useState(localDateKey)

  useEffect(() => {
    let cancelled = false
    void detectAndLoad().then((loaded) => {
      if (cancelled) return
      setState(loaded.state)
      setMode(loaded.mode)
      if (loaded.mode === 'memory') {
        setNotice({
          tone: 'error',
          title: 'Nothing will be saved',
          detail:
            loaded.notice ??
            'This browser blocked storage. You can still try a lesson, but refresh will forget it. Export will not work until storage is allowed.',
        })
      } else if (loaded.notice) {
        setNotice({
          tone: 'warning',
          title: 'Using a fallback store',
          detail: loaded.notice,
        })
      }
      setStatus('ready')
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (status !== 'ready') return
    const appearance = state.appearance ?? emptyAppearance()
    document.documentElement.dataset.textScale = appearance.textScale
    rememberThemePreference(appearance.theme)
    applyResolvedTheme(resolveTheme(appearance.theme))
    if (appearance.theme !== 'system') return
    return subscribeSystemTheme((dark) => {
      applyResolvedTheme(resolveTheme('system', dark))
    })
  }, [state.appearance, status])

  useEffect(() => {
    const syncDate = () => setTodayKey(localDateKey())
    const interval = window.setInterval(syncDate, 60_000)
    window.addEventListener('focus', syncDate)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', syncDate)
    }
  }, [])

  const persist = useCallback(
    async (next: PersistedState, nextMode = mode) => {
      setState(next)
      try {
        await saveState(nextMode, next)
        setPersistError(null)
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'The browser refused to write your library.'
        setPersistError(message)
        setNotice({
          tone: 'error',
          title: 'Could not save to this device',
          detail:
            'Storage permission was denied or the disk quota is full. Try Export to download a JSON backup, then free space or allow site data.',
        })
      }
    },
    [mode],
  )

  const completeOnboarding = useCallback(
    async (topics: TopicId[]) => {
      await persist({
        ...state,
        profile: { onboardedAt: new Date().toISOString(), topics },
      })
    },
    [persist, state],
  )

  const updateTopics = useCallback(
    async (topics: TopicId[]) => {
      if (!state.profile) return
      await persist({
        ...state,
        profile: { ...state.profile, topics },
      })
    },
    [persist, state],
  )

  const openLesson = useCallback(
    async (lesson: Lesson, wasDaily: boolean) => {
      const openedAt = new Date().toISOString()
      const alreadyToday = state.history.some(
        (entry) => entry.lessonId === lesson.id && entry.dateKey === todayKey,
      )
      const existing = state.cachedLessons.find((item) => item.id === lesson.id)
      const cached: CachedLesson = {
        id: lesson.id,
        cachedAt: openedAt,
        lesson,
        progress: existing?.progress ?? 0.15,
        finishedAt: existing?.finishedAt ?? null,
      }
      const cachedLessons = [
        cached,
        ...state.cachedLessons.filter((item) => item.id !== lesson.id),
      ]
      const history = alreadyToday
        ? state.history
        : [
            {
              id: `${lesson.id}:${todayKey}`,
              lessonId: lesson.id,
              dateKey: todayKey,
              openedAt,
              wasDaily,
            },
            ...state.history,
          ]
      const streak = wasDaily
        ? recordDailyOpen(state.streak, todayKey)
        : state.streak
      await persist({ ...state, history, cachedLessons, streak })
    },
    [persist, state, todayKey],
  )

  const updateLessonProgress = useCallback(
    async (lessonId: string, progress: number) => {
      const existing = state.cachedLessons.find((item) => item.id === lessonId)
      if (!existing || existing.finishedAt) return
      const next = Math.max(existing.progress, Math.min(1, progress))
      if (next - existing.progress < 0.04) return
      await persist({
        ...state,
        cachedLessons: state.cachedLessons.map((item) =>
          item.id === lessonId ? { ...item, progress: next } : item,
        ),
      })
    },
    [persist, state],
  )

  const finishLesson = useCallback(
    async (lessonId: string) => {
      const existing = state.cachedLessons.find((item) => item.id === lessonId)
      if (!existing || existing.finishedAt) return
      await persist({
        ...state,
        cachedLessons: state.cachedLessons.map((item) =>
          item.id === lessonId
            ? { ...item, progress: 1, finishedAt: new Date().toISOString() }
            : item,
        ),
      })
    },
    [persist, state],
  )

  const updateAppearance = useCallback(
    async (patch: Partial<Appearance>) => {
      await persist({
        ...state,
        appearance: { ...emptyAppearance(), ...state.appearance, ...patch },
      })
    },
    [persist, state],
  )

  const saveBook = useCallback(
    async (book: CachedBook) => {
      const savedBookIds = state.savedBookIds.includes(book.id)
        ? state.savedBookIds
        : [...state.savedBookIds, book.id]
      await persist({
        ...state,
        savedBookIds,
        bookCache: [book, ...state.bookCache.filter((item) => item.id !== book.id)],
      })
    },
    [persist, state],
  )

  const restoreBackup = useCallback(
    async (payload: BackupPayload) => {
      await persist(fromBackup(payload))
      setNotice({
        tone: 'info',
        title: 'Backup restored',
        detail: 'Topics, reading rhythm, and cached lessons were loaded from your file.',
      })
    },
    [persist],
  )

  const resetAll = useCallback(async () => {
    await clearAll(mode)
    setState({
      profile: null,
      streak: emptyStreak(),
      history: [],
      cachedLessons: [],
      savedBookIds: [],
      appearance: emptyAppearance(),
      bookCache: [],
    })
    setPersistError(null)
  }, [mode])

  const dailyLesson = useMemo(() => {
    if (!state.profile) return null
    const seen = state.history.map((entry) => entry.lessonId)
    return pickDailyLesson(state.profile.topics, todayKey, seen)
  }, [state.history, state.profile, todayKey])

  const value = useMemo<RandonContextValue>(
    () => ({
      status,
      mode,
      notice,
      profile: state.profile,
      streak: state.streak,
      history: state.history,
      cachedLessons: state.cachedLessons,
      todayKey,
      dailyLesson,
      persistError,
      savedBookIds: state.savedBookIds,
      bookCache: state.bookCache,
      appearance: state.appearance ?? emptyAppearance(),
      completeOnboarding,
      updateTopics,
      openLesson,
      updateLessonProgress,
      finishLesson,
      saveBook,
      updateAppearance,
      restoreBackup,
      resetAll,
      dismissNotice: () => setNotice(null),
      backupPayload: () => toBackup(state),
      lessonFromCache: (id: string) =>
        state.cachedLessons.find((item) => item.id === id)?.lesson,
      bookText: (id: string) => state.bookCache.find((item) => item.id === id)?.text,
    }),
    [
      completeOnboarding,
      dailyLesson,
      mode,
      notice,
      openLesson,
      persistError,
      saveBook,
      updateLessonProgress,
      finishLesson,
      updateAppearance,
      resetAll,
      restoreBackup,
      state,
      status,
      todayKey,
      updateTopics,
    ],
  )

  return <RandonContext.Provider value={value}>{children}</RandonContext.Provider>
}

export function useRandon() {
  const value = useContext(RandonContext)
  if (!value) {
    throw new Error('useRandon must be used inside RandonProvider')
  }
  return value
}
