import type { FlowConfig } from './flow/flow'

/**
 * Everything the /components pages need to know about each piece, as plain
 * data so server pages can read it. The live views live in views.tsx.
 */

export type Kind = 'phone' | 'island' | 'poster' | 'shader'

/** One prop a page can tune live. The Props table is generated from these too. */
export type Control =
  | { key: string; type: 'select'; label: string; options: string[]; default: string; description: string }
  | { key: string; type: 'text'; label: string; default: string; description: string }
  | { key: string; type: 'color'; label: string; default: string; description: string }
  | { key: string; type: 'number'; label: string; min: number; max: number; step: number; default: number; description: string }

const stateOf = (options: string[], description: string): Control => ({
  key: 'state',
  type: 'select',
  label: 'State',
  options: ['auto', ...options],
  default: 'auto',
  description,
})
const text = (key: string, label: string, value: string, description: string): Control => ({ key, type: 'text', label, default: value, description })
const color = (key: string, label: string, value: string, description: string): Control => ({ key, type: 'color', label, default: value, description })
const pick = (key: string, label: string, options: string[], description: string): Control => ({ key, type: 'select', label, options: ['auto', ...options], default: 'auto', description })

export type Entry = {
  slug: string
  name: string
  category: CategoryId
  kind: Kind
  /** one sentence for the page header and the index */
  desc: string
  /** the gradient types inside it */
  uses: string[]
  /** the component's file in src/components/showcase */
  file?: string
  /** the export to import, for the usage snippet */
  exportName?: string
  /** local files it needs besides itself */
  helpers: string[]
  /** three colours for the index swatch */
  swatch: [string, string, string]
  /** shader entries only: the starting config the playground opens with */
  shader?: FlowConfig
  /** component entries: the props the page lets you tune */
  controls?: Control[]
}

export type CategoryId = 'mobile' | 'island' | 'product' | 'glass' | 'shaders'

export const CATEGORIES: { id: CategoryId; name: string; blurb: string }[] = [
  { id: 'mobile', name: 'Mobile', blurb: 'Full phone screens where the gradient does a job.' },
  { id: 'island', name: 'Dynamic Island', blurb: 'Live Activities that spring between compact and expanded.' },
  { id: 'product', name: 'Product', blurb: 'Desktop screens where the whole field is the state.' },
  { id: 'glass', name: 'Glass', blurb: 'Fluted glass that stays still while the light behind it follows the cursor.' },
  { id: 'shaders', name: 'Shaders', blurb: 'New gradient types on GradFlow’s three-colour contract, sharing one WebGL context.' },
]

const FLOW = ['flow/flow.tsx', 'flow/shaders.ts']

const shader = (slug: string, desc: string, config: FlowConfig): Entry => ({
  slug,
  name: slug[0].toUpperCase() + slug.slice(1),
  category: 'shaders',
  kind: 'shader',
  desc,
  uses: [slug],
  helpers: FLOW,
  swatch: [config.color1, config.color2, config.color3],
  shader: config,
})

