import type { CachedLesson } from '../types'

export function lessonProgress(cache?: CachedLesson) {
  if (!cache) return 0.15
  if (cache.finishedAt) return 1
  return Math.min(1, Math.max(0, cache.progress))
}

export function isLessonFinished(cache?: CachedLesson) {
  return Boolean(cache?.finishedAt) || (cache?.progress ?? 0) >= 1
}
