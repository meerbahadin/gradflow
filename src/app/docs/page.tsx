import type { Metadata } from 'next'
import Link from 'next/link'

import { PRESETS } from '@/constants/gradients'
import { rgbToHex } from '@/lib/color-conversion'
import {
  INSTALL_COMMAND,
  PRESET_COUNT,
  PRESET_NAMES,
  TYPE_COUNT,
  TYPES,
} from '@/lib/showcase'
import { CodeBlock } from '@/components/arc/code-block/code-block'
import DocsNav, { type DocsSection } from '@/components/docs/docs-nav'
import GradientTile from '@/components/site/gradient-tile'

export const metadata: Metadata = {
  title: 'Docs',
  description:
    'Install GradFlow, drop it behind your content, and tune it: every prop, gradient type and preset.',
}

const SECTIONS: DocsSection[] = [
  { id: 'installation', label: 'Installation' },
  { id: 'usage', label: 'Usage' },
  { id: 'props', label: 'Props' },
  { id: 'config', label: 'Config' },
  { id: 'types', label: 'Gradient types' },
  { id: 'presets', label: 'Presets' },
  { id: 'transitions', label: 'Transitions' },
  { id: 'pointer', label: 'Pointer interaction' },
  { id: 'export', label: 'Exporting a still' },
  { id: 'performance', label: 'Performance' },
  { id: 'accessibility', label: 'Accessibility' },
]

const PROPS = [
  {
    name: 'preset',
    type: 'PresetName',
    fallback: 'none',
    description: 'Start from one of the built-in looks.',
  },
  {
    name: 'config',
    type: 'GradientConfigInput',
    fallback: 'aurora defaults',
    description: 'Type, colors, speed, scale and noise. Overrides the preset field by field.',
  },
  {
    name: 'transition',
    type: 'number',
    fallback: '700',
    description: 'Milliseconds a config or preset change takes to blend in. 0 switches instantly.',
  },
  {
    name: 'interactive',
    type: 'boolean',
    fallback: 'false',
    description: 'Let the pattern swell under the pointer.',
  },
  {
    name: 'paused',
    type: 'boolean',
    fallback: 'false',
    description: 'Freeze the animation on a single frame.',
  },
  {
    name: 'preserveDrawingBuffer',
    type: 'boolean',
    fallback: 'false',
    description: 'Keep the canvas readable for toBlob and toDataURL.',
  },
  {
    name: 'className',
    type: 'string',
    fallback: 'none',
    description: 'Classes for the canvas element.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLCanvasElement>',
    fallback: 'none',
    description: 'Forwarded to the canvas.',
  },
]

const CONFIG = [
  { name: 'type', type: 'GradientType', fallback: "'aurora'", description: `One of the ${TYPE_COUNT} shaders below.` },
  { name: 'color1', type: 'string | RGB', fallback: '#d21570', description: 'Hex string or { r, g, b } with 0 to 255 channels.' },
  { name: 'color2', type: 'string | RGB', fallback: '#8c3ff8', description: 'Same formats as color1.' },
  { name: 'color3', type: 'string | RGB', fallback: '#56ffc3', description: 'Same formats as color1.' },
  { name: 'speed', type: 'number', fallback: '0.5', description: 'Animation rate. 0 stops time; around 0.3 to 1 reads as ambient.' },
  { name: 'scale', type: 'number', fallback: '1.2', description: 'Zoom of the pattern. Higher values show more, finer detail.' },
  { name: 'noise', type: 'number', fallback: '0.32', description: 'Film grain from 0 to 0.5. Hides banding on wide, soft ramps.' },
]

const USAGE = `import { GradFlow } from 'gradflow'

export default function Hero() {
  return (
    <section className="relative isolate h-screen">
      <div className="absolute inset-0 -z-10">
        <GradFlow preset="borealis" />
      </div>

      <h1>Your content, on top.</h1>
    </section>
  )
}`

const CONFIG_EXAMPLE = `<GradFlow
  config={{
    type: 'prism',
    color1: '#ff3c78',
    color2: { r: 60, g: 110, b: 255 },
    color3: '#5affc8',
    speed: 0.5,
    scale: 1,
    noise: 0.1,
  }}
/>`

const PRESET_EXAMPLE = `// a preset on its own
<GradFlow preset="magma" />

// a preset with one thing changed
<GradFlow preset="magma" config={{ speed: 0.2 }} />`

