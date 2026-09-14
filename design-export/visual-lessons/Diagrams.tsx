import candleSvg from './svg/stem-candle.svg?raw'
import complementsSvg from './svg/painting-complements-vibrate.svg?raw'
import hashFingerprintSvg from './svg/cyber-hash-fingerprint.svg?raw'
import inertiaSvg from './svg/physics-inertia.svg?raw'
import resonanceSvg from './svg/physics-resonance-swing.svg?raw'
import threatSiteSvg from './svg/cyber-threat.svg?raw'
import type { VisualArtToken } from './types'

function SvgFrame({
  markup,
  step,
  art,
  label,
}: {
  markup: string
  step: number
  art?: VisualArtToken
  label: string
}) {
  const artClass = art ? ` vl-svg-art-${art}` : ''
  return (
    <div
      className={`vl-svg vl-svg-step-${step}${artClass}`}
      data-art={art}
      data-step={step}
      role="img"
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  )
}

export function ThreatModelDiagram({
  step,
  art,
}: {
  step: number
  art?: VisualArtToken
}) {
  return (
    <SvgFrame
      markup={threatSiteSvg}
      step={step}
      art={art}
      label="A small site inside a dashed trust boundary"
    />
  )
}

export function FaradayCandleDiagram({
  step,
  art,
}: {
  step: number
  art?: VisualArtToken
}) {
  return (
    <SvgFrame
      markup={candleSvg}
      step={step}
      art={art}
      label="Wax, wick, flame, and air around a candle"
    />
  )
}

export function InertiaDiagram({
  step,
  art,
}: {
  step: number
  art?: VisualArtToken
}) {
  return (
    <SvgFrame
      markup={inertiaSvg}
      step={step}
      art={art}
      label="A carriage stops; the rider’s body keeps going"
    />
  )
}

export function HashFingerprintDiagram({
  step,
  art,
}: {
  step: number
  art?: VisualArtToken
}) {
  return (
    <SvgFrame
      markup={hashFingerprintSvg}
      step={step}
      art={art}
      label="A fingerprint machine: a secret in, a fixed-length print out"
    />
  )
}

export function ResonanceSwingDiagram({
  step,
  art,
}: {
  step: number
  art?: VisualArtToken
}) {
  return (
    <SvgFrame
      markup={resonanceSvg}
      step={step}
      art={art}
      label="A swing with a natural beat; on-time pushes grow the arc"
    />
  )
}

export function ComplementsVibrateDiagram({
  step,
  art,
}: {
  step: number
  art?: VisualArtToken
}) {
  return (
    <SvgFrame
      markup={complementsSvg}
      step={step}
      art={art}
      label="Teal and a muted amber waking each other up"
    />
  )
}

export {
  ComplementsVibrateDiagram as PaintingComplementsDiagram,
  FaradayCandleDiagram as StemCandleDiagram,
  HashFingerprintDiagram as CyberHashDiagram,
  InertiaDiagram as PhysicsInertiaDiagram,
  ResonanceSwingDiagram as PhysicsResonanceDiagram,
  ThreatModelDiagram as CyberThreatDiagram,
}
