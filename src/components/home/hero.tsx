'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

import GradFlow from '@/components/grad-flow'
import { DEFAULT_CONFIG, PRESETS } from '@/constants/gradients'
import { NEW_TYPE_COUNT } from '@/lib/showcase'
import type { GradientConfig, PresetName } from '@/types/gradient'
import { Badge } from '@/components/arc/badge/badge'
import { PlayPauseIcon } from '@/components/arc/icon-morph/icon-morph'
import { TextMorph } from '@/components/arc/text-morph/text-morph'
import ButtonLink from '@/components/site/button-link'
import InstallCommand from '@/components/site/install-command'

type Scene = { name: string; config: GradientConfig }

const preset = (name: PresetName): Scene => ({ name, config: PRESETS[name] })

/**
 * What the hero plays, in order. It opens on the package defaults, the look
 * GradFlow has always shipped with; the rest are presets dark enough to sit
 * behind white type.
 */
const SCENES: Scene[] = [
  { name: 'default', config: DEFAULT_CONFIG },
  preset('magma'),
  preset('spectrum'),
  preset('lagoon'),
  preset('reeded'),
  preset('andromeda'),
  preset('sahara'),
  preset('cosmic'),
  preset('maelstrom'),
  preset('cathedral'),
  preset('atlas'),
  preset('mystic'),
]

const SCENE_SECONDS = 7

const dockButton =
  'flex size-9 items-center justify-center rounded-xl text-subtle transition-colors hover:bg-muted hover:text-foreground'

export default function Hero() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)

  const scene = SCENES[index]
  const step = (by: number) =>
    setIndex((i) => (i + by + SCENES.length) % SCENES.length)

  useEffect(() => {
    if (!playing) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % SCENES.length),
      SCENE_SECONDS * 1000
    )
    return () => clearTimeout(timer)
  }, [index, playing])

  return (
    <section className='p-2 sm:p-3'>
      <div className='on-gradient relative isolate flex h-[calc(100svh-1rem)] min-h-[680px] flex-col justify-end overflow-hidden rounded-(--radius-surface) sm:h-[calc(100svh-1.5rem)]'>
        <div className='absolute inset-0 -z-10 bg-black'>
          <GradFlow config={scene.config} interactive transition={1800} />
          {/* nested inside the gradient layer so it tints the canvas rather
              than covering it; only the bottom edge needs the contrast */}
          <div className='absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-black/10' />
        </div>

        <div className='container grid items-end gap-10 pb-6 sm:pb-10 lg:grid-cols-[minmax(0,1fr)_auto]'>
          <div>
            <Badge
              className='backdrop-blur-xl'
              icon={<span className='block size-1.5 rounded-full bg-emerald-400' />}
            >
              {`v0.3 · ${NEW_TYPE_COUNT} new shaders, zero dependencies`}
            </Badge>

            <h1 className='mt-6 text-[clamp(3.25rem,9.2vw,8.5rem)] font-medium leading-[0.9] tracking-[-0.05em]'>
              Gradients
              <br />
              that feel{' '}
              <em className='font-serif font-normal tracking-[-0.03em]'>
                alive.
              </em>
            </h1>

            <p className='mt-7 max-w-lg text-pretty text-base leading-relaxed text-subtle sm:text-lg'>
              A WebGL gradient component for React. Twenty shaders, one prop
              to move between them, and nothing else to install.
            </p>

            <div className='mt-8 flex flex-wrap items-center gap-3'>
              <ButtonLink href='/docs' size='lg'>
                Get started
                <ArrowUpRight className='size-4' />
              </ButtonLink>
              <ButtonLink
                href='/playground'
                size='lg'
                variant='secondary'
                className='backdrop-blur-xl'
              >
                Open the playground
              </ButtonLink>
              <InstallCommand className='hidden sm:flex' />
            </div>
          </div>

          {/* the dock: what is on screen right now, and a way to change it */}
          <div className='w-full rounded-(--radius-panel) border border-border bg-black/30 p-2 backdrop-blur-2xl lg:w-72'>
            <div className='flex items-center justify-between gap-3 px-2.5 pb-2 pt-1.5'>
              <div className='min-w-0'>
                <p className='font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground'>
                  Now playing
                </p>
                <p className='mt-1 flex items-baseline gap-2 font-heading text-xl font-medium capitalize leading-none'>
                  <TextMorph>{scene.name}</TextMorph>
                </p>
              </div>
              <p className='font-mono text-xs tabular-nums text-muted-foreground'>
                {String(index + 1).padStart(2, '0')}
                <span className='px-1 opacity-50'>/</span>
                {String(SCENES.length).padStart(2, '0')}
              </p>
            </div>

            <div className='mx-2.5 h-px overflow-hidden bg-border'>
              <div
                key={`${index}-${playing}`}
                className='h-full origin-left bg-foreground motion-reduce:hidden'
                style={{
                  animation: playing
                    ? `hero-progress ${SCENE_SECONDS}s linear forwards`
                    : undefined,
                  transform: playing ? undefined : 'scaleX(0)',
                }}
              />
            </div>

            <div className='flex items-center justify-between gap-2 px-1 pt-2'>
              <code className='truncate px-1.5 font-mono text-xs text-subtle'>
                type=&quot;{scene.config.type}&quot;
              </code>
              <div className='flex items-center'>
                <button
                  type='button'
                  className={dockButton}
                  onClick={() => step(-1)}
                  aria-label='Previous gradient'
                >
                  <ArrowLeft className='size-4' />
                </button>
                <button
                  type='button'
                  className={dockButton}
                  onClick={() => setPlaying((value) => !value)}
                  aria-label={playing ? 'Pause the slideshow' : 'Play the slideshow'}
                  aria-pressed={!playing}
                >
                  <PlayPauseIcon state={playing} className='size-4' />
                </button>
                <button
                  type='button'
                  className={dockButton}
                  onClick={() => step(1)}
                  aria-label='Next gradient'
                >
                  <ArrowRight className='size-4' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
