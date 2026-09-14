import {
  ComplementsVibrateDiagram,
  FaradayCandleDiagram,
  InertiaDiagram,
  ResonanceSwingDiagram,
  ThreatModelDiagram,
} from '../../design-export/visual-lessons'
import '../../design-export/visual-lessons/visual-lessons.css'
import { cn } from '../lib/utils'
import type { TopicId } from '../types'

const HERO_COPY: Record<TopicId, { caption: string; label: string }> = {
  physics: {
    caption: 'The carriage is still. So is the rider.',
    label: 'A carriage and rider, held still',
  },
  cybersecurity: {
    caption: 'Who can reach whom — held still.',
    label: 'A small site inside a dashed trust boundary',
  },
  stem: {
    caption: 'The flame is drawn, not burning.',
    label: 'Wax, wick, flame, and air around a candle',
  },
  painting: {
    caption: 'A quiet field of teal, held still.',
    label: 'A single teal field',
  },
  history: {
    caption: 'The swing, held at the end of a beat.',
    label: 'A swing hanging on its natural beat',
  },
  law: {
    caption: 'A small map of who stands where.',
    label: 'A small site inside a dashed trust boundary',
  },
}

function TopicStill({ topic }: { topic: TopicId }) {
  switch (topic) {
    case 'physics':
      return <InertiaDiagram step={0} />
    case 'cybersecurity':
      return <ThreatModelDiagram step={0} />
    case 'stem':
      return <FaradayCandleDiagram step={2} />
    case 'painting':
      return <ComplementsVibrateDiagram step={0} art="alone" />
    case 'history':
      return <ResonanceSwingDiagram step={0} art="beat" />
    case 'law':
      return <ThreatModelDiagram step={0} />
  }
}

export function ArticleHero({
  topic,
  className,
}: {
  topic: TopicId
  className?: string
}) {
  const copy = HERO_COPY[topic]

  return (
    <figure className={cn('article-hero', className)}>
      <div className="article-hero-still" aria-hidden>
        <TopicStill topic={topic} />
      </div>
      <figcaption className="article-hero-caption">{copy.caption}</figcaption>
      <span className="sr-only">{copy.label}</span>
    </figure>
  )
}
