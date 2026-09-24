import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Onboarding } from './components/Onboarding'
import { BookDetailPage } from './pages/BookDetailPage'
import { BookReadPage } from './pages/BookReadPage'
import { BooksPage } from './pages/BooksPage'
import { LessonPage } from './pages/LessonPage'
import { LibraryPage } from './pages/LibraryPage'
import { SettingsPage } from './pages/SettingsPage'
import { TodayPage } from './pages/TodayPage'
import { VisualHandoffPage } from './pages/VisualHandoffPage'
import { useRandon } from './store/RandonProvider'

export default function App() {
  const { status, profile } = useRandon()

  if (status === 'booting') {
    return <BootScreen />
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <Routes>
        <Route path="/design/visual-lessons" element={<VisualHandoffPage />} />
        {profile ? (
          <Route element={<AppShell />}>
            <Route path="/" element={<TodayPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/lesson/:id" element={<LessonPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/books/:id/read" element={<BookReadPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          <Route path="*" element={<Onboarding />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}

function BootScreen() {
  return (
    <div className="grid min-h-svh place-items-center bg-paper px-6">
      <div className="text-center">
        <span className="mark mx-auto">R</span>
        <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">Randon</p>
        <p className="mt-2 text-sm text-ink-soft">Loading your library from this device…</p>
      </div>
    </div>
  )
}
