import type { StreakState } from '../types'
import { localDateKey, yesterdayKey } from './dates'

const MAX_ACTIVE_DATES = 400

export function emptyStreak(): StreakState {
  return {
    current: 0,
    longest: 0,
    lastLessonDate: null,
    activeDates: [],
  }
}

export function recordDailyOpen(
  streak: StreakState,
  dateKey = localDateKey(),
): StreakState {
  if (streak.lastLessonDate === dateKey) {
    const activeDates = streak.activeDates.includes(dateKey)
      ? streak.activeDates
      : [...streak.activeDates, dateKey]
    return { ...streak, activeDates: trimDates(activeDates) }
  }

  const nextCurrent =
    streak.lastLessonDate === yesterdayKey(dateKey) ? streak.current + 1 : 1

  const activeDates = streak.activeDates.includes(dateKey)
    ? streak.activeDates
    : [...streak.activeDates, dateKey]

  return {
    current: nextCurrent,
    longest: Math.max(streak.longest, nextCurrent),
    lastLessonDate: dateKey,
    activeDates: trimDates(activeDates),
  }
}

function trimDates(dates: string[]) {
  return [...dates].sort().slice(-MAX_ACTIVE_DATES)
}

export function daysThisMonth(activeDates: string[], today = localDateKey()) {
  const prefix = today.slice(0, 7)
  return new Set(activeDates.filter((date) => date.startsWith(prefix))).size
}

export function weekDots(activeDates: string[], today = localDateKey()) {
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const date = new Date()
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  start.setDate(start.getDate() - start.getDay())
  return labels.map((label, index) => {
    const cell = new Date(start)
    cell.setDate(start.getDate() + index)
    const key = localDateKey(cell)
    return {
      label,
      dateKey: key,
      active: activeDates.includes(key),
      isToday: key === today,
      isFuture: key > today,
    }
  })
}
