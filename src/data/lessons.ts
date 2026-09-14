import {
  getVisualLesson,
  isProductSteppedDiagram,
  type VisualLessonId,
} from '../../design-export/visual-lessons'
import type { Lesson } from '../types'

function fromSteppedVisual(
  packId: VisualLessonId,
  minutes: number,
  lessonId: string = packId,
): Lesson {
  const meta = getVisualLesson(packId)
  if (!isProductSteppedDiagram(meta.diagram)) {
    throw new Error(`Visual ${packId} is not wired as a stepped diagram`)
  }
  return {
    id: lessonId,
    topic: meta.topic,
    kind: meta.format,
    visual: meta.diagram,
    title: meta.title,
    dek: meta.excerpt,
    minutes,
    body: meta.steps.map((item) => item.body),
    takeaway: meta.takeaway,
  }
}

export const LESSONS: Lesson[] = [
  {
    id: 'phy-pendulum',
    topic: 'physics',
    kind: 'visual',
    visual: 'pendulum',
    title: 'Why a pendulum keeps the same beat',
    dek: 'Galileo noticed a hanging lamp, and timekeeping was never the same.',
    minutes: 3,
    body: [
      'Watch the bob swing. Long arcs and short arcs take almost the same time to come back. That stubborn sameness is why a pendulum can be a clock: the beat is set more by the length of the rod than by how hard you push it.',
      'Galileo is said to have noticed this in a cathedral, timing a swinging lamp against his pulse. Whether or not the story is tidy, the physics is. For small swings, the period is roughly 2π times the square root of length over gravity. Double the length and the clock slows; take it to the Moon and it slows too, because g is smaller.',
      'A real clock still needs an escape to give the pendulum a tiny tap each swing, or friction would win. The idea underneath is conservation and restoring force: pull the bob aside and gravity tugs it back, not sideways, in a way that makes the timing almost independent of amplitude.',
    ],
    takeaway:
      'A pendulum’s tempo is mostly length and gravity — which is why clocks could be tuned by a screw, not by swinging harder.',
  },
  {
    id: 'phy-orbit',
    topic: 'physics',
    kind: 'visual',
    visual: 'orbit',
    title: 'An orbit is a miss that never ends',
    dek: 'Newton’s cannonball thought experiment, still the cleanest picture of falling forever.',
    minutes: 3,
    body: [
      'Imagine a mountain so tall it pokes above the air, and a cannon that can fire sideways as hard as you like. A lazy shot hits the ground nearby. A faster shot travels farther as Earth curves away beneath it. Fast enough, the ground keeps falling away at the same rate the ball falls — and the ball never lands.',
      'That is an orbit: continuous free-fall with enough sideways speed. The International Space Station is not “beyond gravity.” It is moving sideways at about 7.7 km/s, so it falls around the planet instead of into it. Astronauts float because they and the station fall together.',
      'Ellipse, circle, parabola, hyperbola — those are the family of paths you get from an inverse-square pull plus some speed. You do not need a new force called weightlessness. You need enough velocity that the curve of the fall matches the curve of the world.',
    ],
    takeaway:
      'Satellites do not escape gravity; they fall and miss the Earth, continuously.',
  },
  {
    id: 'phy-waves',
    topic: 'physics',
    kind: 'visual',
    visual: 'waves',
    title: 'Two waves can sit in the same place',
    dek: 'Superposition is why noise-canceling headphones work and why radio is a crowd.',
    minutes: 3,
    body: [
      'Ripples on a pond do not bounce off each other like billiard balls. They pass through. Where a crest meets a crest, the water is higher. Where a crest meets a trough, they can cancel and the surface looks almost still. That add-and-cancel rule is superposition.',
      'Sound in air is a pressure wave, so the same trick applies. A headphone that listens to the rumble of an engine can play the inverted rumble. The two pressure patterns add toward quiet — not because the noise was blocked like a wall, but because another wave was built to undo it.',
      'Light does this too, which is why a soap bubble shows color: different thicknesses send different wavelengths out of step. Radio stations share the sky by occupying different frequencies, each a wave riding through the same space without knocking the others out of the air.',
    ],
    takeaway:
      'Waves add. They can reinforce, cancel, or ignore one another — and still occupy the same room.',
  },
  {
    id: 'phy-sky',
    topic: 'physics',
    kind: 'article',
    title: 'Why the sky is blue and sunsets are red',
    dek: 'A molecule-sized reason you can check every clear afternoon.',
    minutes: 3,
    body: [
      'Sunlight is a mix of colors. Air molecules are tiny compared with those wavelengths, and they scatter shorter (bluer) light more strongly than longer (redder) light. Look away from the Sun at noon and you are looking at that scattered blue, coming at you from every direction.',
      'At sunset the light that still reaches you has traveled through much more air. The blue has been scattered out of the beam along the way, which leaves the surviving light skewed toward orange and red. Dust and wildfire smoke can push the show even further by scattering the rest.',
      'Water droplets in clouds are much larger, so they scatter all visible wavelengths more evenly — which is why clouds look white or gray rather than blue. The sky’s color is not a pigment. It is a size effect.',
    ],
    takeaway:
      'Blue skies are scattered leftover light; red sunsets are what remains after the blue has been scattered away.',
  },
  {
    id: 'phy-c',
    topic: 'physics',
    kind: 'article',
    title: 'The speed of light is a speed limit, not a suggestion',
    dek: 'c is less about racing photons and more about cause and effect.',
    minutes: 4,
    body: [
      'Nothing with mass can be boosted all the way to the speed of light in vacuum. As you pour in energy, you get more momentum and more “resistance to speeding up,” not a ticket to c. Light itself can go that fast because it has no rest mass to drag along.',
      'The stranger consequence is about order. If you could send a signal faster than light, some observers could see effects arrive before their causes. Relativity protects a consistent before-and-after. That is why physicists treat c as a conversion between space and time, not just a racing statistic.',
      'You already live with a slow-motion version: GPS satellites must account for both their speed and weaker gravity, or your maps would drift. The limit is not a lab curiosity. It is baked into how clocks disagree when they move.',
    ],
    takeaway:
      'c caps how quickly influence can travel — which keeps cause and effect from swapping places.',
  },
  {
    id: 'phy-energy',
    topic: 'physics',
    kind: 'article',
    title: 'Energy doesn’t vanish. It changes outfits.',
    dek: 'A bouncing ball is a tiny accounting lesson.',
    minutes: 3,
    body: [
      'Lift a tennis ball and you have stored gravitational energy. Drop it and that store becomes motion. At the bounce, motion briefly becomes compression in the rubber, then motion again. Each bounce is a little lower because some of the account was paid out as heat and sound in the floor and the air.',
      'Nothing in that story was destroyed. The ledger moved: gravitational, kinetic, elastic, thermal. Engines, muscles, and power plants are all machines for changing the outfit, never for minting energy from nowhere.',
      'The useful punchline is quality, not just quantity. Heat spread into a room is still energy, but it is harder to turn back into a tidy bounce. Conservation tells you the sum; thermodynamics tells you which forms still do work.',
    ],
    takeaway:
      'Track the forms. If a bounce looks like a loss, look for heat — it is usually hiding there.',
  },
  fromSteppedVisual('stem-candle', 4),
  fromSteppedVisual('physics-inertia', 3),
  fromSteppedVisual('physics-resonance-swing', 4),
  {
    id: 'cyber-passwords',
    topic: 'cybersecurity',
    kind: 'article',
    title: 'One password, many doors, one breach',
    dek: 'Reuse is the habit attackers like — without needing a clever trick.',
    minutes: 3,
    body: [
      'Most account takeovers are not movie-hacking. Someone obtains a list of emails and passwords from one breached site, then tries those same pairs on email, banks, and work tools. If you reused the phrase, the second door opens with the first key.',
      'A password manager lets each door have its own long secret, so a leak at a throwaway forum does not become a leak everywhere. Unique secrets plus a second factor (an app prompt, a hardware key) turn a stolen list into a much smaller emergency.',
      'Length beats clever substitutions. “A full sentence you can remember” or a random manager-generated string both outperform P@ssw0rd1. Change a password when a service you used is in the news for a breach — not on a nervous calendar that burns you out.',
    ],
    takeaway:
      'Unique passwords contain a breach. Reuse spreads it. A manager is how humans actually do uniqueness.',
  },
  {
    id: 'cyber-hash',
    topic: 'cybersecurity',
    kind: 'visual',
    visual: 'hash-lock',
    title: 'A hash is a one-way fingerprint',
    dek: 'Why sites should store something they cannot turn back into your password.',
    minutes: 3,
    body: [
      'A cryptographic hash takes any input — a password, a file, a message — and folds it into a short, fixed-size fingerprint. Change one character and the fingerprint looks unrelated. You can check a match by hashing again. You are not supposed to be able to reverse the fingerprint into the original.',
      'That is why a well-run service stores a hashed (and salted) password rather than the password itself. A stolen database of fingerprints is still bad, but it is not a gift-wrapped list of everyone’s actual secrets. Salting means two people with the same password do not look the same in the file.',
      'Hashes also guard downloads: if the published fingerprint of an installer does not match what you got, the file was altered or corrupted. The picture to keep is a hopper: things go in, a tile comes out, and the tile is not a recipe for rebuilding what went in.',
    ],
    takeaway:
      'Hashes compare and detect tampering. They are not encryption, and they should not be reversible.',
  },
  fromSteppedVisual('cyber-hash-fingerprint', 4),
  fromSteppedVisual('cyber-threat', 4),
  {
    id: 'cyber-phishing',
    topic: 'cybersecurity',
    kind: 'article',
    title: 'Phishing is theater with your logo',
    dek: 'The tell is usually the stage directions, not the spelling.',
    minutes: 3,
    body: [
      'A phishing message wants a click or a reply: a fake login, a wire, a password “confirmation.” It borrows urgency (your account will close), authority (IT, a bank, a boss), and familiarity (a logo you trust). The craft is social, not technical.',
      'Hover — or long-press on a phone — and read the actual destination before you tap. Check the sender as an address, not a display name. Real companies rarely ask you to paste a password into an email. When in doubt, open the app or site yourself from a bookmark, not from the message.',
      'If you already clicked, do not freeze. Change the password on that account from a page you typed, turn on a second factor, and tell the real institution through a published phone number or in-app chat. Speed helps more than shame.',
    ],
    takeaway:
      'Pause on urgency. Inspect the real address. Navigate to the service yourself instead of following the message.',
  },
  {
    id: 'cyber-updates',
    topic: 'cybersecurity',
    kind: 'article',
    title: 'Updates are how yesterday’s holes get closed',
    dek: 'Patching is hygiene, not a personality trait.',
    minutes: 3,
    body: [
      'Software is written by people, so it ships with mistakes. Some mistakes become ways for malware to run. Vendors publish updates that close those holes after they are found — sometimes after they are already being used in the wild.',
      'Turning updates off to “keep things stable” is a trade: you keep today’s quirks and you keep yesterday’s known defects. Browsers, phones, and operating systems are safest when they update themselves. For everything else, a weekly pass beats a yearly panic.',
      'You do not need to read the changelog. You need the bits to land. Backup first if a machine is precious, then let the update finish. Unpatched internet-facing software is one of the most common ways incidents start — and one of the most boring to prevent.',
    ],
    takeaway:
      'Most “hacks” of ordinary devices exploit known, already-fixed problems. Installing the fix is the whole move.',
  },
  {
    id: 'cyber-https',
    topic: 'cybersecurity',
    kind: 'article',
    title: 'What the padlock actually promises',
    dek: 'HTTPS encrypts the road. It does not vouch for the destination.',
    minutes: 3,
    body: [
      'HTTPS means your browser and the server agreed on keys so a café Wi-Fi snoop should see scrambled traffic, not your password in the clear. The padlock says the road is wrapped. It does not say the shop at the end is honest.',
      'Certificates are how the browser checks it is talking to the domain in the address bar, not an impostor on the local network. That is why you still have to read the name: bankofexample.com is not bankofexamp1e.com, padlock or not.',
      'On a public network, prefer HTTPS sites and your phone’s official apps. A VPN can hide which sites you visit from the café, but it does not make a fake site real. The address bar is still the ground truth.',
    ],
    takeaway:
      'The padlock encrypts transit and checks the domain. You still have to trust — and type — the right name.',
  },
  {
    id: 'cyber-morris',
    topic: 'cybersecurity',
    kind: 'visual',
    visual: 'timeline',
    title: 'The Morris worm, 1988',
    dek: 'An experiment that got away, and the morning after for the young internet.',
    minutes: 4,
    body: [
      'In November 1988 a Cornell graduate student released a self-copying program onto the ARPANET. It was meant to gauge the network’s size. A replication bug made it infect machines over and over, crowding them until large parts of the early internet staggered.',
      'The worm did not need a cinematic “break-in.” It reused several ordinary weaknesses of the time: guessable passwords, debug features left on, trust between machines that shared resources. The lesson that stuck was less about genius and more about sloppy defaults plus curiosity without brakes.',
      'The aftermath created the first Computer Emergency Response Team and a public argument about whether “I was just looking” is an excuse when software can multiply. Defense culture still carries that scar: assume programs will copy themselves if you let them, and design so one mistake does not become everyone’s outage.',
    ],
    takeaway:
      'The first famous internet worm was a runaway experiment. The durable lesson is containment, not clever offense.',
  },
  {
    id: 'stem-photo',
    topic: 'stem',
    kind: 'visual',
    visual: 'prism',
    title: 'Leaves are sunlight factories',
    dek: 'Photosynthesis is less a miracle and more a supply chain.',
    minutes: 3,
    body: [
      'A leaf is a thin factory. Water arrives through plumbing in the stem. Carbon dioxide sneaks in through pores. Light is the power bill. Inside chloroplasts, pigments catch certain wavelengths and start a relay that eventually stitches CO₂ into sugars.',
      'The waste product is the oxygen we breathe — leftover from splitting water. That is an outrageous fact to get used to: the air in your lungs is, in geological bulk, the exhaust of ancient and living plants and cyanobacteria.',
      'Green is what the leaf reflects, not a mystical “life color.” It is the leftover light after chlorophyll grabs reds and blues. In autumn, when the green machinery is packed away, the yellows and oranges that were always there get a turn on stage.',
    ],
    takeaway:
      'Photosynthesis stores sunlight as sugar and incidentally filled the sky with oxygen.',
  },
  {
    id: 'stem-dna',
    topic: 'stem',
    kind: 'visual',
    visual: 'helix',
    title: 'DNA is a recipe, not a blueprint',
    dek: 'The double helix holds instructions. Context decides the dish.',
    minutes: 3,
    body: [
      'The famous spiral is a filing system: two strands, complementary letters, a way to copy a message by unzipping and rebuilding. Genes are stretches of that message that can be read into RNA and, often, into proteins — the cell’s tools and scaffolding.',
      'Calling it a blueprint oversells the rigidity. The same genome is in a neuron and a skin cell; what differs is which chapters are open. Development, environment, and chance annotate the recipe as it cooks.',
      'Copying is good but not perfect. Most typos are silent or repaired. Some change a protein. Rarely, a change is useful. Evolution is that accounting over populations and time, not a march toward a predetermined form.',
    ],
    takeaway:
      'DNA stores copyable instructions. Which instructions run — and how they land — depends on the cell’s life.',
  },
  {
    id: 'stem-ice',
    topic: 'stem',
    kind: 'visual',
    visual: 'ice',
    title: 'Why ice floats (and why that matters)',
    dek: 'Water is weird, and lakes survive winter because of it.',
    minutes: 3,
    body: [
      'Most solids sink in their own liquid. Ice does not. As water freezes, molecules lock into an open crystal that takes more space than the jostling liquid, so the solid is less dense and rides on top.',
      'That lid of ice insulates the water below. Fish do not live in a solid block each January. If ice sank, lakes could freeze from the bottom up and winter would be a much more final season for freshwater life.',
      'The same hydrogen-bond clinginess gives water a high heat capacity: oceans swallow and release energy slowly, which steadies climate. A “simple” molecule is doing a lot of the planet’s thermal bookkeeping.',
    ],
    takeaway:
      'Ice floats because frozen water is a spacious crystal. That quirk keeps lakes liquid underneath.',
  },
  {
    id: 'stem-scale',
    topic: 'stem',
    kind: 'article',
    title: 'You are closer in size to a virus than to Earth',
    dek: 'Powers of ten as a cure for feeling like the main character.',
    minutes: 3,
    body: [
      'A human is about 10⁰ meters tall. A virus is around 10⁻⁷ meters. Earth is about 10⁷ meters across. In a log-scale sense, a virus is not as far “below” you as the planet is “above” — a useful pinch if everyday objects feel like the only objects.',
      'Cells, organelles, proteins, and chemical bonds keep dropping by orders of magnitude. Stars, galaxies, and the observable universe climb the other way. Science is often the art of picking a zoom level where the pattern shows.',
      'Nothing in that ladder makes a person insignificant in a moral sense. It just means intuition trained on rooms and roads will misfire on both microbes and moons, which is why measurement and models exist.',
    ],
    takeaway:
      'Order-of-magnitude thinking is a pocket tool: ask what power of ten you are actually talking about.',
  },
  {
    id: 'stem-germs',
    topic: 'stem',
    kind: 'article',
    title: 'Germ theory is a young idea',
    dek: 'Hospitals changed when we admitted that invisible life can kill.',
    minutes: 4,
    body: [
      'For most of history, bad air, imbalance, or punishment explained infection. The turn came in the nineteenth century when microbes could be seen, cultured, and — crucially — linked to specific diseases by people like Pasteur, Koch, and (too often uncredited) scientists and midwives who counted outcomes.',
      'Semmelweis noticed that doctors who went from autopsy to maternity ward without washing their hands were associated with deadly fever. He was mocked. Later work made the mechanism obvious: living contaminants hitchhike. Soap, sterile technique, and vaccines are applied germ theory.',
      'We still live with the old stories whenever someone treats antibiotics like candy or treats viruses as if they were bacteria. The scientific idea is simple. The social habit of believing in the invisible is the hard part.',
    ],
    takeaway:
      'Washing hands and sterilizing tools work because infection is often a living hitchhiker, not a vibe.',
  },
  {
    id: 'stem-method',
    topic: 'stem',
    kind: 'article',
    title: 'The scientific method is a loop, not a staircase',
    dek: 'Guess, test, notice you were wrong, guess better.',
    minutes: 3,
    body: [
      'School posters turn science into a staircase: question, hypothesis, experiment, conclusion, gold star. Real work is messier. You notice a pattern, invent a story that could explain it, and then try to break that story on purpose.',
      'A good test risks being wrong. If every outcome would have “supported” the idea, you did not test it. Replication is how a community checks whether the break was a fluke. Models and instruments are part of the argument, not extras.',
      'Certainty is a sliding scale. Gravity is as firm as anything we have. A brand-new nutrition claim is not. The method is a way of ranking confidence, not a machine that prints Truth in one afternoon.',
    ],
    takeaway:
      'Science is organized disbelief: keep the stories that survive attempts to wreck them.',
  },
  {
    id: 'paint-color',
    topic: 'painting',
    kind: 'visual',
    visual: 'color-wheel',
    title: 'Complements make each other louder',
    dek: 'Put red near green and both look more like themselves.',
    minutes: 3,
    body: [
      'On a color wheel, complements sit opposite: red and green, blue and orange, yellow and violet. Place them side by side and the eye reads a vibration — each hue seems more saturated because the other supplies what it lacks.',
      'Impressionists used this on purpose: a violet shadow under a yellow haystack, a green in a flesh tone to keep a cheek from going chalky. The trick is not rainbow chaos. It is a small complementary note where the eye expects gray.',
      'Mix complements instead of parking them side by side and they mute toward brown or gray — useful for shadows that still feel like they belong to the light. Painting is often deciding whether two colors should argue or reconcile.',
    ],
    takeaway:
      'Neighbors on the wheel blend; opposites spark. Mix them when you want a quieter, living gray.',
  },
  fromSteppedVisual('painting-complements-vibrate', 4),
  {
    id: 'paint-negative',
    topic: 'painting',
    kind: 'article',
    title: 'Paint the hole, not just the doughnut',
    dek: 'Negative space is a shape with a job.',
    minutes: 3,
    body: [
      'Beginners outline the object and then “fill in background.” Painters who draw well often reverse it: the gap between a handle and a mug is a shape as specific as the mug. Get that gap right and the mug appears without being fussed.',
      'Japanese design language has a cousin in ma — the interval that makes the rest readable. A portrait can be wrecked by a leftover sliver of wall that accidentally forms a tangent, kissing a shoulder and flattening the depth.',
      'Try a five-minute sketch where you are forbidden to draw the object, only the air around it. The exercise is rude to your habits and excellent for proportion.',
    ],
    takeaway:
      'The leftover shapes are part of the drawing. If the air is wrong, the object will be too.',
  },
  {
    id: 'paint-chiaroscuro',
    topic: 'painting',
    kind: 'article',
    title: 'Chiaroscuro is drama with a budget of two',
    dek: 'Caravaggio’s trick: most of the world can be dark if one edge is true.',
    minutes: 3,
    body: [
      'Chiaroscuro means light-dark. A single convincing light source can model a face with a handful of values: a bright plane, a turning half-tone, a form shadow, a reflected glow, a cast shadow. The viewer’s brain does the rest.',
      'Baroque painters used the method like theater lighting. Hide the room, hit the gesture. You can steal it for a still life with a phone flashlight off to one side — the cheapest art education still in print.',
      'The common mistake is outlining every feature equally. Features in shadow should lose edge. Let the light invent the nose; do not draw a nose and then tint it.',
    ],
    takeaway:
      'One clear light, five values, and permission for the dark to stay dark.',
  },
  {
    id: 'paint-perspective',
    topic: 'painting',
    kind: 'article',
    title: 'Brunelleschi’s trick with a mirror',
    dek: 'Linear perspective is a decision about where the eye sits.',
    minutes: 3,
    body: [
      'In the 1420s Filippo Brunelleschi is said to have painted the Florence baptistery and proved the geometry with a mirror and a peephole: receding lines meet at a vanishing point tied to the viewer’s eye. Space, on a flat panel, became a construction.',
      'One-point perspective is a hallway. Two-point is a building corner. Three-point is looking up at a skyscraper until verticals converge. None of these is “how vision really works” — your eyes curve, move, and composite — but they are a coherent lie that reads as depth.',
      'You can feel when a painting cheats: a table that would dump its fruit, a tiled floor that changes its mind. Establishing the eye level first is the unglamorous move that saves the rest.',
    ],
    takeaway:
      'Perspective starts with a viewer, not a grid. Pick an eye height, then let edges obey it.',
  },
  {
    id: 'paint-pigment',
    topic: 'painting',
    kind: 'article',
    title: 'Color used to be geology',
    dek: 'Ochre, lapis, and the long trip from mine to brush.',
    minutes: 3,
    body: [
      'Before tubes of paint, color was a place. Yellow ochre is iron-stained earth. Ultramarine was ground lapis lazuli, expensive enough that Renaissance contracts specified where it could be used (often the Virgin’s robe). Lead white was common and poisonous. Cochineal red came from insects.',
      'The chemistry still peeks through: some pigments fade in light, some darken with pollution, some eat neighboring colors. Conservators read that history in cracks and pentimenti.',
      'A modern student squeezing phthalo blue from a plastic tube has a superpower older painters would have traded a commission for. The constraint they had — few, costly, mineral colors — is why so many old palettes look related, like a family of earths with one jewel.',
    ],
    takeaway:
      'Old paintings look the way they do partly because color was mined, shipped, and rationed.',
  },
  {
    id: 'paint-optical',
    topic: 'painting',
    kind: 'article',
    title: 'Let the eye mix the paint',
    dek: 'Impressionism as an optical bet, not just a vacation palette.',
    minutes: 3,
    body: [
      'If you blend blue and yellow thoroughly on the palette, you get a green that can go dull. If you set small notes of blue and yellow side by side and step back, the eye averages them into a livelier green. That gamble is optical mixing.',
      'Seurat pushed it toward dots. Monet pushed it toward broken strokes of the light he actually saw at 7 a.m. versus 4 p.m. The point was not messiness. It was that outdoor light is a moving target, and a mixed puddle on the palette cannot keep up.',
      'You can try it with two markers on scrap paper: a field of interleaved marks versus a smeared middle. The interleaved field often “breathes” more. Painting from life is partly scheduling — catching a light before it leaves.',
    ],
    takeaway:
      'Broken color can mix in the viewer. That is why some paintings look gray up close and alive from the door.',
  },
  {
    id: 'hist-archive',
    topic: 'history',
    kind: 'article',
    title: 'The archive is a survivor, not a sample',
    dek: 'We know the past from what was not eaten, burned, or ignored.',
    minutes: 3,
    body: [
      'History is not the past. It is arguments about the past built from leftovers: letters, ledgers, bones, songs, satellite photos of vanished walls. Those leftovers were saved by someone with a reason — a state, a monastery, a family, a museum budget.',
      'That means silence is information too. People who were not invited to write, or whose papers were not catalogued, appear as gaps, or only when they collide with an institution that filed them. Good historians treat absence as a clue, not as proof that nothing happened.',
      'When you read a confident textbook sentence, ask: who had to write this down, and who got to keep the paper? The story can still be true. It is rarely the only story that was true at the time.',
    ],
    takeaway:
      'Evidence is biased toward what lasted. Read the silences as part of the record.',
  },
  {
    id: 'hist-silk',
    topic: 'history',
    kind: 'visual',
    visual: 'timeline',
    title: 'The Silk Roads were a network, not a highway',
    dek: 'Goods, germs, and gods hitchhiked in relays.',
    minutes: 4,
    body: [
      'Nobody walked from Chang’an to Rome with a single backpack of silk. Relay traders moved goods through oasis towns, each taking a cut, each adding a rumor. The “road” was a web of routes that shifted with politics, water, and war.',
      'Alongside bolt cloth traveled paper, spices, glass, horses — and religions, styles, and pathogens. Networks that move luxury also move microbes. The same connectivity that made fortunes made pandemics possible.',
      'Calling it “East meets West” flattens a lot of middle. Sogdian, Persian, Indian, and Central Asian cities were not a corridor between two main characters. They were the system.',
    ],
    takeaway:
      'Long-distance trade is a relay. Culture and disease use the same caravans as silk.',
  },
  {
    id: 'hist-print',
    topic: 'history',
    kind: 'article',
    title: 'Print did not invent ideas. It multiplied them.',
    dek: 'A press is an amplifier with a personality.',
    minutes: 3,
    body: [
      'Movable type in Europe (and earlier printing cultures in East Asia) made it cheaper to copy a page than to hire a scribe. Once copying is cheap, arguments travel farther than their authors, including arguments the authors would have liked to recall.',
      'The press did not automatically produce science and liberty. It also produced rumours, propaganda, and wars of pamphlets. What changed was scale and speed: more readers, more conflict about who may read, more incentive to standardize spelling and vernacular languages.',
      'Every later “information revolution” rhymes. Cheap copies privilege whatever can be reproduced. They do not guarantee wisdom. They guarantee volume.',
    ],
    takeaway:
      'Printing multiplied texts. The fight then became who controls the multiplier.',
  },
  {
    id: 'hist-calendar',
    topic: 'history',
    kind: 'article',
    title: 'Why calendars argue with each other',
    dek: 'Timekeeping is astronomy plus politics.',
    minutes: 3,
    body: [
      'A year is not a round number of days, and a lunar month is not a round fraction of a year. Every calendar is a compromise: leap days, leap months, ignored moons. Julius Caesar’s reform, Gregory’s later tweak, lunar calendars that drift through seasons — all are patches.',
      'Which patch you use is identity. Revolutions have renamed months. Empires have imposed a “standard” for taxes and trains. Religious calendars keep a second clock on purpose, because holiness is not trying to match the fiscal year.',
      'When two records disagree by eleven days, it may not be a mystery. It may be a switch from Julian to Gregorian, or from a local new year that started in March. Historians date with that suspicion in their pocket.',
    ],
    takeaway:
      'Dates are conventions sitting on messy astronomy. Always ask which calendar a source meant.',
  },
  {
    id: 'hist-oral',
    topic: 'history',
    kind: 'article',
    title: 'Oral history is a technology',
    dek: 'Memory can be trained, even when paper cannot.',
    minutes: 3,
    body: [
      'Writing is not the only way a society remembers. Epic poets, griots, and legal reciters used meter, repetition, and public performance as error correction. A formulaic line is easier to keep stable than a unique sentence.',
      'That does not make oral tradition a tape recorder. It makes it a living archive that can preserve structure (a migration, a genealogy, a law) while details shift with the audience. The historian’s job is to know what kind of truth a form is built to carry.',
      'Paper-loving cultures have underestimated this for centuries. Archaeology, linguistics, and recorded testimony now sit beside chronicles. A past without a surviving book is not a past without a method.',
    ],
    takeaway:
      'Oral forms are designed to travel. Read them as crafted memory, not as failed writing.',
  },
  {
    id: 'hist-1918',
    topic: 'history',
    kind: 'article',
    title: 'The influenza of 1918 and public memory',
    dek: 'A catastrophe that sat beside a war and got half-forgotten.',
    minutes: 3,
    body: [
      'The influenza pandemic of 1918–1920 killed tens of millions, including many young adults — an age curve that still startles. Wartime censorship and the overlapping horror of World War I meant many communities under-named what was happening while it happened.',
      'Hospitals overflowed. Cities closed schools and then reopened them. Some places wore masks and fought about it. The pattern is grimly legible a century later: pathogens exploit movement; policy lags; memory prefers a story with a clear enemy and a peace treaty.',
      'Historians recovered the scale from obituaries, troop records, and oral accounts that families kept when governments did not. Forgetting was not accidental. It was competing with a war that already had monuments.',
    ],
    takeaway:
      'Public memory is selective. Mass death does not automatically become a central story.',
  },
  {
    id: 'law-burden',
    topic: 'law',
    kind: 'visual',
    visual: 'scales',
    title: 'Who has to prove it?',
    dek: 'Burden of proof is a rule about risk, not a vibe about fairness.',
    minutes: 3,
    body: [
      'In a criminal trial in many common-law systems, the state must prove its case to a very high standard because the cost of a mistake is a person’s liberty. Civil cases often use a lower standard: more likely than not. Same courtroom architecture, different appetite for error.',
      '“Burden” also means who goes first and who loses if the evidence is a tie. If the plaintiff must prove the contract existed and the files burned, the plaintiff may lose even if everyone has a hunch. Procedure allocates the pain of uncertainty.',
      'People borrow courtroom phrases online (“innocent until proven guilty”) for arguments that are not trials. Knowing the original job of the phrase — restraining the state — keeps it from becoming a slogan that means “I don’t have to answer.”',
    ],
    takeaway:
      'Standards of proof are design choices about whose mistake we fear more.',
  },
  {
    id: 'law-common',
    topic: 'law',
    kind: 'article',
    title: 'Common law is a conversation with dead judges',
    dek: 'Precedent means yesterday’s reasoning is a source, not a souvenir.',
    minutes: 4,
    body: [
      'In common-law systems, courts write down why they decided, and later courts are supposed to treat like cases alike. The law accretes as a stack of reasoned examples rather than a single code that tries to imagine every fact pattern in advance.',
      'Civil-law traditions (broadly) put more weight on comprehensive statutes and treat judicial opinions as less independently binding. Real countries mix both. The useful contrast is where a lawyer looks first: a code article, or a pile of cases with similar facts.',
      'Precedent is not ancestor worship. Later courts distinguish (“that case was about boats, this is about software”) or, rarely, overturn. The conversation can be conservative or restless depending on who is speaking and who is bound.',
    ],
    takeaway:
      'Common law reasons by analogy to older cases; civil-law style reasons first from the code. Most systems borrow both.',
  },
  {
    id: 'law-constitution',
    topic: 'law',
    kind: 'article',
    title: 'A constitution is a power map',
    dek: 'Higher law is a set of instructions for making ordinary law.',
    minutes: 3,
    body: [
      'A constitution (written or not) answers: who may make rules, how they are chosen, how they are stopped, and which promises are hard to repeal. Ordinary statutes have to fit inside that map or they can be struck down, ignored, or rewritten depending on the system.',
      'Entrenchment is the point. If a legislature could change the voting rules as easily as a tax rate, the people out of power would have no durable ground. That is why constitutional change is often slower — conventions, supermajorities, referendums.',
      'Reading a constitution as poetry misses the machinery: appointments, jurisdiction, emergency powers. The thrilling clauses (speech, equality) only work if the boring clauses keep a court open and a census honest.',
    ],
    takeaway:
      'Constitutions allocate and limit power. Rights clauses need the machinery clauses to mean anything.',
  },
  {
    id: 'law-contract',
    topic: 'law',
    kind: 'article',
    title: 'Why a contract wants a bargain, not a favor',
    dek: 'Consideration is the law’s way of ignoring empty promises — sometimes clumsily.',
    minutes: 3,
    body: [
      'In classical common-law contract, a promise is easier to enforce if something was exchanged: money, goods, another promise. A gift pledge, even a heartfelt one, might not be a contract. The doctrine is called consideration, and students love to hate it.',
      'The policy story is evidence and seriousness. Bargains leave traces. They also let courts avoid refereeing every generous intention that went sour. Other traditions (and modern statutes) enforce some no-bargain promises anyway, especially if someone reasonably relied.',
      'You already use the idea: a receipt, a ticket stub, a “I’ll paint the fence if you buy the paint.” The law is a formalized version of that instinct, with more footnotes.',
    ],
    takeaway:
      'Contracts are about enforceable bargains. A one-way promise may be morality without being a contract.',
  },
  {
    id: 'law-rights',
    topic: 'law',
    kind: 'article',
    title: 'Rights against whom?',
    dek: 'A right is a relationship, not a sticker you put on a thing.',
    minutes: 3,
    body: [
      'It is easy to say “I have a right to X.” Legal analysis asks the follow-up: against whom, to do what, with what remedy? A right to speak freely is mainly a limit on government punishment, not a duty for your uncle to keep listening at dinner.',
      'Property is a bundle of claims against other people (don’t trespass, don’t steal) backed by courts. Human rights documents try to name claims against states. Consumer rights often live in statutes against companies. Mixing these layers produces talking past each other.',
      'When two rights collide — privacy and a free press, assembly and quiet streets — a court is not finding a winner in nature. It is drawing a boundary for this conflict, in this system, with this text.',
    ],
    takeaway:
      'Name the duty-bearer. A right without a someone who must respect it is a slogan.',
  },
  {
    id: 'law-statute',
    topic: 'law',
    kind: 'article',
    title: 'How to read a statute without becoming a lawyer',
    dek: 'Definitions first, then the operative verb, then the exceptions.',
    minutes: 3,
    body: [
      'Statutes often hide the plot in a definitions section. “Person,” “vehicle,” and “knowingly” may not mean what a dictionary would guess. Read those before the dramatic sentence about what is forbidden or required.',
      'Then find the operative verb: shall, may, must not. “Shall” is a duty; “may” is permission. Exceptions and provisos at the end of a sentence can swallow the beginning. Courts also look at purpose and at how the same word was used nearby, because legislatures recycle language.',
      'You will not win a case with this pocket guide. You will be harder to fool by a headline that quotes six words and ignores the clause that starts with “unless.”',
    ],
    takeaway:
      'Find defined terms, the verb that creates the duty, and the exception that quietly undoes it.',
  },
]
