import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Chip } from '../components/Chip'
import { QuietEmpty } from '../components/QuietEmpty'
import { Card } from '../components/ui/card'
import { TOPIC_BY_ID } from '../data/topics'
import { getLessonById } from '../lib/daily'
import { formatRelativeDay } from '../lib/dates'
import { navigateWithMorph, staggerDelay } from '../lib/motion'
import { isLessonFinished, lessonProgress } from '../lib/progress'
import { useRandon } from '../store/RandonProvider'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'progress', label: 'In progress' },
  { id: 'finished', label: 'Finished' },
  { id: 'offline', label: 'Offline' },
] as const

type LibraryFilter = (typeof FILTERS)[number]['id']

export function LibraryPage() {
  const navigate = useNavigate()
  const { history, cachedLessons, todayKey, persistError } = useRandon()
  const [filter, setFilter] = useState<LibraryFilter>('all')
  const [query, setQuery] = useState('')
  const [online, setOnline] = useState(
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )

  const allRows = useMemo(() => {
    const seen = new Set<string>()
    const unique = history.filter((entry) => {
      if (seen.has(entry.lessonId)) return false
      seen.add(entry.lessonId)
      return true
    })
    const fromHistory = unique
      .map((entry) => {
        const cache = cachedLessons.find((item) => item.id === entry.lessonId)
        const lesson = cache?.lesson ?? getLessonById(entry.lessonId)
        return lesson
          ? { entry, lesson, cache, offline: Boolean(cache), dateKey: entry.dateKey }
          : null
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)

    for (const cache of cachedLessons) {
      if (seen.has(cache.id)) continue
      seen.add(cache.id)
      fromHistory.push({
        entry: {
          id: cache.id,
          lessonId: cache.id,
          dateKey: cache.cachedAt.slice(0, 10),
          openedAt: cache.cachedAt,
          wasDaily: false,
        },
        lesson: cache.lesson,
        cache,
        offline: true,
        dateKey: cache.cachedAt.slice(0, 10),
      })
    }
    return fromHistory
  }, [cachedLessons, history])

  const needle = query.trim().toLowerCase()
  const rows = allRows.filter((row) => {
    if (filter === 'offline' && !row.offline) return false
    if (filter === 'finished' && !isLessonFinished(row.cache)) return false
    if (filter === 'progress' && isLessonFinished(row.cache)) return false
    if (filter === 'progress' && !row.cache) return false
    if (!needle) return true
    const topic = TOPIC_BY_ID[row.lesson.topic].label.toLowerCase()
    return (
      row.lesson.title.toLowerCase().includes(needle) ||
      row.lesson.dek.toLowerCase().includes(needle) ||
      topic.includes(needle)
    )
  })

  const emptyLibrary = allRows.length === 0
  const storageError = Boolean(persistError)

  return (
    <div className="page">
      <div className="library-sticky">
        <div className="flex items-end justify-between gap-3">
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">Library</h1>
        </div>
        <label className="sr-only" htmlFor="library-search">
          Search lessons
        </label>
        <input
          id="library-search"
          className="field mt-4"
          type="search"
          value={query}
          placeholder="Search titles"
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="chip-row mt-3">
          {FILTERS.map((item) => (
            <Chip
              key={item.id}
              selected={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </Chip>
          ))}
        </div>
      </div>

      {storageError && (
        <Card className="mt-4 px-4 py-4">
          <p className="text-[15px] font-medium text-ink">Couldn’t reach this device’s library</p>
          <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">
            Progress usually lives here. If storage was blocked, allow site data and try again.
          </p>
          <button
            type="button"
            className="mt-3 text-sm font-semibold text-teal"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </Card>
      )}

      {!online && !emptyLibrary && (
        <p className="mt-3 text-[13px] text-ink-soft">
          You’re offline. Cached lessons on this device still open.
        </p>
      )}

      {rows.length === 0 ? (
        emptyLibrary ? (
          <QuietEmpty
            title="Your library is quiet"
            copy="Open today’s lesson and it will wait here, including offline."
            action={{ href: '/', label: 'Start today’s lesson' }}
          />
        ) : (
          <p className="mt-8 text-center text-[15px] text-ink-soft">Nothing here yet</p>
        )
      ) : (
        <ul className="mt-3 grid gap-2">
          {rows.map(({ lesson, entry, cache }, index) => {
            const progress = lessonProgress(cache)
            const percent = Math.round(progress * 100)
            return (
              <li
                key={lesson.id}
                className="library-row-enter"
                style={{ animationDelay: staggerDelay(index, 40) }}
              >
                <Link
                  to={`/lesson/${lesson.id}`}
                  className="library-row"
                  onClick={(event) => {
                    event.preventDefault()
                    navigateWithMorph(navigate, `/lesson/${lesson.id}`)
                  }}
                >
                  <h2 className="library-title">{lesson.title}</h2>
                  <div
                    className="progress-thin"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                    aria-label="Reading progress"
                  >
                    <span style={{ width: `${percent}%` }} />
                  </div>
                  <p className="library-excerpt">{lesson.dek}</p>
                  <p className="library-meta">
                    <span className="topic-pill">{TOPIC_BY_ID[lesson.topic].label}</span>
                    <span aria-hidden>·</span>
                    <span>{formatRelativeDay(entry.dateKey, todayKey)}</span>
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      <OnlineSync onChange={setOnline} />
    </div>
  )
}

function OnlineSync({ onChange }: { onChange: (online: boolean) => void }) {
  useEffect(() => {
    const on = () => onChange(true)
    const off = () => onChange(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [onChange])
  return null
}
