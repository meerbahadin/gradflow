'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Flow } from './flow/flow'
import { CATEGORIES, ENTRIES, type Entry } from './catalog'
import './showcase.css'

/**
 * The way into the component library from the Components page: a headline,
 * the category counts, and nothing else: the sheet is the picture.
 *
 * The background is a contact sheet (the `mosaic` shader): a grid of small
 * gradient tiles, resting in greyscale. Around the cursor a soft circle brings
 * the colour back. Each tile stands for one component; hover a tile and a
 * small live preview of that component follows the cursor.
 * Clicking then opens that component's page.
 */

// the previews only load once someone hovers a tile
const Preview = dynamic(() => import('./views').then((m) => m.Preview), { ssr: false })

const count = (id: string) => ENTRIES.filter((e) => e.category === id).length

// must match the mosaic shader: 72px tiles at scale 1, counted from the bottom-left corner
const SHEET = { type: 'mosaic', color1: '#6d4dff', color2: '#08070f', color3: '#ff9db6', speed: 0.5, scale: 1, noise: 0 } as const
const CELL = 72 * SHEET.scale

// every tile maps to one component; neighbours rarely repeat
const entryAt = (col: number, row: number) => {
  const h = Math.imul(col + 1, 73856093) ^ Math.imul(row + 1, 19349663)
  return ENTRIES[(h >>> 0) % ENTRIES.length]
}

// the floating preview's size for each kind of piece
const SIZE: Record<Entry['kind'], [number, number]> = {
  phone: [132, 230],
  island: [220, 140],
  poster: [248, 160],
  shader: [200, 128],
}

function useFollow(card: React.RefObject<HTMLAnchorElement | null>) {
  const [entry, setEntry] = useState<Entry | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0, ready: false })

  // the card eases after the cursor, quick but never snapping
  useEffect(() => {
    if (!entry) {
      pos.current.ready = false
      return
    }
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const p = pos.current
      if (!p.ready) {
        p.x = target.current.x
        p.y = target.current.y
        p.ready = true
      }
      const k = 1 - Math.exp(-dt * 16)
      p.x += (target.current.x - p.x) * k
      p.y += (target.current.y - p.y) * k
      if (box.current) box.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [entry])

  const onMove = (e: React.PointerEvent) => {
    const el = card.current
    if (!el || e.pointerType === 'touch') return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    // only over the bare sheet, where the tiles show: not over the copy or buttons
    const bare = !(e.target as HTMLElement).closest('[data-solid]') && x / r.width > 0.3
    if (!bare) {
      setEntry(null)
      return
    }
    const next = entryAt(Math.floor(x / CELL), Math.floor((r.height - y) / CELL))
    const [w, h] = SIZE[next.kind]
    // sit below-right of the cursor, flipping to stay inside the card
    target.current = {
      x: x + 18 + w > r.width - 8 ? x - 18 - w : x + 18,
      y: Math.min(Math.max(y + 18, 8), r.height - h - 44),
    }
    setEntry((cur) => (cur?.slug === next.slug ? cur : next))
  }

  return { entry, box, onMove, onLeave: () => setEntry(null) }
}

export default function LibraryBanner() {
  const card = useRef<HTMLAnchorElement>(null)
  const router = useRouter()
  const { entry, box, onMove, onLeave } = useFollow(card)

  return (
    <Link
      ref={card}
      href='/components'
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={(e) => {
        if (!entry) return
        e.preventDefault()
        router.push(`/components/${entry.slug}`)
      }}
      className='on-gradient group relative isolate mt-3 block overflow-hidden rounded-(--radius-surface) border border-border bg-[#08070f] text-white'
    >
      <div className='absolute inset-0 -z-10'>
        <Flow config={SHEET} interactive />
        <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-black/15 to-transparent' />
      </div>

      {/* the hovered tile's component, live, trailing the cursor */}
      <div
        ref={box}
        aria-hidden='true'
        className='pointer-events-none absolute left-0 top-0 z-20 will-change-transform'
        style={{ opacity: entry ? 1 : 0, transition: 'opacity 160ms ease-out' }}
      >
        {entry && (
          <div
            key={entry.slug}
            className='sc-peek overflow-hidden rounded-[14px] border border-white/15 bg-[#0c0b14]/90 shadow-[0_24px_48px_rgba(0,0,0,.55)] backdrop-blur-xl'
            style={{ width: SIZE[entry.kind][0] }}
          >
            <div className='relative' style={{ height: SIZE[entry.kind][1] }}>
              <Preview slug={entry.slug} kind={entry.kind} shader={entry.shader} />
            </div>
            <div className='flex items-center justify-between gap-2 border-t border-white/10 px-3 py-2'>
              <span className='truncate text-[12px] font-medium'>{entry.name}</span>
              <span className='shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-white/55'>
                {CATEGORIES.find((c) => c.id === entry.category)?.name}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className='grid items-center gap-10 p-7 sm:p-10 lg:min-h-[380px] lg:p-14'>
        <div>
          <span data-solid className='inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white/85 backdrop-blur-md'>
            <span className='size-1.5 rounded-full bg-[#ff9db6]' />
            New · Component library
          </span>
          <h2 data-solid className='mt-6 max-w-xl text-balance text-4xl font-medium leading-[1.02] sm:text-5xl'>
            {ENTRIES.length} more ways to put a gradient to work.
          </h2>
          <p data-solid className='mt-5 max-w-md text-pretty leading-relaxed text-white/75'>
            Phone screens, Dynamic Islands, product and glass screens, and new shaders. Each one live, tunable, and a single file
            to copy.
          </p>

          <div data-solid className='mt-8 flex flex-wrap items-center gap-x-6 gap-y-4'>
            <span className='inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-black transition-transform duration-300 group-hover:scale-[1.03]'>
              Explore the library
              <span className='transition-transform duration-300 group-hover:translate-x-1'>→</span>
            </span>
            <span className='flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12px] text-white/65'>
              {CATEGORIES.map((c) => (
                <span key={c.id}>
                  <span className='text-white'>{count(c.id)}</span> {c.name.toLowerCase()}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
