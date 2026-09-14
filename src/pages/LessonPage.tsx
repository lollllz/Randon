import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { ArticleHero } from '../components/ArticleHero'
import { LessonIllustration } from '../components/visuals/LessonIllustration'
import { LessonVisual, getVisualLesson } from '../../design-export/visual-lessons'
import { TOPIC_BY_ID } from '../data/topics'
import { SAVED_ON_DEVICE } from '../copy'
import { getLessonById } from '../lib/daily'
import { isReaderControl, staggerDelay } from '../lib/motion'
import { isLessonFinished } from '../lib/progress'
import { useRandon } from '../store/RandonProvider'
import { isSteppedVisual } from '../types'

export function LessonPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const takeawayRef = useRef<HTMLElement>(null)
  const [chromeOn, setChromeOn] = useState(true)
  const [step, setStep] = useState(0)
  const {
    dailyLesson,
    lessonFromCache,
    openLesson,
    todayKey,
    history,
    cachedLessons,
    updateLessonProgress,
    finishLesson,
  } = useRandon()
  const lesson = useMemo(() => {
    if (!id) return undefined
    return lessonFromCache(id) ?? getLessonById(id)
  }, [id, lessonFromCache])
  const cache = cachedLessons.find((item) => item.id === lesson?.id)
  const finished = isLessonFinished(cache)
  const steppedMeta = isSteppedVisual(lesson?.visual)
    ? getVisualLesson(lesson.visual)
    : null
  const stepped = steppedMeta !== null
  const lastStep = steppedMeta ? steppedMeta.steps.length - 1 : 0

  const isDaily = Boolean(lesson && dailyLesson && lesson.id === dailyLesson.id)
  const already = history.some(
    (entry) => entry.lessonId === lesson?.id && entry.dateKey === todayKey,
  )

  useEffect(() => {
    setStep(0)
  }, [lesson?.id])

  useEffect(() => {
    if (!lesson || already) return
    void openLesson(lesson, isDaily)
  }, [already, isDaily, lesson, openLesson])

  useEffect(() => {
    if (!lesson || finished || !stepped || !steppedMeta) return
    const ratio = (step + 1) / steppedMeta.steps.length
    void updateLessonProgress(lesson.id, Math.min(0.92, 0.2 + ratio * 0.7))
  }, [finished, lesson, step, stepped, steppedMeta, updateLessonProgress])

  useEffect(() => {
    if (!lesson || finished || !stepped || step !== lastStep) return
    void finishLesson(lesson.id)
  }, [finishLesson, finished, lastStep, lesson, step, stepped])

  useEffect(() => {
    if (!lesson || finished || stepped) return
    const scroller = document.querySelector<HTMLElement>('.app-main')
    if (!scroller) return

    const onScroll = () => {
      const max = scroller.scrollHeight - scroller.clientHeight
      const ratio = max <= 0 ? 0.4 : scroller.scrollTop / max
      void updateLessonProgress(lesson.id, Math.min(0.92, 0.15 + ratio * 0.8))
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [finished, lesson, stepped, updateLessonProgress])

  useEffect(() => {
    if (!lesson || finished || stepped || !takeawayRef.current) return
    const scroller = document.querySelector('.app-main')
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void finishLesson(lesson.id)
        }
      },
      { root: scroller, threshold: 0.6 },
    )
    observer.observe(takeawayRef.current)
    return () => observer.disconnect()
  }, [finishLesson, finished, lesson, stepped])

  if (!lesson) {
    return (
      <div className="page">
        <h1 className="text-2xl font-semibold">Lesson missing</h1>
        <p className="mt-2 text-ink-soft">
          That lesson is not in the starter pack or your cache.
        </p>
        <Link className="mt-4 inline-block text-sm font-semibold text-teal" to="/library">
          Back to library
        </Link>
      </div>
    )
  }

  const topic = TOPIC_BY_ID[lesson.topic]
  const isVisual = lesson.kind === 'visual'

  return (
    <article
      className="page reader"
      data-chrome={chromeOn ? 'on' : 'off'}
      onClick={(event) => {
        if (isReaderControl(event.target)) return
        setChromeOn((value) => !value)
      }}
    >
      <div
        className={
          chromeOn ? 'reader-top reader-chrome' : 'reader-top reader-chrome reader-chrome-off'
        }
      >
        <button
          type="button"
          className="-ml-1 inline-flex items-center gap-1 text-sm font-medium text-ink-soft"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="size-4" aria-hidden />
          Back
        </button>
      </div>

      {stepped && lesson.visual && isSteppedVisual(lesson.visual) ? (
        <div className="rise" style={{ animationDelay: staggerDelay(0) }}>
          <LessonVisual id={lesson.visual} step={step} onStepChange={setStep} />
        </div>
      ) : (
        <>
          <div className="rise" style={{ animationDelay: staggerDelay(0) }}>
            <div className="flex flex-wrap gap-1.5">
              <Badge>{topic.label}</Badge>
              {lesson.topic === 'cybersecurity' && (
                <Badge className="bg-paper-2 text-ink-soft">Defense only</Badge>
              )}
              <Badge className="bg-paper-2 text-ink-soft">{isVisual ? 'Visual' : 'Article'}</Badge>
              <Badge className="bg-paper-2 text-ink-soft">{lesson.minutes} min</Badge>
            </div>

            <h1 className="mt-3 text-[26px] font-semibold leading-[1.2] tracking-tight text-ink">
              {lesson.title}
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{lesson.dek}</p>
          </div>

          {lesson.kind === 'article' && !lesson.visual && (
            <div className="mt-5 rise" style={{ animationDelay: staggerDelay(1) }}>
              <ArticleHero topic={lesson.topic} />
            </div>
          )}

          {lesson.visual && (
            <div className="mt-5 rise" style={{ animationDelay: staggerDelay(1) }}>
              <LessonIllustration id={lesson.visual} />
            </div>
          )}

          <div className="prose-lesson mt-6 rise" style={{ animationDelay: staggerDelay(2) }}>
            {lesson.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <aside
            ref={takeawayRef}
            className="takeaway mt-8 rise"
            style={{ animationDelay: staggerDelay(3) }}
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-teal">
              Takeaway
            </p>
            <p className="mt-2 text-[16px] font-medium leading-snug text-ink">{lesson.takeaway}</p>
          </aside>
        </>
      )}

      <div
        className={chromeOn ? 'reader-chrome mt-6' : 'reader-chrome reader-chrome-off mt-6'}
      >
        {finished ? (
          <p className="text-center text-sm text-ink-soft">{SAVED_ON_DEVICE}</p>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => void finishLesson(lesson.id)}
          >
            I’m done for now
          </Button>
        )}
      </div>
    </article>
  )
}
