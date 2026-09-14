import type { ReactNode } from 'react'
import type { LoopingVisualId } from '../../types'

function Frame({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <figure className="visual-frame" aria-label={label}>
      <div className="visual-stage">{children}</div>
      <figcaption className="visual-caption">{label}</figcaption>
    </figure>
  )
}

function Pendulum() {
  return (
    <Frame label="A pendulum’s period barely cares how wide the swing is.">
      <svg viewBox="0 0 200 160" className="h-full w-full">
        <line className="stroke-line" x1="20" y1="18" x2="180" y2="18" strokeWidth="3" />
        <g className="pendulum-arm origin-[100px_18px]">
          <line className="stroke-forest" x1="100" y1="18" x2="100" y2="118" strokeWidth="2" />
          <circle className="fill-copper" cx="100" cy="128" r="12" />
        </g>
      </svg>
    </Frame>
  )
}

function Orbit() {
  return (
    <Frame label="Enough sideways speed, and a fall becomes a closed path.">
      <svg viewBox="0 0 200 160" className="h-full w-full">
        <ellipse
          className="stroke-line fill-none"
          cx="100"
          cy="80"
          rx="70"
          ry="42"
          strokeDasharray="4 6"
        />
        <circle className="fill-copper" cx="100" cy="80" r="14" />
        <g className="orbit-dot">
          <circle className="fill-forest" cx="170" cy="80" r="7" />
        </g>
      </svg>
    </Frame>
  )
}

function Waves() {
  return (
    <Frame label="Crest meets crest; crest meets trough. The water is the sum.">
      <svg viewBox="0 0 200 160" className="h-full w-full">
        <path
          className="wave-a fill-none stroke-forest"
          d="M0 70 Q 25 40 50 70 T 100 70 T 150 70 T 200 70"
          strokeWidth="2.5"
        />
        <path
          className="wave-b fill-none stroke-copper"
          d="M0 90 Q 25 120 50 90 T 100 90 T 150 90 T 200 90"
          strokeWidth="2.5"
        />
        <path
          className="wave-sum fill-none stroke-ink"
          d="M0 80 Q 25 50 50 80 T 100 80 T 150 80 T 200 80"
          strokeWidth="3"
          opacity="0.85"
        />
      </svg>
    </Frame>
  )
}

function HashLock() {
  return (
    <Frame label="Anything can go in. A fixed-size tile comes out. You cannot unfold the tile.">
      <div className="relative flex h-full items-center justify-center gap-6 px-6">
        <div className="hash-bits" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className="hash-hopper">
          <span className="font-display text-sm text-paper">hash</span>
        </div>
        <div className="hash-out" aria-hidden>
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
    </Frame>
  )
}

function ColorWheel() {
  return (
    <Frame label="Opposites on the wheel make each other look more themselves.">
      <div className="relative grid h-full place-items-center">
        <div className="color-wheel" />
        <div className="color-pair" />
      </div>
    </Frame>
  )
}

function Helix() {
  return (
    <Frame label="Two complementary strands. Copy by unzipping; the letters pair themselves.">
      <svg viewBox="0 0 200 160" className="h-full w-full">
        {Array.from({ length: 8 }, (_, index) => {
          const y = 18 + index * 16
          const offset = index % 2 === 0 ? 22 : 8
          return (
            <g key={y} className="helix-rung" style={{ animationDelay: `${index * 120}ms` }}>
              <line
                className="stroke-sage"
                x1={70 + offset}
                y1={y}
                x2={130 - offset}
                y2={y}
                strokeWidth="2"
              />
              <circle className="fill-copper" cx={70 + offset} cy={y} r="5" />
              <circle className="fill-forest" cx={130 - offset} cy={y} r="5" />
            </g>
          )
        })}
      </svg>
    </Frame>
  )
}

function Prism() {
  return (
    <Frame label="White sunlight is a mixture. A leaf keeps some colors and reflects the rest.">
      <svg viewBox="0 0 200 160" className="h-full w-full">
        <polygon
          className="fill-paper-2 stroke-forest"
          points="100,28 156,128 44,128"
          strokeWidth="2"
        />
        <g className="prism-fan">
          <rect x="132" y="78" width="48" height="6" rx="3" className="fill-red-400" />
          <rect x="136" y="88" width="44" height="6" rx="3" className="fill-amber-400" />
          <rect x="140" y="98" width="40" height="6" rx="3" className="fill-emerald-500" />
          <rect x="136" y="108" width="44" height="6" rx="3" className="fill-sky-500" />
          <rect x="132" y="118" width="48" height="6" rx="3" className="fill-violet-500" />
        </g>
        <line className="stroke-ink/40" x1="18" y1="80" x2="78" y2="80" strokeWidth="3" />
      </svg>
    </Frame>
  )
}

function Scales() {
  return (
    <Frame label="The burden is which side loses if the evidence is a tie.">
      <svg viewBox="0 0 200 160" className="h-full w-full">
        <g className="scales-beam origin-[100px_48px]">
          <line className="stroke-ink" x1="40" y1="48" x2="160" y2="48" strokeWidth="3" />
          <circle className="fill-forest" cx="100" cy="48" r="5" />
          <path className="stroke-copper fill-none" d="M40 52 l-16 36 h32 z" strokeWidth="2" />
          <path className="stroke-forest fill-none" d="M160 52 l-16 36 h32 z" strokeWidth="2" />
        </g>
        <line className="stroke-line" x1="100" y1="48" x2="100" y2="128" strokeWidth="3" />
        <rect className="fill-line" x="72" y="128" width="56" height="8" rx="2" />
      </svg>
    </Frame>
  )
}

function Timeline() {
  return (
    <Frame label="Events in a line: not because time is simple, but because stories need an order.">
      <div className="flex h-full items-center px-8">
        <div className="timeline-track">
          {['then', 'and', 'then', 'now'].map((label, index) => (
            <div
              key={`${label}-${index}`}
              className="timeline-node"
              style={{ animationDelay: `${index * 220}ms` }}
            >
              <span />
              <em>{label}</em>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  )
}

function Ice() {
  return (
    <Frame label="Frozen water locks into an open lattice — more space, less density, a floating lid.">
      <svg viewBox="0 0 200 160" className="h-full w-full">
        {Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 4 }, (_, col) => {
            const x = 40 + col * 40 + (row % 2) * 20
            const y = 40 + row * 36
            return (
              <g key={`${row}-${col}`} className="ice-cell" style={{ animationDelay: `${(row + col) * 90}ms` }}>
                <polygon
                  className="fill-none stroke-forest-2"
                  points={`${x},${y - 14} ${x + 12},${y - 7} ${x + 12},${y + 7} ${x},${y + 14} ${x - 12},${y + 7} ${x - 12},${y - 7}`}
                  strokeWidth="1.5"
                />
                <circle className="fill-sage" cx={x} cy={y} r="3.5" />
              </g>
            )
          }),
        )}
      </svg>
    </Frame>
  )
}

const VISUALS: Record<LoopingVisualId, () => ReactNode> = {
  pendulum: Pendulum,
  orbit: Orbit,
  waves: Waves,
  'hash-lock': HashLock,
  'color-wheel': ColorWheel,
  helix: Helix,
  prism: Prism,
  scales: Scales,
  timeline: Timeline,
  ice: Ice,
}

export function VisualStage({ id }: { id: LoopingVisualId }) {
  const Scene = VISUALS[id]
  return <Scene />
}
