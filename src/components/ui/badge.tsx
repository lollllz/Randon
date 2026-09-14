import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-teal/10 px-2.5 py-0.5 text-[11px] font-medium text-teal',
        className,
      )}
      {...props}
    />
  )
}
