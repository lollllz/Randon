import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../lib/utils'

export function Chip({
  selected,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'h-8 shrink-0 rounded-full px-3.5 text-[13px] font-medium transition-[background,color,border-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]',
        selected
          ? 'bg-teal text-white'
          : 'border border-line bg-paper-0 text-ink-soft',
        className,
      )}
      {...props}
    />
  )
}
