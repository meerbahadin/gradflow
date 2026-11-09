import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CodeBlock } from '@/components/arc/code-block/code-block'
import { CATEGORIES, ENTRIES, entry, neighbours, type Control, type Entry } from '@/components/showcase/catalog'
import { SHADER_SOURCE } from '@/components/showcase/flow/shaders'
import Playground from '@/components/showcase/playground'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return ENTRIES.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const e = entry((await params).slug)
  return e ? { title: `${e.name} · Components`, description: e.desc } : {}
}

const DIR = path.join(process.cwd(), 'src/components/showcase')

// read a file the way it would sit in someone else's project
const read = (file: string) =>
  fs.readFileSync(path.join(DIR, file), 'utf-8').replace("import GradFlow from '@/components/grad-flow'", "import { GradFlow } from 'gradflow'")

const SIZE: Record<Entry['kind'], string> = {
  phone: '390 × 844, a phone screen',
  island: '390 × 260, the top of a phone',
  poster: '1120 × 700, a desktop screen',
  shader: 'fills its parent',
}

const FLOW_PROPS = [
  { name: 'config', type: 'FlowConfig', fallback: 'required', description: 'type, color1, color2, color3, speed, scale and noise.' },
  { name: 'transition', type: 'number', fallback: '700', description: 'Milliseconds a config change takes to blend in.' },
  { name: 'interactive', type: 'boolean', fallback: 'false', description: 'Feed the cursor to the shader. Only flute and panes use it.' },
  { name: 'quality', type: 'number', fallback: '1', description: 'Render below full resolution; 0.5 is plenty for soft full-bleed fields.' },
  { name: 'seed', type: 'number', fallback: 'random', description: 'Fix the starting time so two instances stay in step.' },
  { name: 'className', type: 'string', fallback: 'none', description: 'Classes for the canvas.' },
]

const CONFIG_PROPS = [
  { name: 'type', type: 'FlowType', fallback: 'required', description: 'flute, panes, horizon, veil, core, aura, ember, ink, bloom, ripple, bokeh, drift or current.' },
  { name: 'color1', type: 'string', fallback: 'required', description: 'Hex colour.' },
  { name: 'color2', type: 'string', fallback: 'required', description: 'Hex colour; usually the base.' },
  { name: 'color3', type: 'string', fallback: 'required', description: 'Hex colour; usually the highlight.' },
  { name: 'speed', type: 'number', fallback: '0.5', description: 'Animation rate. 0 stops time.' },
  { name: 'scale', type: 'number', fallback: '1', description: 'Zoom of the pattern.' },
  { name: 'noise', type: 'number', fallback: '0.1', description: 'Film grain from 0 to 0.3.' },
]

// a control, as a row of the props table
const propRow = (c: Control) => ({
  name: c.key,
  type: c.type === 'select' ? c.options.map((o) => `'${o}'`).join(' | ') : c.type === 'number' ? 'number' : 'string',
  fallback: typeof c.default === 'number' ? String(c.default) : `'${c.default}'`,
  description: c.description,
})

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className='grid grid-cols-[minmax(0,1fr)] gap-5 border-t border-hairline pt-12'>
      <h2 className='text-2xl font-medium leading-tight'>{title}</h2>
      {children}
    </section>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className='max-w-2xl text-pretty leading-relaxed text-subtle'>{children}</p>
}

function C({ children }: { children: React.ReactNode }) {
  return <code className='rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground'>{children}</code>
}

function Table({ rows }: { rows: { name: string; type: string; fallback: string; description: string }[] }) {
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

export default async function ComponentPage({ params }: Params) {
  const e = entry((await params).slug)
  if (!e) notFound()

  const category = CATEGORIES.find((c) => c.id === e.category)!
  const { prev, next } = neighbours(e.slug)
  const isShader = e.kind === 'shader'
  const code = isShader ? `// ${e.slug}: the shade() body. The header, noise helpers and grain are shared in flow/shaders.ts.${SHADER_SOURCE[e.shader!.type]}` : read(e.file!)
  const needsGradFlow = !isShader && code.includes("from 'gradflow'")
  const files = isShader ? e.helpers : [e.file!, ...e.helpers]

  return (
    <article className='grid grid-cols-[minmax(0,1fr)] gap-12'>
      <header className='max-w-2xl'>
        <p className='font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground'>
          <Link href='/components' className='hover:text-foreground'>
            Components
          </Link>{' '}
          / {category.name}
        </p>
        <h1 className='mt-4 text-4xl font-medium leading-[1.02]'>{e.name}</h1>
        <p className='mt-5 text-pretty text-lg leading-relaxed text-subtle'>{e.desc}</p>
        <div className='mt-5 flex flex-wrap gap-2'>
          {e.uses.map((u) => (
            <span key={u} className='rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-subtle'>
              {u}
            </span>
          ))}
        </div>
      </header>

      <Playground
        slug={e.slug}
        kind={e.kind}
        shader={e.shader}
        code={code}
        filename={isShader ? `${e.slug}.glsl` : e.file!}
        language={isShader ? 'glsl' : 'tsx'}
        controls={e.controls}
        exportName={e.exportName}
        file={e.file}
        sizeNote={SIZE[e.kind]}
      />

      <Section title='Installation'>
        {needsGradFlow ? (
          <>
            <P>It draws with GradFlow, so install the package first.</P>
            <CodeBlock code='npm install gradflow' language='bash' />
          </>
        ) : (
          <P>No packages to install: the gradients draw through the shared Flow renderer that ships with these components.</P>
        )}
        <P>Then copy these files into one folder in your project, keeping their names:</P>
        <ul className='grid gap-1.5'>
          {files.map((f) => (
            <li key={f} className='font-mono text-[13px] text-subtle'>
              <C>{f}</C>
            </li>
          ))}
        </ul>
      </Section>

      {isShader ? (
        <Section title='Props'>
          <P>
            <C>{'<Flow>'}</C> takes the same shape of config as GradFlow, so a palette carries across from one to the other.
          </P>
          <Table rows={FLOW_PROPS} />
          <P>
            The fields of <C>config</C>:
          </P>
          <Table rows={CONFIG_PROPS} />
        </Section>
      ) : (
        <Section title='Props'>
          <P>Every prop is optional. Anything you leave out falls back to the default below.</P>
          <Table rows={(e.controls ?? []).map(propRow)} />
        </Section>
      )}

      <nav className='flex justify-between gap-4 border-t border-hairline pt-8 text-sm'>
        {prev ? (
          <Link href={`/components/${prev.slug}`} className='group grid'>
            <span className='text-muted-foreground'>Previous</span>
            <span className='font-medium group-hover:underline'>← {prev.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/components/${next.slug}`} className='group grid text-right'>
            <span className='text-muted-foreground'>Next</span>
            <span className='font-medium group-hover:underline'>{next.name} →</span>
          </Link>
        )}
      </nav>
    </article>
  )
}
