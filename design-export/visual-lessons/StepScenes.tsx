import {
  ComplementsVibrateDiagram,
  FaradayCandleDiagram,
  HashFingerprintDiagram,
  InertiaDiagram,
  ResonanceSwingDiagram,
  ThreatModelDiagram,
} from './Diagrams'
import type { VisualArtToken, VisualDiagramId } from './types'

export function StepScenes({
  diagram,
  step,
  art,
}: {
  diagram: VisualDiagramId
  step: number
  art?: VisualArtToken
}) {
  switch (diagram) {
    case 'cyber-threat':
      return <ThreatModelDiagram step={step} art={art} />
    case 'stem-candle':
      return <FaradayCandleDiagram step={step} art={art} />
    case 'physics-inertia':
      return <InertiaDiagram step={step} art={art} />
    case 'cyber-hash-fingerprint':
      return <HashFingerprintDiagram step={step} art={art} />
    case 'physics-resonance-swing':
      return <ResonanceSwingDiagram step={step} art={art} />
    case 'painting-complements-vibrate':
      return <ComplementsVibrateDiagram step={step} art={art} />
  }
}
