import { createRenderer, type FrameUniforms, type GradientRenderer, type Vec3 } from '@/core/renderer'
import { GRADIENT_TYPE_NUMBER } from '@/constants/gradients'
import { normalizeRgb } from '@/lib/color-utils'
import type { GradientConfig } from '@/types/gradient'

/**
 * Draws any number of small gradient tiles from a single WebGL context.
 *
 * Browsers cap live WebGL contexts (around 16 in Chrome) and evict the oldest
 * past that, so a gallery can't give every tile its own. Instead one hidden
 * canvas renders each visible tile in turn and the result is copied into the
 * tile's own 2D canvas.
 */

export type Tile = {
  canvas: HTMLCanvasElement
  config: GradientConfig
  visible: boolean
  /** pointer position in uv space and whether it is over the tile */
  pointer: Vec3
}

type Entry = {
  tile: Tile
  ctx: CanvasRenderingContext2D
  lens: Vec3
  offset: number
}

const entries = new Map<Tile, Entry>()

let source: HTMLCanvasElement | null = null
let renderer: GradientRenderer | null = null
let rafId = 0
let elapsed = 0
let last: number | null = null
let frame = 0

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function ensureRenderer() {
  if (renderer) return renderer
  source = document.createElement('canvas')
  renderer = createRenderer(source)
  return renderer
}

function drawEntry({ tile, ctx, lens, offset }: Entry) {
  const gl = ensureRenderer()
  if (!gl || !source) return

  const { canvas, config } = tile
  const width = canvas.width
  const height = canvas.height
  if (!width || !height) return

  // the shared canvas only ever grows, so tiles of different sizes don't
  // force a reallocation on every draw
  if (source.width < width) source.width = width
  if (source.height < height) source.height = height

  const type = GRADIENT_TYPE_NUMBER[config.type]
  const uniforms: FrameUniforms = {
    time: (elapsed + offset) * config.speed,
    time2: (elapsed + offset) * config.speed * config.speed,
    color1: normalizeRgb(config.color1),
    color2: normalizeRgb(config.color2),
    color3: normalizeRgb(config.color3),
    scale: config.scale,
    noise: config.noise,
    type,
    prevType: type,
    mix: 1,
    pointer: lens,
  }

  gl.draw(uniforms, width, height, canvas.clientWidth, canvas.clientHeight)
  // the tile was drawn into the bottom-left corner of the shared canvas
  ctx.drawImage(source, 0, source.height - height, width, height, 0, 0, width, height)
}

function tick(now: number) {
  const dt = last === null ? 0 : Math.min((now - last) / 1000, 0.1)
  last = now
  elapsed += dt
  frame++

  // tiles are small and many; every other frame is plenty
  if (frame % 2 === 0) {
    const follow = 1 - Math.exp(-dt * 2 * 6)
    for (const entry of entries.values()) {
      if (!entry.tile.visible) continue
      const target = entry.tile.pointer
      entry.lens = [
        entry.lens[0] + (target[0] - entry.lens[0]) * follow,
        entry.lens[1] + (target[1] - entry.lens[1]) * follow,
        entry.lens[2] + (target[2] - entry.lens[2]) * follow,
      ]
      drawEntry(entry)
    }
  }

  rafId = requestAnimationFrame(tick)
}

function sync() {
  let anyVisible = false
  for (const entry of entries.values()) {
    if (entry.tile.visible) anyVisible = true
  }

  const shouldRun = anyVisible && !document.hidden && !reducedMotion()

  if (shouldRun && !rafId) {
    last = null
    rafId = requestAnimationFrame(tick)
  } else if (!shouldRun && rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
}

let listening = false

export function registerTile(tile: Tile) {
  const ctx = tile.canvas.getContext('2d')
  if (!ctx) return () => {}

  if (!listening) {
    listening = true
    document.addEventListener('visibilitychange', sync)
  }

  // spread the tiles out in time so identical shaders don't move in lockstep
  entries.set(tile, { tile, ctx, lens: [0.5, 0.5, 0], offset: entries.size * 3.7 })
  sync()

  return () => {
    entries.delete(tile)
    sync()
  }
}

/** Repaint one tile now: after a resize, a config change, or while motion is off. */
export function refreshTile(tile: Tile) {
  const entry = entries.get(tile)
  if (entry) drawEntry(entry)
  sync()
}
