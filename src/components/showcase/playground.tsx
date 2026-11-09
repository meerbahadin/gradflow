'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { CodeBlock } from '@/components/arc/code-block/code-block'
import SegmentedControl from '@/components/arc/segmented-control/segmented-control'
import { Slider } from '@/components/arc/slider/slider'
import type { FlowConfig } from './flow/flow'
import type { Control, Kind } from './catalog'
import { Preview } from './views'

const HEIGHT: Record<Kind, string> = {
  phone: 'min(72vh, 680px)',
  island: 'min(48vh, 420px)',
  poster: 'min(64vh, 620px)',
  shader: 'min(60vh, 540px)',
}

const usageFor = (c: FlowConfig) =>
  `import { Flow } from '@/components/showcase/flow/flow'

export default function Hero() {
  return (
    <section className='relative h-screen'>
      <Flow
        config={{
          type: '${c.type}',
          color1: '${c.color1}',
          color2: '${c.color2}',
          color3: '${c.color3}',
          speed: ${c.speed},
          scale: ${c.scale},
          noise: ${c.noise},
        }}${c.type === 'flute' ? '\n        interactive' : ''}
      />
    </section>
  )
}`

type Values = Record<string, string | number>

const defaults = (controls: Control[] = []): Values => Object.fromEntries(controls.map((c) => [c.key, c.default]))

// the component as it would be written with the props that differ from their defaults
const componentUsage = (name: string, file: string, controls: Control[], values: Values) => {
  const attrs = controls
    .filter((c) => values[c.key] !== c.default)
    .map((c) => {
      const v = values[c.key]
      return typeof v === 'number' ? `${c.key}={${v}}` : `${c.key}='${String(v).replace(/'/g, "\\'")}'`
    })
  const tag = attrs.length ? `<${name}\n      ${attrs.join('\n      ')}\n    />` : `<${name} />`
  return `import ${name} from './${file.replace('.tsx', '')}'\n\nexport default function Page() {\n  return ${attrs.length ? `(\n    ${tag}\n  )` : tag}\n}`
}

const optionLabel = (o: string) => (o === 'auto' ? 'Auto · loop' : o[0].toUpperCase() + o.slice(1).replace('-', ' '))

function Field({ control, value, onChange }: { control: Control; value: string | number; onChange: (v: string | number) => void }) {
  if (control.type === 'select')
    return (
      <div className='grid gap-2'>
        <span className='text-xs text-muted-foreground'>{control.label}</span>
        <div className='flex'>
          <SegmentedControl
            label={control.label}
            value={String(value)}
            onValueChange={onChange}
            options={control.options.map((o) => ({ value: o, label: optionLabel(o) }))}
          />
        </div>
      </div>
    )
  if (control.type === 'color') return <Colour label={control.label} value={String(value)} onChange={onChange} />
  if (control.type === 'number')
    return (
      <div className='rounded-(--radius-control) border border-border px-4 py-3'>
        <Slider label={control.label} min={control.min} max={control.max} step={control.step} value={Number(value)} onValueChange={onChange} format={(v) => `${v}s`} />
      </div>
    )
  return (
    <label className='grid gap-2'>
      <span className='text-xs text-muted-foreground'>{control.label}</span>
      <input
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className='h-10 rounded-(--radius-control) border border-border bg-transparent px-3 text-sm outline-none transition-colors focus:border-ring'
      />
    </label>
  )
}

function Colour({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className='flex items-center gap-3 rounded-(--radius-control) border border-border px-3 py-2'>
      <input type='color' value={value} onChange={(e) => onChange(e.target.value)} className='size-7 cursor-pointer rounded-md border-0 bg-transparent p-0' aria-label={label} />
      <span className='grid leading-tight'>
        <span className='text-xs text-muted-foreground'>{label}</span>
        <span className='font-mono text-[13px] uppercase'>{value}</span>
      </span>
    </label>
  )
}

/**
 * The top of a component page: a live preview with a Code view beside it,
 * and for shaders a Customize panel whose usage snippet follows the knobs.
 */
