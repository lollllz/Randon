import { Link } from 'react-router-dom'

export function QuietEmpty({
  title,
  copy,
  action,
}: {
  title: string
  copy?: string
  action?: { href: string; label: string }
}) {
  return (
    <div className="empty-card mt-6 px-5 py-10 text-center">
      <svg
        className="mx-auto text-teal"
        width="72"
        height="56"
        viewBox="0 0 72 56"
        fill="none"
        aria-hidden
      >
        <rect x="8" y="10" width="56" height="36" rx="6" fill="currentColor" opacity="0.12" />
        <path
          d="M16 16h16c6 0 10 3 12 8 2-5 6-8 12-8h16v26H56c-6 0-10-3-12-8-2 5-6 8-12 8H16V16Z"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="white"
        />
      </svg>
      <p className="mt-4 text-[16px] font-semibold text-ink">{title}</p>
      {copy && <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{copy}</p>}
      {action && (
        <Link className="mt-4 inline-block text-[15px] font-semibold text-teal" to={action.href}>
          {action.label}
        </Link>
      )}
    </div>
  )
}
