'use client'

import { useEffect, useRef } from 'react'
import { fragment, VERTEX, type FlowType } from './shaders'

/**
 * <Flow> renders the new gradient types with the same props shape as
 * GradFlow's config. Every <Flow> on the page shares ONE WebGL context: each
 * frame the shared context draws an instance at its size and the result is
 * copied into that instance's own 2D canvas. So rounded corners, stacking and
 * transforms all behave like any element, and a page can hold dozens of them
 * without running into the browser's ~16 WebGL context limit.
 */

export type FlowConfig = {
  type: FlowType
  color1: string
  color2: string
  color3: string
  speed?: number
  scale?: number
  noise?: number
}

type Values = number[] // r1 g1 b1 r2 g2 b2 r3 g3 b3 speed scale noise

const rgb = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}
const pack = (c: FlowConfig): Values => [...rgb(c.color1), ...rgb(c.color2), ...rgb(c.color3), c.speed ?? 0.5, c.scale ?? 1, c.noise ?? 0.1]

type Instance = {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  type: FlowType
  cur: Values
  from: Values
  to: Values
  start: number
  duration: number
  time: number
  visible: boolean
  cssW: number
  cssH: number
  /** follows the cursor: the point in 0..1 uv (y up) and its smoothed velocity */
  interactive: boolean
  pointer: [number, number]
  vel: [number, number]
  /** a chain of points that each chase the one before, so the cursor leaves a tail */
  trail: Float32Array
  /** 0..1, how present the cursor is; fades out when it leaves */
  presence: number
}

// ---------------------------------------------------------------------------
// the shared context

const instances = new Set<Instance>()
let gl: WebGLRenderingContext | null = null
let shared: HTMLCanvasElement | null = null
const programs = new Map<FlowType, { program: WebGLProgram; loc: Record<string, WebGLUniformLocation | null> }>()
let raf = 0
let last = 0
const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// one pointer listener for every interactive instance
const mouse = { x: -1e9, y: -1e9 }
let listening = false
function listen() {
  if (listening) return
  listening = true
  window.addEventListener(
    'pointermove',
    (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    },
    { passive: true },
  )
  document.addEventListener('pointerleave', () => {
    mouse.x = mouse.y = -1e9
  })
}

function compile(type: number, src: string) {
  const s = gl!.createShader(type)!
  gl!.shaderSource(s, src)
  gl!.compileShader(s)
  if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) console.error('flow: shader failed', gl!.getShaderInfoLog(s))
  return s
}

function program(type: FlowType) {
  let p = programs.get(type)
  if (p) return p
  const prog = gl!.createProgram()!
  gl!.attachShader(prog, compile(gl!.VERTEX_SHADER, VERTEX))
  gl!.attachShader(prog, compile(gl!.FRAGMENT_SHADER, fragment(type)))
  gl!.bindAttribLocation(prog, 0, 'position')
  gl!.linkProgram(prog)
  const names = ['u_time', 'u_color1', 'u_color2', 'u_color3', 'u_scale', 'u_noise', 'u_resolution', 'u_pointer', 'u_vel', 'u_trail', 'u_presence']
  p = { program: prog, loc: Object.fromEntries(names.map((n) => [n, gl!.getUniformLocation(prog, n)])) }
  programs.set(type, p)
  return p
}

function setup() {
  if (gl) return
  shared = document.createElement('canvas')
  shared.width = shared.height = 2
  gl = shared.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' })
  if (!gl) return
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
}

function render(inst: Instance) {
  const w = inst.canvas.width
  const h = inst.canvas.height
  if (!gl || !shared || w < 2 || h < 2) return
  // the shared canvas only ever grows, so it fits the largest instance
  if (shared.width < w || shared.height < h) {
    shared.width = Math.max(shared.width, w)
    shared.height = Math.max(shared.height, h)
  }
  const { program: prog, loc } = program(inst.type)
  const v = inst.cur
  gl.useProgram(prog)
  gl.viewport(0, 0, w, h)
  gl.uniform1f(loc.u_time, inst.time)
  gl.uniform3f(loc.u_color1, v[0], v[1], v[2])
  gl.uniform3f(loc.u_color2, v[3], v[4], v[5])
  gl.uniform3f(loc.u_color3, v[6], v[7], v[8])
  gl.uniform1f(loc.u_scale, v[10])
  gl.uniform1f(loc.u_noise, v[11])
  gl.uniform2f(loc.u_resolution, inst.cssW, inst.cssH)
  gl.uniform2f(loc.u_pointer, inst.pointer[0], inst.pointer[1])
  gl.uniform2f(loc.u_vel, inst.vel[0], inst.vel[1])
  if (loc.u_trail) gl.uniform2fv(loc.u_trail, inst.trail)
  gl.uniform1f(loc.u_presence, inst.presence)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
  // WebGL draws from the bottom-left; that region sits at the bottom of the image
  inst.ctx.drawImage(shared, 0, shared.height - h, w, h, 0, 0, w, h)
}

