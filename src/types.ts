import {
  isProductSteppedDiagram,
  type ProductSteppedDiagramId,
} from '../design-export/visual-lessons/types'

export const TOPIC_IDS = [
  'physics',
  'cybersecurity',
  'stem',
  'painting',
  'history',
  'law',
] as const

export type TopicId = (typeof TOPIC_IDS)[number]

export type LessonKind = 'article' | 'visual'

export type LoopingVisualId =
  | 'orbit'
  | 'pendulum'
  | 'waves'
  | 'hash-lock'
  | 'color-wheel'
  | 'helix'
  | 'prism'
  | 'scales'
  | 'timeline'
  | 'ice'

export type SteppedVisualId = ProductSteppedDiagramId

export type VisualId = LoopingVisualId | SteppedVisualId

export function isSteppedVisual(id: VisualId | undefined): id is SteppedVisualId {
  return isProductSteppedDiagram(id)
}

export type Lesson = {
  id: string
  topic: TopicId
  kind: LessonKind
  title: string
  dek: string
  minutes: number
  visual?: VisualId
  body: string[]
  takeaway: string
}

export type Profile = {
  onboardedAt: string
  topics: TopicId[]
}

export type StreakState = {
  current: number
  longest: number
  lastLessonDate: string | null
  activeDates: string[]
}

export type HistoryEntry = {
  id: string
  lessonId: string
  dateKey: string
  openedAt: string
  wasDaily: boolean
}

export type CachedLesson = {
  id: string
  cachedAt: string
  lesson: Lesson
  progress: number
  finishedAt: string | null
}

export type ThemePreference = 'system' | 'light' | 'dark'

export type Appearance = {
  textScale: 'comfortable' | 'large'
  theme: ThemePreference
  showRhythmOnHome: boolean
}

export function emptyAppearance(): Appearance {
  return {
    textScale: 'comfortable',
    theme: 'system',
    showRhythmOnHome: false,
  }
}

export type CachedBook = {
  id: string
  text: string
  savedAt: string
}

export type StorageMode = 'indexeddb' | 'localstorage' | 'memory'

export type StorageNotice = {
  tone: 'info' | 'warning' | 'error'
  title: string
  detail: string
} | null

export type BackupPayload = {
  version: 1
  app: 'randon'
  exportedAt: string
  profile: Profile | null
  streak: StreakState
  history: HistoryEntry[]
  cachedLessons: CachedLesson[]
  savedBookIds: string[]
  appearance: Appearance
  bookCache: CachedBook[]
}

export type BookLicense = 'Public Domain' | 'CC0' | 'CC BY' | 'CC BY-SA'

export type OpenBook = {
  id: string
  title: string
  author: string
  year: string
  topics: TopicId[]
  license: BookLicense
  source: string
  blurb: string
  gutenbergId?: number
  pageUrl: string
  downloadUrl: string
  downloadLabel: string
  localExcerpt?: string
  lengthLabel: string
}
