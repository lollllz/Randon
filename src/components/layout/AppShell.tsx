import { BookOpen, Home, Library, Settings } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { useRandon } from '../../store/RandonProvider'

const NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/library', label: 'Library', icon: Library, end: false },
  { to: '/books', label: 'Books', icon: BookOpen, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
]

export function AppShell() {
  const { notice, dismissNotice, persistError } = useRandon()
  const location = useLocation()
  const lessonView =
    location.pathname.startsWith('/lesson/') || location.pathname.endsWith('/read')

  return (
    <div className="app-shell">
      {(notice || persistError) && (
        <div className="px-5 pt-4">
          <div className="rounded-2xl bg-paper-0 px-4 py-3 text-sm shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">
                  {notice?.title ?? 'Could not save to this device'}
                </p>
                <p className="mt-1 text-ink-soft">{notice?.detail ?? persistError}</p>
              </div>
              {notice && (
                <button
                  type="button"
                  className="text-xs font-semibold text-ink-soft"
                  onClick={dismissNotice}
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <main className={cn('app-main', lessonView && 'app-main-lesson')}>
        <Outlet />
      </main>

      {!lessonView && (
        <nav className="app-nav" aria-label="Home, Library, Books, Settings">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => cn('nav-link', isActive && 'nav-link-active')}
            >
              <item.icon className="size-[22px]" strokeWidth={1.75} aria-hidden />
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}
