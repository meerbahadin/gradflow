'use client'

import { useEffect, useMemo, useRef } from 'react'
import { cn } from '@/lib/utils'
import { resolveConfig } from '@/lib/resolve-config'
import type { GradientConfigInput, PresetName } from '@/types/gradient'
import { refreshTile, registerTile, type Tile } from './tile-pool'

/**
 * A gradient for grids and thumbnails. Unlike GradFlow it doesn't own a WebGL
 * context — every tile on the page is drawn by one shared renderer, so a
 * gallery can show dozens of them.
 */
export default function GradientTile({
  config,
  preset,
  className,
}: {
  config?: GradientConfigInput
  preset?: PresetName
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tileRef = useRef<Tile | null>(null)
  const resolved = useMemo(() => resolveConfig(config, preset), [config, preset])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const tile: Tile = {
      canvas,
      config: resolved,
      visible: false,
      pointer: [0.5, 0.5, 0],
    }
    tileRef.current = tile

    const unregister = registerTile(tile)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5)
      canvas.width = Math.max(Math.round(canvas.clientWidth * dpr), 1)
      canvas.height = Math.max(Math.round(canvas.clientHeight * dpr), 1)
      refreshTile(tile)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        tile.visible = entry.isIntersecting
        refreshTile(tile)
      },
      { rootMargin: '80px' }
    )
    intersectionObserver.observe(canvas)

    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      tile.pointer = [
        (event.clientX - rect.left) / rect.width,
        1 - (event.clientY - rect.top) / rect.height,
        1,
      ]
    }
    const leave = () => {
      tile.pointer = [tile.pointer[0], tile.pointer[1], 0]
    }
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)

    return () => {
      unregister()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
      tileRef.current = null
    }
    // the tile is registered once; config changes are pushed in below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const tile = tileRef.current
    if (!tile) return
    tile.config = resolved
    refreshTile(tile)
  }, [resolved])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden='true'
      className={cn('absolute inset-0 block size-full', className)}
    />
  )
}
