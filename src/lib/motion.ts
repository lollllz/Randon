import type { NavigateFunction } from 'react-router-dom'

export function staggerDelay(index: number, step = 40) {
  return `${Math.min(index, 8) * step}ms`
}

export function navigateWithMorph(navigate: NavigateFunction, to: string) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || typeof document.startViewTransition !== 'function') {
    navigate(to)
    return
  }
  document.startViewTransition(() => {
    navigate(to)
  })
}

export function isReaderControl(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(target.closest('button, a, input, textarea, .vl-art-button, .vl-stage, .vl-step, .vl-card, .vl-cards'))
  )
}
