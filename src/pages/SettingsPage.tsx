import { Check } from 'lucide-react'
import { useState } from 'react'
import { TopicPicker } from '../components/TopicPicker'
import { Toggle } from '../components/Toggle'
import { WeekDots } from '../components/WeekDots'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Chip } from '../components/Chip'
import { TOPIC_BY_ID } from '../data/topics'
import { pickBackupFile, saveBackupJson } from '../lib/backup'
import { daysThisMonth } from '../lib/streak'
import { useRandon } from '../store/RandonProvider'
import type { Appearance, TopicId } from '../types'

const THEMES: { id: Appearance['theme']; label: string; hint: string }[] = [
  { id: 'system', label: 'System', hint: 'Match this device' },
  { id: 'light', label: 'Light', hint: 'Cream page' },
  { id: 'dark', label: 'Dark', hint: 'Warm dark' },
]

export function SettingsPage() {
  const {
    profile,
    streak,
    todayKey,
    appearance,
    updateTopics,
    updateAppearance,
    backupPayload,
    restoreBackup,
    resetAll,
  } = useRandon()
  const [topics, setTopics] = useState<TopicId[]>(profile?.topics ?? [])
  const [editing, setEditing] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [exportProgress, setExportProgress] = useState<number | null>(null)
  const [exportDone, setExportDone] = useState(false)
  const monthDays = daysThisMonth(streak.activeDates, todayKey)

  function toggle(id: TopicId) {
    setTopics((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  async function saveTopics() {
    if (topics.length === 0) {
      setStatus('Keep at least one topic so there is something to draw.')
      return
    }
    setBusy(true)
    await updateTopics(topics)
    setBusy(false)
    setEditing(false)
    setStatus('Topics saved on this device.')
  }

  async function exportJson() {
    setBusy(true)
    setStatus(null)
    setExportDone(false)
    setExportProgress(12)
    const tick = window.setInterval(() => {
      setExportProgress((value) => (value === null ? 12 : Math.min(value + 18, 86)))
    }, 80)
    try {
      const payload = backupPayload()
      await wait(160)
      setExportProgress(92)
      const result = await saveBackupJson(payload)
      if (result === 'saved') {
        setStatus('Library exported as JSON.')
        setExportProgress(100)
        setExportDone(true)
        window.setTimeout(() => {
          setExportDone(false)
          setExportProgress(null)
        }, 1400)
      } else {
        setExportProgress(null)
      }
    } catch {
      setExportProgress(null)
      setStatus('Could not export. Allow downloads or site storage and try again.')
    }
    window.clearInterval(tick)
    setBusy(false)
  }

  async function importJson() {
    setBusy(true)
    setStatus(null)
    try {
      const payload = await pickBackupFile()
      await restoreBackup(payload)
      setTopics(payload.profile?.topics ?? [])
      setStatus('Backup restored on this device.')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setStatus(null)
      } else {
        setStatus(
          error instanceof Error ? error.message : 'Could not read that Randon backup.',
        )
      }
    }
    setBusy(false)
  }

  return (
    <div className="page rise">
      <h1 className="text-[28px] font-semibold tracking-tight text-ink">Settings</h1>

      <section className="mt-6">
        <p className="section-label">Reading</p>
        <Card className="mt-2 overflow-hidden">
          <div className="px-4 py-4">
            <p className="text-[28px] font-semibold tracking-tight text-ink">
              {monthDays} {monthDays === 1 ? 'day' : 'days'} this month
            </p>
            <p className="mt-1 text-[13px] text-ink-soft">Showing up is enough.</p>
            <div className="mt-4">
              <WeekDots activeDates={streak.activeDates} today={todayKey} />
            </div>
          </div>
          <div className="hairline" />
          <div className="px-4">
            <Toggle
              checked={appearance.showRhythmOnHome}
              onChange={(next) => void updateAppearance({ showRhythmOnHome: next })}
              label="Show reading rhythm on Home"
              description="A quiet week strip. Off by default."
            />
          </div>
          <div className="hairline" />
          <div className="px-4 py-3">
            <div className="settings-row px-0">
              <h2 className="text-[15px] font-medium text-ink">Your topics</h2>
              <button
                type="button"
                className="text-sm font-semibold text-teal"
                onClick={() => setEditing((value) => !value)}
              >
                {editing ? 'Close' : 'Edit'}
              </button>
            </div>
            {!editing ? (
              <p className="pb-1 text-sm leading-relaxed text-ink-soft">
                {topics.map((id) => TOPIC_BY_ID[id].label).join(' · ')}
              </p>
            ) : (
              <div className="pb-1">
                <TopicPicker variant="chips" selected={topics} onToggle={toggle} />
                <Button className="mt-3 w-full" disabled={busy} onClick={() => void saveTopics()}>
                  Save topics
                </Button>
              </div>
            )}
          </div>
        </Card>
      </section>

      <section className="mt-6">
        <p className="section-label">Appearance</p>
        <Card className="mt-2 px-4 py-4">
          <p className="text-[15px] font-medium text-ink">Theme</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {THEMES.map((theme) => (
              <Chip
                key={theme.id}
                selected={appearance.theme === theme.id}
                onClick={() => void updateAppearance({ theme: theme.id })}
              >
                {theme.label}
              </Chip>
            ))}
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
            {THEMES.find((theme) => theme.id === appearance.theme)?.hint}
            {appearance.theme === 'system'
              ? ' — Dark when this device is dark, Light when it is light.'
              : '.'}
          </p>
          <p className="mt-4 text-[15px] font-medium text-ink">Lesson text</p>
          <div className="mt-3 flex gap-2">
            <Chip
              selected={appearance.textScale === 'comfortable'}
              onClick={() => void updateAppearance({ textScale: 'comfortable' })}
            >
              Comfortable
            </Chip>
            <Chip
              selected={appearance.textScale === 'large'}
              onClick={() => void updateAppearance({ textScale: 'large' })}
            >
              Large
            </Chip>
          </div>
        </Card>
      </section>

      <section className="mt-6">
        <p className="section-label">Data</p>
        <Card className="mt-2 px-4 py-4">
          <p className="text-sm leading-relaxed text-ink-soft">
            Everything stays on this device.
          </p>
          <Button
            className="mt-3 w-full"
            disabled={busy}
            onClick={() => void exportJson()}
          >
            Export JSON
          </Button>
          {exportProgress !== null && (
            <div className="mt-3 flex items-center gap-3">
              <div className="progress-linear flex-1" aria-hidden>
                <span style={{ width: `${exportProgress}%` }} />
              </div>
              {exportDone && <Check className="export-check size-4 text-teal" aria-hidden />}
            </div>
          )}
          <button
            type="button"
            className="settings-row mt-1 w-full px-0 text-left"
            disabled={busy}
            onClick={() => void importJson()}
          >
            <span className="text-[15px] text-ink">Import backup</span>
          </button>
          {!confirmReset ? (
            <button
              type="button"
              className="settings-row w-full px-0 text-left text-[#b42318]"
              onClick={() => setConfirmReset(true)}
            >
              Clear local data
            </button>
          ) : (
            <div className="py-3">
              <p className="text-sm text-ink-soft">
                This erases topics, reading history, cached lessons, and saved books on this
                device.
              </p>
              <div className="mt-3 flex gap-2">
                <Button variant="danger" size="sm" onClick={() => void resetAll()}>
                  Clear everything
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      </section>

      <section className="mt-6 mb-2">
        <p className="section-label">About</p>
        <Card className="mt-2 px-4 py-4">
          <p className="text-[16px] font-semibold text-ink">Randon</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            A local-first daily lesson app. No account, no cloud sync. Lessons and books you
            open are stored in this browser.
          </p>
        </Card>
      </section>

      {status && <p className="mt-3 text-sm text-teal">{status}</p>}
    </div>
  )
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
