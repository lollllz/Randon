export type VisualFormat = 'visual' | 'article'

export type VisualTopicId = 'cybersecurity' | 'physics' | 'stem' | 'painting'

export type VisualLessonId =
  | 'cyber-threat'
  | 'stem-candle'
  | 'physics-inertia'
  | 'cyber-hash-fingerprint'
  | 'physics-resonance-swing'
  | 'painting-complements-vibrate'

export type VisualDiagramId = VisualLessonId

export type VisualArtToken =
  | 'sketch'
  | 'valuables'
  | 'locks'
  | 'wax'
  | 'wick'
  | 'flame'
  | 'riding'
  | 'continuing'
  | 'input'
  | 'avalanche'
  | 'one-way'
  | 'reuse'
  | 'store'
  | 'beat'
  | 'mismatch'
  | 'onbeat'
  | 'split'
  | 'elsewhere'
  | 'alone'
  | 'pair'
  | 'gray'
  | 'form'
  | 'choice'

export const VISUAL_DIAGRAM_IDS: VisualDiagramId[] = [
  'cyber-threat',
  'stem-candle',
  'physics-inertia',
  'cyber-hash-fingerprint',
  'physics-resonance-swing',
  'painting-complements-vibrate',
]

export const PRODUCT_STEPPED_DIAGRAM_IDS = VISUAL_DIAGRAM_IDS

export type ProductSteppedDiagramId = VisualDiagramId

/** Older catalog / cache ids still resolve to a pack lesson. */
export const VISUAL_ID_ALIASES: Record<string, VisualLessonId> = {
  'threat-model': 'cyber-threat',
  'cyber-threat-model': 'cyber-threat',
  'faraday-candle': 'stem-candle',
  'phy-faraday-candle': 'stem-candle',
  inertia: 'physics-inertia',
  'phy-inertia': 'physics-inertia',
  'hash-fingerprint': 'cyber-hash-fingerprint',
  'resonance-swing': 'physics-resonance-swing',
  'complements-vibrate': 'painting-complements-vibrate',
}

export function resolveVisualLessonId(
  id: string | undefined,
): VisualLessonId | undefined {
  if (!id) return undefined
  if ((VISUAL_DIAGRAM_IDS as string[]).includes(id)) return id as VisualLessonId
  return VISUAL_ID_ALIASES[id]
}

export function isVisualDiagram(id: string | undefined): id is VisualDiagramId {
  return resolveVisualLessonId(id) != null
}

export function isProductSteppedDiagram(
  id: string | undefined,
): id is ProductSteppedDiagramId {
  return resolveVisualLessonId(id) != null
}

export type VisualLessonStep = {
  art: VisualArtToken
  title: string
  body: string
}

export type VisualLesson = {
  id: VisualLessonId
  title: string
  excerpt: string
  format: 'visual'
  diagram: VisualDiagramId
  topic: VisualTopicId
  topicLabel: string
  defensiveOnly?: boolean
  steps: VisualLessonStep[]
  takeaway: string
}

/** @deprecated Use VisualLesson */
export type VisualLessonMeta = VisualLesson
