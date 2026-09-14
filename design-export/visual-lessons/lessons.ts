import {
  resolveVisualLessonId,
  type VisualDiagramId,
  type VisualLesson,
  type VisualLessonId,
} from './types'

export const VISUAL_LESSONS: VisualLesson[] = [
  {
    id: 'cyber-threat',
    title: 'Threat modeling a small site',
    excerpt:
      'A dashed line around what you actually run — then name what would hurt to lose.',
    format: 'visual',
    diagram: 'cyber-threat',
    topic: 'cybersecurity',
    topicLabel: 'Cybersecurity',
    defensiveOnly: true,
    steps: [
      {
        art: 'sketch',
        title: 'Sketch',
        body: 'Start with a picture, not a scare. Browser, a small site, a notes store. The dashed line is a trust boundary: inside is what you operate. Outside is everyone else’s machine, including yours when you are just visiting.',
      },
      {
        art: 'valuables',
        title: 'Valuables',
        body: 'Name the bits that would sting to lose or reuse: sessions, accounts, the writing. “The server” is too vague. Valuables are specific. Once they have names, you can ask which path reaches them.',
      },
      {
        art: 'locks',
        title: 'Locks',
        body: 'Prefer locks you can keep doing: HTTPS on the path in, unique secrets (a manager helps), and updates. Not a fortress fantasy, and not an attack recipe — just hygiene that stays maintainable. Defense only.',
      },
    ],
    takeaway:
      'Sketch the system, name the valuables, then keep a few locks you can actually maintain.',
  },
  {
    id: 'stem-candle',
    title: 'Faraday’s candle, slowly',
    excerpt:
      'A candle is a small chemical factory with four parts you can point to: wax, wick, flame, air.',
    format: 'visual',
    diagram: 'stem-candle',
    topic: 'stem',
    topicLabel: 'STEM',
    steps: [
      {
        art: 'wax',
        title: 'Wax',
        body: 'The cylinder is stored fuel. Heat from the flame melts a little pool on top. That liquid is not yet on fire — it is fuel waiting for a road and for air hot enough to vaporize it.',
      },
      {
        art: 'wick',
        title: 'Wick',
        body: 'The wick is a quiet capillary road. Melt climbs the fibers into a hotter region, turns to vapor, and only then can it burn. Faraday’s patience was the point: look long enough and the parts separate.',
      },
      {
        art: 'flame',
        title: 'Flame and air',
        body: 'The bright leaf is a meeting place, not a solid object. Vapor meets oxygen; cooler air feeds in from the sides; quieter gases rise. Without air the factory stops, however much wax remains.',
      },
    ],
    takeaway:
      'A flame is fuel meeting air. Wax stores, the wick carries, the shape you see is the reaction.',
  },
  {
    id: 'physics-inertia',
    title: 'What inertia is actually saying',
    excerpt: 'Things keep their motion. A carriage is just one of the things.',
    format: 'visual',
    diagram: 'physics-inertia',
    topic: 'physics',
    topicLabel: 'Physics',
    steps: [
      {
        art: 'riding',
        title: 'Riding',
        body: 'While the carriage rolls, you roll with it. You do not feel a hand shoving you forward each second. You and the carriage already share a sideways speed, so you stay together.',
      },
      {
        art: 'continuing',
        title: 'Continuing',
        body: 'If the carriage stops, you do not — until a force spends that speed (the seat, the floor, your feet). Inertia is that stubbornness. It is not a fuel tank, and it is not a wish to keep moving forever in a crowd. It is: motion stays until something changes it.',
      },
    ],
    takeaway:
      'Inertia is keeping the motion you already have, until another force writes a new number.',
  },
  {
    id: 'cyber-hash-fingerprint',
    title: 'A hash as a fingerprint machine',
    excerpt:
      'Almost-identical passwords go in; totally different fingerprints come out. Easy to check, hard to undo.',
    format: 'visual',
    diagram: 'cyber-hash-fingerprint',
    topic: 'cybersecurity',
    topicLabel: 'Cybersecurity',
    defensiveOnly: true,
    steps: [
      {
        art: 'input',
        title: 'Something goes in',
        body: 'Type a short secret (coffee1). The machine always spits a fixed-length fingerprint. Same input, same print.',
      },
      {
        art: 'avalanche',
        title: 'One letter changes everything',
        body: 'coffee2 produces a totally different print. A tiny change is an avalanche.',
      },
      {
        art: 'one-way',
        title: 'The arrow only goes forward',
        body: 'Secret to print is easy; reverse is not. Checking means run the machine forward and compare.',
      },
      {
        art: 'reuse',
        title: 'Same secret, same print',
        body: 'Reuse means one leak can match many doors.',
      },
      {
        art: 'store',
        title: 'What gets stored',
        body: 'Careful systems keep fingerprints, not the secret. Still protect the secret.',
      },
    ],
    takeaway:
      'A hash is a fingerprint machine: easy to check by running forward. Store prints, not the phrase — and still protect the phrase.',
  },
  {
    id: 'physics-resonance-swing',
    title: 'Resonance — the push that arrives on time',
    excerpt:
      'The same gentle push does almost nothing — until it arrives on the swing’s own beat.',
    format: 'visual',
    diagram: 'physics-resonance-swing',
    topic: 'physics',
    topicLabel: 'Physics',
    steps: [
      {
        art: 'beat',
        title: 'A natural beat',
        body: 'A hanging seat has a natural beat — a rhythm that belongs to the rope and the seat. Wait for the return and you can feel it without a formula.',
      },
      {
        art: 'mismatch',
        title: 'Pushes that fight themselves',
        body: 'Pushes that arrive at random times fight themselves. Some add, some cancel, and the arc stays small. Strength was never the missing piece.',
      },
      {
        art: 'onbeat',
        title: 'Pushes on the beat',
        body: 'Give the same gentle shove each time the seat comes back on the beat, and the motion grows. Timing, not force, stacked the swing.',
      },
      {
        art: 'split',
        title: 'Matching versus not',
        body: 'Two seats can share a shove schedule. The one whose length matches the beat grows; the other length barely moves. Resonance is agreement, not a louder push.',
      },
      {
        art: 'elsewhere',
        title: 'Where this shows up',
        body: 'The same idea shows up in a radio tuned to a matching frequency, a voice that rings in a room, and a child who learns the beat of a swing. Where rhythm and shove agree, a small input becomes a large motion.',
      },
    ],
    takeaway: 'A gentle push on the beat grows. The same push off the beat mostly cancels.',
  },
  {
    id: 'painting-complements-vibrate',
    title: 'Complements that vibrate',
    excerpt:
      'Some color pairs make each other feel louder — without turning up the volume on either one.',
    format: 'visual',
    diagram: 'painting-complements-vibrate',
    topic: 'painting',
    topicLabel: 'Painting',
    steps: [
      {
        art: 'alone',
        title: 'Alone',
        body: 'Alone, a large teal on cream sits quietly. Nothing is wrong with quiet. The hue has room, and the eye does not have to argue.',
      },
      {
        art: 'pair',
        title: 'A neighbor wakes it up',
        body: 'Park a muted amber next to that teal and both feel more like themselves. Nobody turned up the saturation. The neighbor did the waking.',
      },
      {
        art: 'gray',
        title: 'Same gray, different company',
        body: 'A gray chip on teal and the same gray on amber do not feel like the same gray. Company changes how a color is read. The chips are identical; the neighborhood is not.',
      },
      {
        art: 'form',
        title: 'Light and shadow borrow the pair',
        body: 'Warm amber light and a cooler teal shadow is a common still-life habit. The cup starts to turn without a black smear.',
      },
      {
        art: 'choice',
        title: 'Neighbors, not enemies',
        body: 'Neighbors, not enemies. Use the pair when you want a surface to hum. Leave a hue alone when you want rest. Vibration is optional.',
      },
    ],
    takeaway: 'Complements wake each other up. You still get to choose quiet.',
  },
]

export const VISUAL_LESSON_IDS: VisualLessonId[] = VISUAL_LESSONS.map((item) => item.id)

export function getVisualLesson(id: VisualLessonId | VisualDiagramId | string) {
  const resolved = resolveVisualLessonId(id)
  const lesson = VISUAL_LESSONS.find(
    (item) => item.id === resolved || item.diagram === resolved,
  )
  if (!lesson) throw new Error(`Unknown visual lesson: ${id}`)
  return lesson
}
