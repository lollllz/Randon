import { TOPICS } from '../data/topics'
import { cn } from '../lib/utils'
import type { TopicId } from '../types'
import { Chip } from './Chip'

export function TopicPicker({
  selected,
  onToggle,
  variant = 'cards',
}: {
  selected: TopicId[]
  onToggle: (id: TopicId) => void
  variant?: 'cards' | 'chips'
}) {
  if (variant === 'chips') {
    return (
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((topic) => (
          <Chip
            key={topic.id}
            selected={selected.includes(topic.id)}
            onClick={() => onToggle(topic.id)}
            aria-pressed={selected.includes(topic.id)}
          >
            {topic.label}
          </Chip>
        ))}
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-2 gap-2.5">
      {TOPICS.map((topic) => {
        const on = selected.includes(topic.id)
        return (
          <li key={topic.id}>
            <button
              type="button"
              onClick={() => onToggle(topic.id)}
              aria-pressed={on}
              title={topic.summary}
              className={cn('topic-card', on && 'topic-card-on')}
            >
              <span className="text-[11px] font-medium text-ink-soft">{topic.kicker}</span>
              <span className="mt-1 block text-[15px] font-semibold leading-tight text-ink">
                {topic.label}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
