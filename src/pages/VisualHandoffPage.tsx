import type { CSSProperties } from 'react'
import { LessonVisual, VISUAL_LESSONS } from '../../design-export/visual-lessons'

export function VisualHandoffPage() {
  return (
    <main className="vl-root" style={pageStyle}>
      <div style={columnStyle}>
        <p className="vl-chip vl-chip-quiet">Design export</p>
        <h1 className="vl-title">Visual lessons</h1>
        <p className="vl-dek">
          Steal pack: threat modeling, Faraday’s candle, inertia, hash fingerprint,
          resonance swing, and complements that vibrate. Vertical step cards. Resonance
          P0: still swing, in-world labels, on-beat amber parented to the seat.
        </p>
        {VISUAL_LESSONS.map((lesson) => (
          <section key={lesson.id} style={{ marginTop: 40 }}>
            <LessonVisual id={lesson.id} />
          </section>
        ))}
      </div>
    </main>
  )
}

const pageStyle: CSSProperties = {
  minHeight: '100svh',
  background: '#F7F4EF',
  padding: '28px 20px 56px',
}

const columnStyle: CSSProperties = {
  maxWidth: 390,
  margin: '0 auto',
}
