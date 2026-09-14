import { cn } from '../lib/utils'

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  description?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className="settings-row w-full text-left"
      onClick={() => onChange(!checked)}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium text-ink">{label}</span>
        {description && (
          <span className="mt-0.5 block text-[12px] leading-snug text-ink-soft">
            {description}
          </span>
        )}
      </span>
      <span className={cn('toggle', checked && 'toggle-on')} aria-hidden>
        <span className="toggle-knob" />
      </span>
    </button>
  )
}
