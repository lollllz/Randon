import { useMemo, useState } from 'react'
import { TopicPicker } from './TopicPicker'
import { useRandon } from '../store/RandonProvider'
import { TOPIC_IDS, type TopicId } from '../types'
import { Button } from './ui/button'

export function Onboarding() {
  const { completeOnboarding } = useRandon()
  const [step, setStep] = useState<1 | 2>(1)
  const [selected, setSelected] = useState<TopicId[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ready = selected.length > 0

  const hint = useMemo(() => {
    if (selected.length === 0) return 'Pick at least one topic. You can change this later.'
    if (selected.length === 1) return 'One topic — a focused daily draw.'
    return `${selected.length} topics. Today’s lesson will come from one of them.`
  }, [selected.length])

  function toggle(id: TopicId) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  async function finish(topics: TopicId[]) {
    if (topics.length === 0) return
    setSaving(true)
    setError(null)
    try {
      await completeOnboarding(topics)
    } catch {
      setError('Could not save topics on this device. Allow site storage and try again.')
      setSaving(false)
    }
  }

  return (
    <div className="onboard">
      <div className="onboard-panel rise">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="mark" aria-hidden>
              R
            </span>
            <p className="text-sm font-semibold tracking-tight text-ink">Randon</p>
          </div>
          <button
            type="button"
            className="text-[13px] font-semibold text-ink-soft"
            disabled={saving}
            onClick={() => void finish([...TOPIC_IDS])}
          >
            Skip
          </button>
        </div>

        {step === 1 ? (
          <>
            <h1 className="mt-10 text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
              A short lesson when you have a minute.
            </h1>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
              Each day Randon draws one piece from topics you like. No account — everything
              stays on this device.
            </p>
            <div className="mt-auto pt-10">
              <Button size="lg" onClick={() => setStep(2)}>
                Choose topics
              </Button>
              <button
                type="button"
                className="mt-3 w-full text-center text-[13px] font-medium text-ink-soft"
                disabled={saving}
                onClick={() => void finish([...TOPIC_IDS])}
              >
                Skip for now
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-8 text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
              What are you curious about?
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              Choose a few. You can change this anytime in Settings.
            </p>
            <div className="mt-6 flex-1">
              <TopicPicker variant="chips" selected={selected} onToggle={toggle} />
            </div>
            <div className="mt-6">
              <p className="mb-3 text-sm text-ink-soft">{hint}</p>
              <Button size="lg" disabled={!ready || saving} onClick={() => void finish(selected)}>
                {saving ? 'Saving…' : 'Start learning'}
              </Button>
              {error && <p className="mt-2 text-sm text-[#b42318]">{error}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
