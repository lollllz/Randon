import { Link, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { LessonIllustration } from '../components/visuals/LessonIllustration'
import { WeekDots } from '../components/WeekDots'
import { TOPIC_BY_ID } from '../data/topics'
import { pickExploreLessons } from '../lib/daily'
import { formatLongDate } from '../lib/dates'
import { navigateWithMorph, staggerDelay } from '../lib/motion'
import { daysThisMonth } from '../lib/streak'
import { useRandon } from '../store/RandonProvider'
import type { Lesson } from '../types'

export function TodayPage() {
  const navigate = useNavigate()
  const { dailyLesson, todayKey, streak, history, profile, openLesson, appearance } =
    useRandon()
  const openedToday = history.some(
    (entry) => entry.wasDaily && entry.dateKey === todayKey,
  )
  const monthDays = daysThisMonth(streak.activeDates, todayKey)
  const showRhythm = appearance.showRhythmOnHome

  const explore = useMemo(() => {
    if (!dailyLesson || !profile) return []
    return pickExploreLessons(profile.topics, dailyLesson.id, todayKey, 4)
  }, [dailyLesson, profile, todayKey])

  if (!dailyLesson || !profile) {
    return (
      <div className="page">
        <h1 className="text-2xl font-semibold">No topics yet</h1>
        <p className="mt-2 text-ink-soft">
          Choose at least one subject in Settings so Randon can draw a lesson.
        </p>
        <Link className="mt-4 inline-block text-sm font-semibold text-teal" to="/settings">
          Open settings
        </Link>
      </div>
    )
  }

  function open(lesson: Lesson, wasDaily: boolean) {
    void openLesson(lesson, wasDaily)
    navigateWithMorph(navigate, `/lesson/${lesson.id}`)
  }

  return (
    <div className="page">
      <p className="text-[13px] text-ink-soft">{formatLongDate(todayKey)}</p>
      <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-ink">
        Today’s random lesson
      </h1>
      <p className="mt-2 text-[14px] text-ink-soft">
        {openedToday ? 'You showed up today.' : 'A short read when you have a minute.'}
      </p>

      {showRhythm && (
        <div className="mt-4 rounded-[16px] bg-paper-0 px-4 py-3 shadow-[var(--shadow-card)]">
          <p className="text-[13px] text-ink-soft">
            {monthDays} {monthDays === 1 ? 'day' : 'days'} this month · showing up is enough
          </p>
          <div className="mt-3">
            <WeekDots activeDates={streak.activeDates} today={todayKey} />
          </div>
        </div>
      )}

      <Card className="hero-card mt-5 overflow-hidden rise">
        {dailyLesson.kind === 'visual' && dailyLesson.visual ? (
          <div className="px-3 pt-3">
            <LessonIllustration id={dailyLesson.visual} />
          </div>
        ) : null}
        <div className="px-4 pb-4 pt-4">
          <div className="flex flex-wrap gap-1.5">
            <Badge>{TOPIC_BY_ID[dailyLesson.topic].label}</Badge>
            {dailyLesson.topic === 'cybersecurity' && (
              <Badge className="bg-paper-2 text-ink-soft">Defense only</Badge>
            )}
            <Badge className="bg-paper-2 text-ink-soft">
              {dailyLesson.kind === 'visual' ? 'Visual' : 'Article'}
            </Badge>
            <Badge className="bg-paper-2 text-ink-soft">{dailyLesson.minutes} min</Badge>
          </div>
          <h2 className="mt-3 text-[22px] font-semibold leading-snug tracking-tight text-ink">
            {dailyLesson.title}
          </h2>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{dailyLesson.dek}</p>
          <Button className="mt-4 w-full" onClick={() => open(dailyLesson, true)}>
            {openedToday ? 'Continue reading' : 'Open lesson'}
          </Button>
        </div>
      </Card>

      {explore.length > 0 && (
        <section className="mt-7">
          <p className="section-label">Explore</p>
          <ul className="mt-3 grid gap-2.5">
            {explore.map((lesson, index) => (
              <li
                key={lesson.id}
                className="rise"
                style={{ animationDelay: staggerDelay(index, 40) }}
              >
                <button
                  type="button"
                  className="explore-card"
                  onClick={() => open(lesson, false)}
                >
                  <p className="text-[12px] font-medium text-teal">
                    {TOPIC_BY_ID[lesson.topic].label} · {lesson.minutes} min
                  </p>
                  <h3 className="mt-1 text-[16px] font-semibold leading-snug text-ink">
                    {lesson.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">
                    {lesson.dek}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
