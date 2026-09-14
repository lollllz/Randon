# Visual lessons — steal pack

Copy-paste pack for **Visual** step-card lessons. Calm tone. No XP, confetti, Lottie, or exploit steps. Motion is **opacity and transform only**.

Tokens: cream `#F7F4EF`, teal `#3D8B84`, amber `#C9893A`. Amber is only for showing-up, avalanche, on-beat, and paint complement.

## VisualLesson shape

```ts
{
  id: VisualLessonId
  title: string
  excerpt: string          // not blurb
  format: 'visual'
  diagram: VisualDiagramId
  topic: VisualTopicId     // cybersecurity | physics | stem | painting
  topicLabel: string
  defensiveOnly?: boolean  // cyber only
  steps: { art: VisualArtToken; title: string; body: string }[]
  takeaway: string
}
```

Faraday / threat are 2–3 steps. Hash, resonance, and complements are 5 steps with **full sentences**.

## Article vs Visual chip

`FormatChip` is the quiet chip. Topic uses the teal tint. **Visual**, **Article**, and **Defense only** use the muted cream chip (`quiet`). Every lesson in this folder is `format: 'visual'`. Wire Article the same way on prose lessons:

```tsx
<FormatChip>{topicLabel}</FormatChip>
<FormatChip quiet>{kind === 'visual' ? 'Visual' : 'Article'}</FormatChip>
{defensiveOnly && <FormatChip quiet>Defense only</FormatChip>}
```

## Files

| File | Role |
| --- | --- |
| `README.md` | Wiring + reduced-motion |
| `types.ts` | `VisualLesson`, diagram ids, art tokens |
| `lessons.ts` | Copy, steps, takeaways |
| `Diagrams.tsx` | Hero stroke SVGs (loads `svg/`) |
| `StepScenes.tsx` | Diagram switch for `(diagram, step, art)` |
| `StepArt.tsx` | Scene + optional figcaption |
| `LessonVisual.tsx` | Diagram + vertical step cards (Faraday / threat shell) |
| `FormatChip.tsx` | Quiet Article / Visual / Defense only chip |
| `visual-lessons.css` | Tokens, 240ms rise, reduced-motion |
| `index.ts` | Public exports |
| `svg/cyber-threat.svg` | Dashed trust boundary + small site |
| `svg/stem-candle.svg` | Wax, wick, flame, air |
| `svg/physics-inertia.svg` | Carriage vs continuing body |
| `svg/cyber-hash-fingerprint.svg` | Fingerprint machine |
| `svg/physics-resonance-swing.svg` | Still hang; in-world labels; amber on the seat |
| `svg/painting-complements-vibrate.svg` | Large teal / amber; identical grays; quiet/awake diptych |

## Lesson ids

| Lesson id | Topic | Art tokens |
| --- | --- | --- |
| `cyber-threat` | Cybersecurity (defense only) | sketch, valuables, locks |
| `stem-candle` | STEM | wax, wick, flame |
| `physics-inertia` | Physics | riding, continuing |
| `cyber-hash-fingerprint` | Cybersecurity (defense only) | input, avalanche, one-way, reuse, store |
| `physics-resonance-swing` | Physics | beat, mismatch, onbeat, split, elsewhere |
| `painting-complements-vibrate` | Painting | alone, pair, gray, form, choice |

Product catalog aliases (older ids still resolve):

| Product / cache id | Pack id |
| --- | --- |
| `cyber-threat-model`, `threat-model` | `cyber-threat` |
| `phy-faraday-candle`, `faraday-candle` | `stem-candle` |
| `phy-inertia`, `inertia` | `physics-inertia` |
| `hash-fingerprint` | `cyber-hash-fingerprint` |
| `resonance-swing` | `physics-resonance-swing` |
| `complements-vibrate` | `painting-complements-vibrate` |

## Wiring

`visual-lessons.css` is imported from `LessonVisual.tsx`. Standalone preview: `/design/visual-lessons`.

```tsx
import { LessonVisual } from '../design-export/visual-lessons'

<LessonVisual id="cyber-threat" />
<LessonVisual id="stem-candle" />
<LessonVisual id="physics-inertia" />
<LessonVisual id="cyber-hash-fingerprint" />
<LessonVisual id="physics-resonance-swing" />
<LessonVisual id="painting-complements-vibrate" />
```

`LessonVisual` is the Faraday / threat shell: chips, title, excerpt, tappable diagram, then a **vertical stack of step cards**. The open card shows the full sentence. Tap the picture or a card to change step.

Pieces, if you assemble your own screen:

```tsx
import { FormatChip, StepArt, getVisualLesson } from '../design-export/visual-lessons'

const lesson = getVisualLesson('stem-candle')
<StepArt id={lesson.id} step={0} />
```

## Motion

Allowed: `opacity`, `transform`. Not used: Lottie, confetti, filter flicker, layout jank.

Enter: 240ms `translateY(10px)` with `cubic-bezier(0.22, 1, 0.36, 1)`.

Exclusive 5-card diagrams fade the active `data-art`. The hash lesson draws the forward arrow with `scaleX`. On-beat amber flashes only as a child of `.vl-seat`. Complements crossfade alone → pair once; grays stay still.

`prefers-reduced-motion: reduce` turns those animations off. The swing hangs still. The continuing body is shown already ahead. The on-beat shove stays visible instead of flashing.

## Resonance P0

- **SwingStill:** beat, mismatch, and the unmatched split hang use `SwingStill` / `vl-swing-still` — no pendulum loop. Only matching / on-beat uses `vl-swing-wide`.
- **In-world labels:** `Natural beat` and `on the beat` sit in the SVG. Faraday / threat / inertia keep the under-art figcaption; hash, resonance, and complements do not (no design-rule captions).
- **On-beat amber parented to the seat:** the amber shove lives inside `.vl-seat`, which lives inside `.vl-swing`. Pivot uses `transform-box: view-box`. It flashes on the beat — it is not a forever pulse outside the seat.

## Hash diagram

Teal barcode strips. Amber only on the changed digit for avalanche. Forward arrow / blocked reverse. Two metaphorical doors with the same strip (no lockpick art). Vault of strips + a lock on the secret.

## Complements

Big identical gray chips (`80×80`, same fill). No looping hum on the hero. Quiet vs awake diptych uses the same still-life composition.

## Don't

No Lottie, confetti, XP, crack/brute how-tos, Manim, or Figma. Cyber lessons are defensive only.