function step(inst: Instance, now: number, dt: number) {
  const k = inst.duration > 0 ? Math.min((now - inst.start) / inst.duration, 1) : 1
  const e = k * k * (3 - 2 * k)
  inst.cur = inst.from.map((a, i) => a + (inst.to[i] - a) * e)
  inst.time += dt * inst.cur[9]
  if (!inst.interactive || dt <= 0) return

  // only the cursor moves things: no autopilot
  const r = inst.canvas.getBoundingClientRect()
  const inside = mouse.x >= r.left && mouse.x <= r.right && mouse.y >= r.top && mouse.y <= r.bottom
  inst.presence += ((inside ? 1 : 0) - inst.presence) * (1 - Math.exp(-dt * (inside ? 4 : 1.6)))
  if (inside) {
    const tx = (mouse.x - r.left) / r.width
    const ty = 1 - (mouse.y - r.top) / r.height
    // arriving: start the trail where the cursor is, not where it last left
    if (inst.presence < 0.08) {
      inst.pointer = [tx, ty]
      for (let i = 0; i < inst.trail.length; i += 2) {
        inst.trail[i] = tx
        inst.trail[i + 1] = ty
      }
    }
    const [px, py] = inst.pointer
    const head = 1 - Math.exp(-dt * 14)
    const nx = px + (tx - px) * head
    const ny = py + (ty - py) * head
    inst.pointer = [nx, ny]
    const kv = 1 - Math.exp(-dt * 8)
    inst.vel = [inst.vel[0] + ((nx - px) / dt - inst.vel[0]) * kv, inst.vel[1] + ((ny - py) / dt - inst.vel[1]) * kv]
  }
  // the tail: each point eases toward the one ahead of it
  const t = inst.trail
  const link = 1 - Math.exp(-dt * 11)
  t[0] = inst.pointer[0]
  t[1] = inst.pointer[1]
  for (let i = 1; i < t.length / 2; i++) {
    t[i * 2] += (t[i * 2 - 2] - t[i * 2]) * link
    t[i * 2 + 1] += (t[i * 2 - 1] - t[i * 2 + 1]) * link
  }
}

function frame(now: number) {
  const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
  last = now
  for (const inst of instances) {
    if (!inst.visible) continue
    step(inst, now, reduced ? 0 : dt)
    render(inst)
  }
  raf = instances.size ? requestAnimationFrame(frame) : 0
}

function register(inst: Instance) {
  setup()
  instances.add(inst)
  if (!raf) {
    last = 0
    raf = requestAnimationFrame(frame)
  }
}

// ---------------------------------------------------------------------------
// the component

/** `seed` fixes the starting time, so two instances with the same config stay in step. */
/** `quality` renders below full resolution (0.5 = half); soft full-bleed fields don't need every pixel. */
export function Flow({
  config,
  transition = 700,
  className = '',
  seed,
  quality = 1,
  interactive = false,
}: {
  config: FlowConfig
  transition?: number
  className?: string
  seed?: number
  quality?: number
  /** feed the cursor (or a wandering point when it is away) to the shader */
  interactive?: boolean
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const inst = useRef<Instance | null>(null)

  useEffect(() => {
    const canvas = ref.current!
    const values = pack(config)
    const me: Instance = {
      canvas,
      ctx: canvas.getContext('2d')!,
      type: config.type,
      cur: values,
      from: values,
      to: values,
      start: 0,
      duration: 0,
      time: seed ?? Math.random() * 20,
      visible: true,
      cssW: 1,
      cssH: 1,
      interactive,
      pointer: [0.5, 0.5],
      vel: [0, 0],
      trail: new Float32Array(24).fill(0.5),
      presence: 0,
    }
    inst.current = me

    const parent = canvas.parentElement!
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * quality
      me.cssW = Math.max(parent.clientWidth, 1)
      me.cssH = Math.max(parent.clientHeight, 1)
      canvas.width = Math.round(me.cssW * dpr)
      canvas.height = Math.round(me.cssH * dpr)
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(parent)
    const io = new IntersectionObserver(([entry]) => (me.visible = entry.isIntersecting))
    io.observe(canvas)

    if (interactive) listen()
    register(me)
    return () => {
      ro.disconnect()
      io.disconnect()
      instances.delete(me)
    }
  }, [])

  const key = JSON.stringify(config)
  useEffect(() => {
    const me = inst.current
    if (!me) return
    const target = pack(config)
    if (target.every((v, i) => v === me.to[i]) && config.type === me.type) return
    me.type = config.type
    me.from = me.cur
    me.to = target
    me.start = performance.now()
    me.duration = transition
  }, [key, transition])

  return <canvas ref={ref} className={`absolute inset-0 block h-full w-full ${className}`} />
}
