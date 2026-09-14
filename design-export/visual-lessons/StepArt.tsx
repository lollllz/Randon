import { getVisualLesson } from './lessons'
import { StepScenes } from './StepScenes'
import type { VisualDiagramId, VisualLessonId } from './types'

const CAPTION_DIAGRAMS: VisualDiagramId[] = [
  'cyber-threat',
  'stem-candle',
  'physics-inertia',
]

export function StepArt({
  id,
  step,
}: {
  id: VisualLessonId | VisualDiagramId | string
  step: number
}) {
  const lesson = getVisualLesson(id)
  const current = lesson.steps[Math.min(step, lesson.steps.length - 1)]
  const art = current?.art
  const title = current?.title ?? ''
  const showCaption = CAPTION_DIAGRAMS.includes(lesson.diagram)

  return (
    <figure className="vl-stage" data-step={step} data-art={art}>
      <StepScenes diagram={lesson.diagram} step={step} art={art} />
      {showCaption && <figcaption className="vl-caption">{title}</figcaption>}
    </figure>
  )
}