const TRANSITION_EXAMPLE = `const [preset, setPreset] = useState<PresetName>('lagoon')

// the canvas blends from one look to the next over 1.2 seconds
<GradFlow preset={preset} transition={1200} />

<button onClick={() => setPreset('sahara')}>Evening</button>`

const POINTER_EXAMPLE = `<GradFlow preset="atlas" interactive />`

const EXPORT_EXAMPLE = `const canvas = useRef<HTMLCanvasElement>(null)

const save = () =>
  canvas.current?.toBlob((blob) => {
    if (blob) window.open(URL.createObjectURL(blob))
  })

<GradFlow ref={canvas} preset="spectrum" preserveDrawingBuffer />`

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className='grid grid-cols-[minmax(0,1fr)] gap-5 border-t border-hairline py-12 first:border-t-0 first:pt-0'>
      <h2 className='text-2xl font-medium leading-tight'>{title}</h2>
      {children}
    </section>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className='max-w-2xl text-pretty leading-relaxed text-subtle'>{children}</p>
  )
}

function C({ children }: { children: React.ReactNode }) {
  return (
    <code className='rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground'>
      {children}
    </code>
  )
}

function Table({
  rows,
}: {
  rows: { name: string; type: string; fallback: string; description: string }[]
}) {
  return (
    <div className='overflow-x-auto rounded-(--radius-panel) border border-border'>
      <table className='w-full min-w-[640px] text-left text-sm'>
        <thead className='bg-muted font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground'>
          <tr>
            <th className='px-4 py-3 font-normal'>Name</th>
            <th className='px-4 py-3 font-normal'>Type</th>
            <th className='px-4 py-3 font-normal'>Default</th>
            <th className='px-4 py-3 font-normal'>Description</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-hairline'>
          {rows.map((row) => (
            <tr key={row.name} className='align-top'>
              <td className='px-4 py-3 font-mono text-[13px]'>{row.name}</td>
              <td className='px-4 py-3 font-mono text-[13px] text-subtle'>{row.type}</td>
              <td className='px-4 py-3 font-mono text-[13px] text-subtle'>{row.fallback}</td>
              <td className='px-4 py-3 text-subtle'>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function DocsPage() {
  return (
    <main className='container grid gap-12 pb-24 pt-32 sm:pt-40 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16'>
      <aside className='hidden lg:block'>
        <div className='sticky top-28'>
          <DocsNav sections={SECTIONS} />
        </div>
      </aside>

      <div className='min-w-0'>
        <header className='mb-14 max-w-2xl'>
          <p className='font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground'>
            Documentation
          </p>
          <h1 className='mt-4 text-4xl font-medium leading-[1.02]'>
            Everything it does, on one page.
          </h1>
          <p className='mt-5 text-pretty text-lg leading-relaxed text-subtle'>
            GradFlow is one React component. It renders a canvas, fills its
            parent, and animates a gradient on the GPU.
          </p>
        </header>

        <Section id='installation' title='Installation'>
          <P>
            The package has no dependencies of its own. It needs React 18 or
            newer.
          </P>
          <CodeBlock code={INSTALL_COMMAND} language='bash' />
        </Section>

        <Section id='usage' title='Usage'>
          <P>
            The canvas takes the size of its parent, so give the parent a
            size and a position. Placing the gradient in an absolutely
            positioned layer with a negative z-index keeps it behind your
            content; <C>isolate</C> on the section stops that layer from
            slipping behind the page background.
          </P>
          <CodeBlock code={USAGE} filename='hero.tsx' language='tsx' />
          <P>
            GradFlow is a client component. You can import it from a server
            component without adding <C>&apos;use client&apos;</C> yourself.
          </P>
        </Section>

        <Section id='props' title='Props'>
          <Table rows={PROPS} />
        </Section>

        <Section id='config' title='Config'>
          <P>
            Every field is optional. Anything you leave out comes from the
            preset if you passed one, and from the defaults otherwise.
          </P>
          <Table rows={CONFIG} />
          <CodeBlock code={CONFIG_EXAMPLE} language='tsx' />
        </Section>

        <Section id='types' title='Gradient types'>
          <P>
            {TYPE_COUNT} shaders. Click one to open it in the playground.
          </P>
          <ul className='grid gap-2 sm:grid-cols-2'>
            {TYPES.map(({ type, blurb, config, isNew }) => (
              <li key={type}>
                <Link
                  href={`/playground?type=${type}`}
                  className='flex items-center gap-4 rounded-(--radius-control) border border-border p-2 pr-4 transition-colors hover:bg-muted'
                >
                  <span className='relative isolate block h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-muted'>
                    <GradientTile config={config} />
                  </span>
                  <span className='min-w-0'>
                    <span className='flex items-center gap-2 font-mono text-sm'>
                      {type}
                      {isNew && (
                        <span className='rounded-full bg-foreground px-1.5 py-px text-[10px] uppercase tracking-wider text-background'>
                          New
                        </span>
                      )}
                    </span>
                    <span className='mt-0.5 block truncate text-sm text-muted-foreground'>
                      {blurb}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section id='presets' title='Presets'>
          <P>
            {PRESET_COUNT} ready-made looks. A preset sets every config
            field; pass <C>config</C> alongside it to change some of them.
          </P>
          <CodeBlock code={PRESET_EXAMPLE} language='tsx' />
          <ul className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4'>
            {PRESET_NAMES.map((name) => (
              <li key={name}>
                <Link
                  href={`/playground?preset=${name}`}
                  className='flex items-center gap-2.5 rounded-xl border border-border px-3 py-2.5 transition-colors hover:bg-muted'
                >
                  <span className='flex shrink-0 -space-x-1.5'>
                    {(['color1', 'color2', 'color3'] as const).map((key) => (
                      <span
                        key={key}
                        className='size-4 rounded-full ring-2 ring-background'
                        style={{ background: rgbToHex(PRESETS[name][key]) }}
                      />
                    ))}
                  </span>
                  <span className='min-w-0'>
                    <span className='block truncate font-mono text-[13px]'>{name}</span>
                    <span className='block text-xs text-muted-foreground'>
                      {PRESETS[name].type}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section id='transitions' title='Transitions'>
          <P>
            When <C>preset</C> or <C>config</C> changes, the canvas blends
            to the new look instead of jumping. Colors, speed, scale and
            noise interpolate; a change of type dissolves the old pattern
            into the new one along a noise front. <C>transition</C> sets the
            duration in milliseconds, and <C>0</C> turns blending off.
          </P>
          <CodeBlock code={TRANSITION_EXAMPLE} language='tsx' />
          <P>
            Changing <C>speed</C> never makes the pattern skip. Time is
            accumulated frame by frame, so a faster speed only means the
            pattern moves faster from where it already is.
          </P>
        </Section>

        <Section id='pointer' title='Pointer interaction'>
          <P>
            With <C>interactive</C> set, the pattern is magnified under the
            pointer and the effect trails behind fast movement. The pointer
            is tracked on the window, so it keeps working when the canvas
            sits behind other content.
          </P>
          <CodeBlock code={POINTER_EXAMPLE} language='tsx' />
        </Section>

        <Section id='export' title='Exporting a still'>
          <P>
            The ref points at the canvas element. Browsers clear a WebGL
            canvas after each frame is shown, so set{' '}
            <C>preserveDrawingBuffer</C> on any gradient you intend to read
            back.
          </P>
          <CodeBlock code={EXPORT_EXAMPLE} language='tsx' />
        </Section>

        <Section id='performance' title='Performance'>
          <P>
            A gradient is one triangle and one fragment shader, rendered at
            up to twice the device pixel ratio. The render loop stops while
            the canvas is off screen and while the tab is hidden, and starts
            again on its own.
          </P>
          <P>
            Each GradFlow owns a WebGL context. Browsers allow roughly
            sixteen per page and drop the oldest past that, so keep the
            number of gradients mounted at once in single digits. If a
            context is lost, GradFlow rebuilds its program when the browser
            restores it.
          </P>
        </Section>

        <Section id='accessibility' title='Accessibility'>
          <P>
            Visitors who ask their system for reduced motion get one still
            frame of the gradient, with the pointer effect off. Use{' '}
            <C>paused</C> to give everyone a control over it, and keep enough
            contrast between your text and the brightest part of the
            pattern; a scrim over the edge your text sits on is usually
            enough.
          </P>
        </Section>
      </div>
    </main>
  )
}