export const ENTRIES: Entry[] = [
  // mobile
  { slug: 'ai-chat', name: 'AI chat', category: 'mobile', kind: 'phone', file: 'ai-chat.tsx', exportName: 'AIChat', helpers: [], uses: ['aurora', 'mesh', 'horizon', 'eclipse'], swatch: ['#7c5cff', '#07060f', '#4fb3ff'], controls: [text('name', 'Name', 'Atlas', 'What the assistant is called.'), color('accent', 'Accent', '#7c5cff', 'Aurora, orb, glow and the voice ring.'), color('highlight', 'Highlight', '#4fb3ff', 'The second colour of the orb and avatar.')], desc: 'An assistant with an aurora header, a living orb, and a voice mode that breathes with speech.' },
  { slug: 'weather', name: 'Weather', category: 'mobile', kind: 'phone', file: 'weather.tsx', exportName: 'Weather', helpers: ['phone.tsx'], uses: ['horizon', 'rays', 'dunes', 'nebula'], swatch: ['#ff8a5c', '#1c1d4f', '#ffe0b0'], controls: [text('city', 'City', 'Lisbon', 'The place at the top.'), pick('time', 'Time of day', ['dawn', 'noon', 'sunset', 'night'], 'Pin the sky, or let it run through the day.')], desc: 'One sky that runs from dawn to night, blending from one gradient type into the next.' },
  { slug: 'wallet', name: 'Wallet', category: 'mobile', kind: 'phone', file: 'wallet.tsx', exportName: 'Wallet', helpers: ['phone.tsx'], uses: ['fold', 'horizon', 'mesh'], swatch: ['#2a5cff', '#08113a', '#ffb27a'], controls: [stateOf(['idle', 'paying', 'done'], 'Pin the pay flow, or let it loop.'), color('cardColor', 'Card', '#2a5cff', 'The card’s main fold colour.'), color('cardAccent', 'Card light', '#ffb27a', 'The light catching the folds.')], desc: 'A card that tilts toward you, and a pay sheet with a soft glow running around the screen edge.' },
  { slug: 'onboarding', name: 'Onboarding', category: 'mobile', kind: 'phone', file: 'onboarding.tsx', exportName: 'Onboarding', helpers: ['phone.tsx'], uses: ['prism', 'glass', 'mesh', 'eclipse'], swatch: ['#ff5a1e', '#285aff', '#78d2ff'], controls: [text('appName', 'App name', 'Atlas', 'The product name on the slides and paywall.'), pick('step', 'Step', ['1', '2', '3', 'paywall'], 'Pin a slide or the paywall, or let it play through.')], desc: 'Three intro slides that blend into each other, ending on a paywall.' },
  { slug: 'breathe', name: 'Breathe', category: 'mobile', kind: 'phone', file: 'breathe.tsx', exportName: 'Breathe', helpers: ['phone.tsx'], uses: ['smoke'], swatch: ['#bff5e6', '#06302c', '#2fa98f'], controls: [{ key: 'inhale', type: 'number', label: 'Breathe in', min: 2, max: 8, step: 1, default: 4, description: 'Seconds to breathe in.' }, { key: 'hold', type: 'number', label: 'Hold', min: 0, max: 6, step: 1, default: 2, description: 'Seconds to hold.' }, { key: 'exhale', type: 'number', label: 'Breathe out', min: 2, max: 10, step: 1, default: 6, description: 'Seconds to breathe out.' }], desc: 'A smoke orb that swells as you breathe in and settles as you breathe out.' },

  // dynamic island
  { slug: 'island-assistant', name: 'Assistant, live', category: 'island', kind: 'island', file: 'island-ai.tsx', exportName: 'IslandAI', helpers: ['island.tsx', 'phone.tsx', ...FLOW], uses: ['core', 'aurora'], swatch: ['#6a4dff', '#1b1450', '#f0b8ff'], controls: [text('name', 'Name', 'Atlas', 'The assistant’s name in the open island.'), text('reply', 'Reply', 'Your 3pm with Lina moved to 4. Want me to book a ride for 3:40?', 'What it says when opened.'), stateOf(['listening', 'speaking', 'booked'], 'Pin one moment, or let it loop.')], desc: 'The assistant in the island: a tiny orb while listening, a reply when opened, a confirmation when done.' },
  { slug: 'island-now-playing', name: 'Now playing', category: 'island', kind: 'island', file: 'island-music.tsx', exportName: 'IslandMusic', helpers: ['island.tsx', 'phone.tsx', ...FLOW], uses: ['ember'], swatch: ['#ff7a3d', '#2a0f22', '#ffd9a0'], controls: [text('title', 'Title', 'Slow Burn', 'The track.'), text('artist', 'Artist', 'Low Tide Radio', 'Who made it.'), stateOf(['compact', 'open'], 'Pin compact or open, or let it loop.')], desc: 'Album art that grows from the compact slot into a mini player, pulsing on the beat.' },

  // product
  { slug: 'overview', name: 'Overview', category: 'product', kind: 'poster', file: 'dashboard.tsx', exportName: 'Dashboard', helpers: ['desktop.tsx', 'phone.tsx', ...FLOW], uses: ['drift'], swatch: ['#25a58d', '#03201b', '#ff4f2a'], controls: [text('brand', 'Brand', 'Northwind', 'The product name in the corner.'), pick('view', 'View', ['revenue', 'users', 'incident', 'resolved'], 'Pin one view, or let it move through them.')], desc: 'One number at a time, the one that matters now, on a field that shows its mood.' },
  { slug: 'pricing', name: 'Pricing', category: 'product', kind: 'poster', file: 'pricing.tsx', exportName: 'Pricing', helpers: ['desktop.tsx', 'phone.tsx', ...FLOW], uses: ['drift', 'veil', 'core'], swatch: ['#6b4dff', '#0b0822', '#ff9db6'], controls: [text('brand', 'Brand', 'Northwind', 'The product name in the corner.'), pick('plan', 'Plan', ['starter', 'pro', 'scale'], 'Pin one plan, or let the page move between them.'), pick('billing', 'Billing', ['monthly', 'yearly'], 'Pin the billing period, or let it toggle.')], desc: 'The page becomes the plan you pick: quiet for Starter, ribbons for Pro, a sphere for Scale.' },
  { slug: 'ask', name: 'Ask', category: 'product', kind: 'poster', file: 'command.tsx', exportName: 'Command', helpers: ['desktop.tsx', 'phone.tsx', ...FLOW], uses: ['aura'], swatch: ['#6d4dff', '#0a0a12', '#38b4ff'], controls: [text('brand', 'Brand', 'Northwind', 'The product name in the header.'), text('question', 'Question', 'Why did signups drop on Tuesday?', 'The question that gets typed.'), stateOf(['thinking', 'answered'], 'Pin the thinking or answered moment, or let it play.')], desc: 'A question, its answer, and a field that lights up while the AI thinks.' },
  { slug: 'deploy', name: 'Deploy', category: 'product', kind: 'poster', file: 'deploy.tsx', exportName: 'Deploy', helpers: ['desktop.tsx', 'phone.tsx', ...FLOW], uses: ['current'], swatch: ['#2f5bff', '#040a26', '#16b273'], controls: [text('branch', 'Branch', 'main', 'The branch being released.'), stateOf(['building', 'failed', 'live'], 'Pin one moment of the release, or let it run.')], desc: 'A release as one word on a river of light: blue while building, red on failure, green when live.' },

  // glass
  { slug: 'climate', name: 'Climate', category: 'glass', kind: 'poster', file: 'glass-climate.tsx', exportName: 'GlassClimate', helpers: ['desktop.tsx', 'phone.tsx', ...FLOW], uses: ['flute'], swatch: ['#ff6a2b', '#2a0b05', '#2f6bff'], controls: [text('room', 'Room', 'Living room', 'The room shown first in the tabs.'), pick('mode', 'Mode', ['heat', 'cool', 'eco'], 'Pin heating, cooling or eco, or let it cycle.')], desc: 'A thermostat where the glass is the room: blue while it cools, orange while it heats, green on eco.' },
  { slug: 'listening', name: 'Listening', category: 'glass', kind: 'poster', file: 'glass-player.tsx', exportName: 'GlassPlayer', helpers: ['desktop.tsx', 'phone.tsx', ...FLOW], uses: ['flute'], swatch: ['#ff7a3d', '#080a2c', '#4d6bff'], controls: [pick('track', 'Track', ['slow-burn', 'blue-hour', 'fern'], 'Pin one track, or let the player move through them.')], desc: 'A media player whose glass blends from one album’s colours to the next as the track changes.' },
  { slug: 'landing', name: 'Landing', category: 'glass', kind: 'poster', file: 'glass-landing.tsx', exportName: 'GlassLanding', helpers: ['desktop.tsx', ...FLOW], uses: ['flute'], swatch: ['#6a4dff', '#0a0820', '#ff8f6b'], controls: [text('brand', 'Brand', 'Northwind', 'The product name in the nav and copy.'), text('headline', 'Headline', 'Ship the product, not the dashboard.', 'The hero line.'), color('glass', 'Glass', '#6a4dff', 'The colour of the glass.'), color('light', 'Light', '#ff8f6b', 'The light your cursor drags behind it.')], desc: 'A website hero with a nav bar; drag across it and the light behind the glass follows.' },

  // shaders
  shader('flute', 'Fluted glass with a light behind it that follows the cursor.', { type: 'flute', color1: '#6a4dff', color2: '#0a0820', color3: '#ff8f6b', speed: 0.45, scale: 0.8, noise: 0.05 }),
  shader('veil', 'Ribbons of light drifting across a deep field.', { type: 'veil', color1: '#6b4dff', color2: '#0b0822', color3: '#ff9db6', speed: 0.5, scale: 1, noise: 0.06 }),
  shader('core', 'A lit sphere with weather turning inside it.', { type: 'core', color1: '#6a4dff', color2: '#1b1450', color3: '#f0b8ff', speed: 0.7, scale: 1, noise: 0.06 }),
  shader('aura', 'Soft lights wandering over a dark base.', { type: 'aura', color1: '#6d4dff', color2: '#ff5fa8', color3: '#38b4ff', speed: 0.8, scale: 1, noise: 0.06 }),
  shader('ember', 'Heat rising off a hot floor.', { type: 'ember', color1: '#ff7a3d', color2: '#2a0f22', color3: '#ffd9a0', speed: 0.6, scale: 1, noise: 0.1 }),
  shader('ink', 'Marbled ink folding over itself.', { type: 'ink', color1: '#1f6f8b', color2: '#081521', color3: '#f2e6c9', speed: 0.5, scale: 1, noise: 0.08 }),
  shader('bloom', 'Petal rings turning against each other.', { type: 'bloom', color1: '#ff5c8a', color2: '#16071a', color3: '#ffd1e0', speed: 0.5, scale: 1, noise: 0.08 }),
  shader('ripple', 'Two drops, their rings crossing.', { type: 'ripple', color1: '#2f7bff', color2: '#050c24', color3: '#bfe8ff', speed: 0.5, scale: 1, noise: 0.08 }),
  shader('bokeh', 'City lights, out of focus.', { type: 'bokeh', color1: '#ffb25c', color2: '#120a1e', color3: '#ff5c8a', speed: 0.6, scale: 1, noise: 0.12 }),
  shader('drift', 'A quiet surface for cards and backgrounds.', { type: 'drift', color1: '#25a58d', color2: '#03201b', color3: '#b6ffe4', speed: 0.5, scale: 0.9, noise: 0.06 }),
  shader('current', 'Light streaming along a line, for meters and progress.', { type: 'current', color1: '#2f5bff', color2: '#040a26', color3: '#c2e1ff', speed: 1, scale: 0.6, noise: 0.06 }),
]

export const entry = (slug: string) => ENTRIES.find((e) => e.slug === slug)

/** neighbours in sidebar order, for the prev / next links at the bottom of a page */
export const neighbours = (slug: string) => {
  const i = ENTRIES.findIndex((e) => e.slug === slug)
  return { prev: ENTRIES[i - 1], next: ENTRIES[i + 1] }
}
