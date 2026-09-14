import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-[16px] bg-paper-0 shadow-[var(--shadow-card)]', className)}
      {...props}
    />
  )
}
