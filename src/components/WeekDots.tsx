import { cn } from '../lib/utils'
import { weekDots } from '../lib/streak'

export function WeekDots({
  activeDates,
  today,
}: {
  activeDates: string[]
  today: string
}) {
  const dots = weekDots(activeDates, today)
  return (
    <ol className="flex justify-between gap-1" aria-label="This week">
      {dots.map((dot) => (
        <li key={dot.dateKey} className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">
            {dot.label}
          </span>
          <span
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              dot.isFuture
                ? 'border border-line bg-transparent'
                : dot.active
                  ? 'bg-amber'
                  : 'bg-line',
              dot.isToday && !dot.isFuture && 'ring-2 ring-amber/40 ring-offset-2 ring-offset-paper-0',
            )}
            title={dot.dateKey}
          />
        </li>
      ))}
    </ol>
  )
}
