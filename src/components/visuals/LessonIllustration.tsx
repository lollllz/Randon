import {
  StepArt,
} from '../../../design-export/visual-lessons'
import '../../../design-export/visual-lessons/visual-lessons.css'
import { isSteppedVisual, type VisualId } from '../../types'
import { VisualStage } from './VisualStage'

export function LessonIllustration({
  id,
  step = 0,
}: {
  id: VisualId
  step?: number
}) {
  if (isSteppedVisual(id)) {
    return <StepArt id={id} step={step} />
  }
  return <VisualStage id={id} />
}
