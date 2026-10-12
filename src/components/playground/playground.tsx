'use client'

import { useMemo, useRef, useState } from 'react'
import { Download, Shuffle } from 'lucide-react'

import GradFlow from '@/components/grad-flow'
import { GRADIENT_TYPES, PRESETS } from '@/constants/gradients'
import { hexToRgb, rgbToHex } from '@/lib/color-conversion'
import { generateRandomColors, randomGradientType } from '@/lib/random-colors'
import { PRESET_NAMES } from '@/lib/showcase'
import type { GradientConfig, GradientType, PresetName } from '@/types/gradient'
import { Button } from '@/components/arc/button/button'
import { CodeBlock } from '@/components/arc/code-block/code-block'
import { ColorPicker } from '@/components/arc/color-picker/color-picker'
import SegmentedControl from '@/components/arc/segmented-control/segmented-control'
import { Select } from '@/components/arc/select/select'
import { Slider } from '@/components/arc/slider/slider'
import { Switch } from '@/components/arc/switch/switch'

const COLOR_KEYS = ['color1', 'color2', 'color3'] as const

const TYPE_OPTIONS = GRADIENT_TYPES.map((type) => ({
  value: type,
  label: type[0].toUpperCase() + type.slice(1),
}))

type Panel = 'controls' | 'code'

function toCode(config: GradientConfig, interactive: boolean) {
  const lines = [
    `import { GradFlow } from 'gradflow'`,
    ``,
    `<GradFlow`,
    `  config={{`,
    `    type: '${config.type}',`,
    ...COLOR_KEYS.map((key) => `    ${key}: '${rgbToHex(config[key])}',`),
    `    speed: ${config.speed},`,
    `    scale: ${config.scale},`,
    `    noise: ${config.noise},`,
    `  }}`,
  ]
  if (interactive) lines.push(`  interactive`)
  lines.push(`/>`)
  return lines.join('\n')
}

