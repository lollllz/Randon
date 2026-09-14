import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-teal text-white hover:bg-teal-2',
        copper: 'bg-amber text-ink hover:brightness-105',
        outline: 'border border-line bg-paper-0 text-ink hover:bg-paper-2',
        ghost: 'text-ink-soft hover:bg-paper-2 hover:text-ink',
        danger: 'border border-line bg-paper-0 text-[#b42318] hover:bg-[#fdecea]',
      },
      size: {
        md: 'h-11 px-5 text-[15px]',
        sm: 'h-9 px-3.5 text-sm',
        lg: 'h-12 w-full px-6 text-[15px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}
