import { LESSONS } from '../data/lessons'
import { resolveVisualLessonId } from '../../design-export/visual-lessons'
import type { Lesson, TopicId } from '../types'
import { hashString, mulberry32 } from './utils'

export function lessonsForTopics(topics: TopicId[]): Lesson[] {
  if (topics.length === 0) return []
  const selected = new Set(topics)
  return LESSONS.filter((lesson) => selected.has(lesson.topic))
}

export function getLessonById(id: string): Lesson | undefined {
  const direct = LESSONS.find((lesson) => lesson.id === id)
  if (direct) return direct
  const resolved = resolveVisualLessonId(id)
  if (!resolved) return undefined
  return LESSONS.find((lesson) => lesson.id === resolved)
}

export function pickDailyLesson(
  topics: TopicId[],
  dateKey: string,
  seenIds: string[],
): Lesson | null {
  const pool = lessonsForTopics(topics)
  if (pool.length === 0) return null
  const unseen = pool.filter((lesson) => !seenIds.includes(lesson.id))
  const source = unseen.length > 0 ? unseen : pool
  const rng = mulberry32(hashString(`${dateKey}:${topics.slice().sort().join('|')}`))
  return source[Math.floor(rng() * source.length)] ?? null
}

export function pickAnotherLesson(
  topics: TopicId[],
  excludeId: string,
  entropy = Date.now(),
): Lesson | null {
  const pool = lessonsForTopics(topics).filter((lesson) => lesson.id !== excludeId)
  if (pool.length === 0) return pickDailyLesson(topics, 'extra', [])
  const rng = mulberry32(hashString(`extra:${entropy}`))
  return pool[Math.floor(rng() * pool.length)] ?? null
}

export function pickExploreLessons(
  topics: TopicId[],
  excludeId: string,
  dateKey: string,
  count = 4,
): Lesson[] {
  const pool = lessonsForTopics(topics).filter((lesson) => lesson.id !== excludeId)
  if (pool.length === 0) return []
  const rng = mulberry32(hashString(`explore:${dateKey}:${topics.slice().sort().join('|')}`))
  const items = [...pool]
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1))
    const current = items[index]
    const other = items[swap]
    if (current && other) {
      items[index] = other
      items[swap] = current
    }
  }
  return items.slice(0, count)
}