function Group({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className='grid gap-4 border-t border-hairline px-5 py-5 first:border-t-0'>
      <h2 className='font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground'>
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function Playground({ initial }: { initial: GradientConfig }) {
  const [config, setConfig] = useState(initial)
  const [interactive, setInteractive] = useState(true)
  const [paused, setPaused] = useState(false)
  const [panel, setPanel] = useState<Panel>('controls')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const update = (changes: Partial<GradientConfig>) =>
    setConfig((current) => ({ ...current, ...changes }))

  const code = useMemo(() => toCode(config, interactive), [config, interactive])

  // the preset whose values match exactly, if any, so its swatch reads as selected
  const activePreset = PRESET_NAMES.find((name) => {
    const preset = PRESETS[name]
    return (
      preset.type === config.type &&
      COLOR_KEYS.every((key) => rgbToHex(preset[key]) === rgbToHex(config[key]))
    )
  })

  const exportStill = () => {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `gradflow-${config.type}.png`
      link.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <main className='grid gap-2 p-2 pt-[84px] sm:gap-3 sm:p-3 sm:pt-[100px] lg:h-svh lg:grid-cols-[minmax(0,1fr)_380px]'>
      <div className='on-gradient relative isolate h-[52svh] min-h-[320px] overflow-hidden rounded-(--radius-surface) bg-black lg:h-auto'>
        <div className='absolute inset-0 -z-10'>
          <GradFlow
            ref={canvasRef}
            config={config}
            interactive={interactive}
            paused={paused}
            preserveDrawingBuffer
          />
        </div>

        <div className='absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-linear-to-t from-black/50 to-transparent p-5 pt-16 sm:p-7 sm:pt-20'>
          <div>
            <p className='font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground'>
              Playground
            </p>
            <p className='mt-1 font-heading text-3xl font-medium capitalize leading-none sm:text-4xl'>
              {config.type}
            </p>
          </div>
          <Button variant='secondary' className='backdrop-blur-xl' onClick={exportStill}>
            <Download className='size-4' />
            Export PNG
          </Button>
        </div>
      </div>

      <aside className='flex min-h-0 flex-col overflow-hidden rounded-(--radius-surface) border border-border bg-surface'>
        <div className='flex items-center justify-between gap-3 border-b border-hairline p-3'>
          <SegmentedControl
            label='Panel'
            value={panel}
            onValueChange={(value) => setPanel(value as Panel)}
            options={[
              { value: 'controls', label: 'Controls' },
              { value: 'code', label: 'Code' },
            ]}
          />
          <Button
            variant='ghost'
            size='sm'
            onClick={() =>
              update({ ...generateRandomColors(), type: randomGradientType() })
            }
          >
            <Shuffle className='size-4' />
            Surprise me
          </Button>
        </div>

        {panel === 'code' ? (
          <div className='min-h-0 flex-1 overflow-y-auto p-3'>
            <CodeBlock code={code} language='tsx' />
          </div>
        ) : (
          <div className='no-scrollbar min-h-0 flex-1 overflow-y-auto'>
            <Group title='Shader'>
              <Select
                label='Type'
                value={config.type}
                onValueChange={(value) => update({ type: value as GradientType })}
                options={TYPE_OPTIONS}
              />
            </Group>

            <Group title='Colors'>
              <div className='grid gap-2'>
                {COLOR_KEYS.map((key, i) => (
                  <ColorPicker
                    key={key}
                    label={`Color ${i + 1}`}
                    value={rgbToHex(config[key])}
                    onValueChange={(hex) =>
                      update({ [key]: hexToRgb(hex.slice(0, 7)) })
                    }
                  />
                ))}
              </div>
            </Group>

            <Group title='Motion'>
              <Slider
                label='Speed'
                value={config.speed}
                onValueChange={(speed) => update({ speed })}
                min={0}
                max={3}
                step={0.1}
                format={(value) => value.toFixed(1)}
                showValue
              />
              <Slider
                label='Scale'
                value={config.scale}
                onValueChange={(scale) => update({ scale })}
                min={0.5}
                max={3}
                step={0.1}
                format={(value) => value.toFixed(1)}
                showValue
              />
              <Slider
                label='Noise'
                value={config.noise}
                onValueChange={(noise) => update({ noise })}
                min={0}
                max={0.5}
                step={0.01}
                format={(value) => value.toFixed(2)}
                showValue
              />
              <div className='grid gap-3 pt-1'>
                <Switch
                  label='Follow the pointer'
                  checked={interactive}
                  onCheckedChange={setInteractive}
                />
                <Switch label='Pause' checked={paused} onCheckedChange={setPaused} />
              </div>
            </Group>

            <Group title='Presets'>
              <div className='grid grid-cols-2 gap-1.5'>
                {PRESET_NAMES.map((name) => (
                  <PresetButton
                    key={name}
                    name={name}
                    active={name === activePreset}
                    onSelect={() => setConfig({ ...PRESETS[name] })}
                  />
                ))}
              </div>
            </Group>
          </div>
        )}
      </aside>
    </main>
  )
}

function PresetButton({
  name,
  active,
  onSelect,
}: {
  name: PresetName
  active: boolean
  onSelect: () => void
}) {
  const preset = PRESETS[name]

  return (
    <button
      type='button'
      onClick={onSelect}
      aria-pressed={active}
      className='flex items-center gap-2.5 rounded-xl border border-border px-2.5 py-2 text-left text-sm capitalize transition-colors hover:bg-muted aria-pressed:border-foreground aria-pressed:bg-muted'
    >
      <span className='flex shrink-0 -space-x-1.5'>
        {COLOR_KEYS.map((key) => (
          <span
            key={key}
            className='size-4 rounded-full ring-2 ring-surface'
            style={{ background: rgbToHex(preset[key]) }}
          />
        ))}
      </span>
      <span className='truncate'>{name}</span>
    </button>
  )
}
