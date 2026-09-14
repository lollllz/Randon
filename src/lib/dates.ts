/** Calendar date in the user's local timezone, never UTC. */
export function localDateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseLocalDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

export function shiftDateKey(dateKey: string, days: number): string {
  const date = parseLocalDateKey(dateKey)
  date.setDate(date.getDate() + days)
  return localDateKey(date)
}

export function yesterdayKey(dateKey: string): string {
  return shiftDateKey(dateKey, -1)
}

export function formatLongDate(dateKey: string): string {
  return parseLocalDateKey(dateKey).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function formatShortDate(dateKey: string): string {
  return parseLocalDateKey(dateKey).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function formatRelativeDay(dateKey: string, today = localDateKey()): string {
  if (dateKey === today) return 'Today'
  if (dateKey === yesterdayKey(today)) return 'Yesterday'
  const ms =
    parseLocalDateKey(today).getTime() - parseLocalDateKey(dateKey).getTime()
  const days = Math.round(ms / 86_400_000)
  if (days > 1 && days < 14) return `${days} days ago`
  return formatShortDate(dateKey)
}

export function isSameWeek(a: string, b: string): boolean {
  const da = parseLocalDateKey(a)
  const db = parseLocalDateKey(b)
  const startA = new Date(da)
  startA.setDate(da.getDate() - da.getDay())
  const startB = new Date(db)
  startB.setDate(db.getDate() - db.getDay())
  return localDateKey(startA) === localDateKey(startB)
}