export default function Playground({
  slug,
  kind,
  shader,
  code,
  filename,
  language,
  controls,
  exportName,
  file,
  sizeNote,
}: {
  slug: string
  kind: Kind
  shader?: FlowConfig
  code: string
  filename: string
  language: string
  controls?: Control[]
  exportName?: string
  file?: string
  sizeNote?: string
}) {
  const [view, setView] = useState('preview')
  const [run, setRun] = useState(0)
  const [cfg, setCfg] = useState<FlowConfig | undefined>(shader)
  const set = (patch: Partial<FlowConfig>) => setCfg((c) => (c ? { ...c, ...patch } : c))
  const [values, setValues] = useState<Values>(() => defaults(controls))

  return (
    <div className='grid grid-cols-[minmax(0,1fr)] gap-10'>
      <div className='min-w-0'>
        <div className='flex items-center justify-between gap-3'>
          <SegmentedControl
            label='View'
            value={view}
            onValueChange={setView}
            options={[
              { value: 'preview', label: 'Preview' },
              { value: 'code', label: 'Code' },
            ]}
          />
          {view === 'preview' && (
            <button
              onClick={() => setRun((r) => r + 1)}
              className='flex h-9 items-center gap-2 rounded-full border border-border px-3.5 text-sm text-subtle transition-colors hover:bg-accent hover:text-foreground'
            >
              <RotateCcw className='size-3.5' /> Replay
            </button>
          )}
        </div>

        <div className='mt-4'>
          {view === 'preview' ? (
            // the preview box stays dark in both themes: these pieces are made to be seen on a screen
            <div className='relative overflow-hidden rounded-(--radius-surface) border border-border bg-[#0d0d11] text-white' style={{ height: HEIGHT[kind] }}>
              <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_0%,rgba(255,255,255,.06),transparent)]' />
              <div key={run} className='sc-swap-in absolute inset-0'>
                <Preview slug={slug} kind={kind} shader={cfg} props={values} />
              </div>
              {shader?.type === 'flute' && (
                <span className='pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 font-mono text-[11px] text-white/70 backdrop-blur-md'>
                  Move your cursor across the glass
                </span>
              )}
            </div>
          ) : (
            <CodeBlock code={code} filename={filename} language={language} maxLines={36} />
          )}
        </div>
      </div>

      {cfg && (
        <>
          <section className='grid grid-cols-[minmax(0,1fr)] gap-5'>
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl font-medium'>Customize</h2>
              <button onClick={() => setCfg(shader)} className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
                Reset
              </button>
            </div>
            <div className='grid gap-3 sm:grid-cols-3'>
              <Colour label='color1' value={cfg.color1} onChange={(v) => set({ color1: v })} />
              <Colour label='color2' value={cfg.color2} onChange={(v) => set({ color2: v })} />
              <Colour label='color3' value={cfg.color3} onChange={(v) => set({ color3: v })} />
            </div>
            <div className='grid gap-6 rounded-(--radius-panel) border border-border p-5 sm:grid-cols-3'>
              <Slider label='Speed' min={0} max={2} step={0.05} value={cfg.speed ?? 0.5} onValueChange={(v) => set({ speed: v })} format={(v) => v.toFixed(2)} />
              <Slider label='Scale' min={0.3} max={2.5} step={0.05} value={cfg.scale ?? 1} onValueChange={(v) => set({ scale: v })} format={(v) => v.toFixed(2)} />
              <Slider label='Grain' min={0} max={0.3} step={0.01} value={cfg.noise ?? 0} onValueChange={(v) => set({ noise: v })} format={(v) => v.toFixed(2)} />
            </div>
          </section>

          <section className='grid grid-cols-[minmax(0,1fr)] gap-5'>
            <h2 className='text-2xl font-medium'>Usage</h2>
            <p className='max-w-2xl text-pretty leading-relaxed text-subtle'>
              The snippet follows the knobs above. Every <code className='rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground'>Flow</code> on a
              page draws through one shared WebGL context, so you can use as many as you like.
            </p>
            <CodeBlock code={usageFor(cfg)} filename='hero.tsx' language='tsx' />
          </section>
        </>
      )}

      {controls && controls.length > 0 && exportName && file && (
        <>
          <section className='grid grid-cols-[minmax(0,1fr)] gap-5'>
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl font-medium'>Customize</h2>
              <button onClick={() => setValues(defaults(controls))} className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
                Reset
              </button>
            </div>
            <div className='grid gap-5 sm:grid-cols-2'>
              {controls.map((c) => (
                <div key={c.key} className={c.type === 'select' ? 'sm:col-span-2' : ''}>
                  <Field control={c} value={values[c.key]} onChange={(v) => setValues((all) => ({ ...all, [c.key]: v }))} />
                </div>
              ))}
            </div>
          </section>

          <section className='grid grid-cols-[minmax(0,1fr)] gap-5'>
            <h2 className='text-2xl font-medium'>Usage</h2>
            <p className='max-w-2xl text-pretty leading-relaxed text-subtle'>
              The snippet follows the controls above. It renders at a fixed {sizeNote}; to fit a smaller box, scale it with a CSS transform.
            </p>
            <CodeBlock code={componentUsage(exportName, file, controls, values)} filename='page.tsx' language='tsx' />
          </section>
        </>
      )}
    </div>
  )
}
