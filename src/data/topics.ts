import type { TopicId } from '../types'

export type TopicMeta = {
  id: TopicId
  label: string
  kicker: string
  summary: string
  hue: string
  cover: string
}

export const TOPICS: TopicMeta[] = [
  {
    id: 'physics',
    label: 'Physics',
    kicker: 'Motion & light',
    summary: 'Why the world moves the way it does — orbits, waves, and stubborn constants.',
    hue: '#3d8b84',
    cover: '#d7ebe8',
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    kicker: 'Defense only',
    summary: 'How to stay safer online: habits, history, and the ideas behind protection.',
    hue: '#2f6f6a',
    cover: '#cfe0de',
  },
  {
    id: 'stem',
    label: 'STEM Science',
    kicker: 'Life & matter',
    summary: 'Biology, chemistry, and the scale of living systems — curious, not clinical.',
    hue: '#5b8a62',
    cover: '#dce8d6',
  },
  {
    id: 'painting',
    label: 'Painting',
    kicker: 'Seeing & making',
    summary: 'Color, light, and the craft of putting pigment where the eye wants it.',
    hue: '#c47a6a',
    cover: '#f0ddd6',
  },
  {
    id: 'history',
    label: 'History',
    kicker: 'People & time',
    summary: 'How we know the past, and the networks that moved goods, germs, and ideas.',
    hue: '#b0894b',
    cover: '#ebe1d0',
  },
  {
    id: 'law',
    label: 'Law',
    kicker: 'Rules & reasons',
    summary: 'How legal systems argue, remember, and try (imperfectly) to be fair.',
    hue: '#6a7a9b',
    cover: '#d9dee8',
  },
]

export const TOPIC_BY_ID = Object.fromEntries(
  TOPICS.map((topic) => [topic.id, topic]),
) as Record<TopicId, TopicMeta>
