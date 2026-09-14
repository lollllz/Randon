import { useState } from 'react'
import { FormatChip } from './FormatChip'
import { getVisualLesson } from './lessons'
import { StepArt } from './StepArt'
import type { VisualFormat, VisualLessonId } from './types'
import './visual-lessons.css'

export type {
  VisualArtToken,
  VisualDiagramId,
  VisualLesson,
  VisualLessonId,
  VisualLessonMeta,
  VisualLessonStep,
} from './types'
export { VISUAL_LESSONS, getVisualLesson } from './lessons'

export function LessonVisual({
  id,
  step: stepProp,
  onStepChange,
}: {
  id: VisualLessonId | string
  step?: number
  onStepChange?: (step: number) => void
}) {
  const lesson = getVisualLesson(id)
  const [internal, setInternal] = useState(0)
  const step = clamp(stepProp ?? internal, 0, lesson.steps.length - 1)
  const last = step === lesson.steps.length - 1
  const canAdvance = step < lesson.steps.length - 1

  function go(next: number) {
    const value = clamp(next, 0, lesson.steps.length - 1)
    onStepChange?.(value)
    if (stepProp === undefined) setInternal(value)
  }

  function advance() {
    if (canAdvance) go(step + 1)
  }

  return (
    <article className="vl-root">
      <div className="vl-chips">
        <FormatChip>{lesson.topicLabel}</FormatChip>
        <FormatChip quiet>{formatLabel(lesson.format)}</FormatChip>
        {lesson.defensiveOnly && <FormatChip quiet>Defense only</FormatChip>}
      </div>
      <h1 className="vl-title">{lesson.title}</h1>
      <p className="vl-dek">{lesson.excerpt}</p>

      <button
        type="button"
        className="vl-art-button"
        aria-label={canAdvance ? 'Show the next illustrated step' : 'Illustration'}
        onClick={advance}
      >
        <StepArt id={lesson.id} step={step} />
      </button>
      {canAdvance && <p className="vl-hint">Tap the picture to reveal the next step.</p>}

      <ol className="vl-cards">
        {lesson.steps.map((item, index) => {
          const on = index === step
          return (
            <li key={item.art}>
              <button
                type="button"
                className={on ? 'vl-card vl-card-on' : 'vl-card'}
                aria-current={on ? 'step' : undefined}
                onClick={() => go(index)}
              >
                <span className="vl-card-index">{index + 1}</span>
                <span className="vl-card-copy">
                  <span className="vl-card-title">{item.title}</span>
                  {on && <span className="vl-card-body">{item.body}</span>}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {last && (
        <aside className="vl-takeaway">
          <p className="vl-takeaway-kicker">Takeaway</p>
          <p>{lesson.takeaway}</p>
        </aside>
      )}
    </article>
  )
}

function formatLabel(format: VisualFormat) {
  return format === 'visual' ? 'Visual' : 'Article'
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
