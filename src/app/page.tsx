import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import CodeBlock from '@/components/code/code-block'
import GradFlowDemo from '@/components/grad-flow-demo'
import { ThemeToggle } from '@/components/theme-toggle'

import { Code, Download, TrendingUp } from 'lucide-react'
import FeatureCards from '@/components/feature-cards'
import GradFlow from '@/components/grad-flow'

export default function Home() {
  return (
    <main className='relative'>
      <GradFlowDemo />

      <div className='container max-w-5xl flex justify-end pt-8'>
        <ThemeToggle />
      </div>

      <FeatureCards />

      {/* Live Demo Section */}
      <section className='container max-w-4xl py-24 space-y-10'>
        <div className='space-y-4 text-center'>
          <span className='block text-xs font-semibold uppercase tracking-[0.2em] text-primary/80'>
            Live Example
          </span>
          <h2 className='text-4xl md:text-5xl font-bold tracking-tight text-balance bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent'>
            See It In Action
          </h2>
          <p className='text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto'>
            Explore a real interface built with GradFlow as an animated
            background, complete with theme switching and gradient
            customization.
          </p>
        </div>

        <Link href='/demo' className='block group'>
          <Image
            src='/demo.png'
            width={1280}
            height={896}
            alt='GradFlow AI chat demo preview'
            className='w-full h-auto rounded-3xl  border-border  transition-transform duration-300 group-hover:scale-[1.01]'
          />
        </Link>
      </section>

      {/* Installation Section */}
      <section
        id='installation'
        className='container max-w-4xl py-24 space-y-20'
      >
        <div className='space-y-8'>
          <div className='space-y-3'>
            <span className='block text-xs font-semibold uppercase tracking-[0.2em] text-primary/80'>
              Get Started
            </span>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center'>
                <Download className='w-4.5 h-4.5 text-blue-400' />
              </div>
              <h2 className='text-4xl font-bold tracking-tight'>
                Installation
              </h2>
            </div>
            <p className='text-muted-foreground text-base leading-relaxed'>
              Get started in seconds. Install the package via npm.
            </p>
          </div>

          <div className='space-y-6'>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-mono font-semibold text-primary'>
                  01
                </span>
                <h3 className='text-xl font-semibold tracking-tight'>
                  Install Package
                </h3>
              </div>
              <CodeBlock code={`npm install gradflow`} lang='bash' />
            </div>

            <div className='space-y-3'>
              <div className='space-y-1'>
                <div className='flex items-center gap-3'>
                  <span className='flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-mono font-semibold text-primary'>
                    02
                  </span>
                  <h3 className='text-xl font-semibold tracking-tight'>
                    Import &amp; Use
                  </h3>
                </div>
                <p className='text-sm text-muted-foreground pl-9'>
                  Import the component and start using it right away
                </p>
              </div>
              <CodeBlock
                code={`import { GradFlow } from 'gradflow'

function App() {
  return (
    <div className="relative h-screen">
      <GradFlow />
      {/* Your content here */}
    </div>
  )
}`}
              />
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className='space-y-8'>
          <div className='space-y-3'>
            <span className='block text-xs font-semibold uppercase tracking-[0.2em] text-primary/80'>
              Recipes
            </span>
            <h2 className='text-4xl font-bold tracking-tight'>
              Usage Examples
            </h2>
            <p className='text-muted-foreground text-base leading-relaxed'>
              Customize colors, animation speed, scale, and noise settings to
              create unique gradient backgrounds.
            </p>
          </div>

          <div className='space-y-6'>
            <div className='space-y-3'>
              <div className='space-y-1'>
                <h3 className='text-xl font-semibold tracking-tight'>
                  With Custom Colors
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Use RGB objects or hex strings
                </p>
              </div>
              <CodeBlock
                code={`import { GradFlow } from 'gradflow'

<GradFlow
  config={{
    color1: { r: 210, g: 21, b: 112 },
    color2: { r: 140, g: 63, b: 248 },
    color3: { r: 86, g: 255, b: 195 },
    speed: 0.5,
    scale: 1.2,
    type: 'aurora',
    noise: 0.32,
  }}
/>

// hex strings work too: color1: '#d21570'`}
              />
            </div>

            <div className='space-y-3'>
              <div className='space-y-1'>
                <h3 className='text-xl font-semibold tracking-tight'>
                  Using Presets
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Choose from 10 built-in gradient presets
                </p>
              </div>
              <CodeBlock
                code={`import { GradFlow } from 'gradflow'

<GradFlow preset='cosmic' />

// Available presets:
// cosmic, matrix, electric, inferno, mystic,
// cyber, neon, plasma, dream, borealis`}
              />
            </div>

            <div className='space-y-3'>
              <div className='space-y-1'>
                <h3 className='text-xl font-semibold tracking-tight'>
                  Random Gradients
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Generate random colors for unique gradients
                </p>
              </div>
              <CodeBlock
                code={`import { GradFlow, generateRandomColors } from 'gradflow'

const [colors, setColors] = useState(generateRandomColors())

<GradFlow config={colors} />
<button onClick={() => setColors(generateRandomColors())}>
  Randomize
</button>`}
              />
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className='space-y-6'>
          <div className='space-y-3'>
            <span className='block text-xs font-semibold uppercase tracking-[0.2em] text-primary/80'>
              API Reference
            </span>
            <h2 className='text-4xl font-bold tracking-tight'>Configuration</h2>
            <p className='text-muted-foreground text-base leading-relaxed'>
              All available configuration options for the GradFlow component
            </p>
          </div>

          <div className='rounded-xl border border-border overflow-hidden shadow-sm'>
            <table className='w-full text-sm'>
              <thead className='bg-muted/60'>
                <tr className='border-b border-border'>
                  <th className='text-left p-4 font-semibold text-foreground text-xs uppercase tracking-wide'>
                    Property
                  </th>
                  <th className='text-left p-4 font-semibold text-foreground text-xs uppercase tracking-wide'>
                    Type
                  </th>
                  <th className='text-left p-4 font-semibold text-foreground text-xs uppercase tracking-wide'>
                    Default
                  </th>
                  <th className='text-left p-4 font-semibold text-foreground text-xs uppercase tracking-wide'>
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                <tr className='hover:bg-muted/30 transition-colors'>
                  <td className='p-4'>
                    <code className='text-blue-400 font-mono'>color1</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    <code className='text-xs'>string | RGB</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    <code className='text-xs'>{'{r:210,g:21,b:112}'}</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    First gradient color (hex or RGB)
                  </td>
                </tr>
                <tr className='hover:bg-muted/30 transition-colors'>
                  <td className='p-4'>
                    <code className='text-blue-400 font-mono'>color2</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    <code className='text-xs'>string | RGB</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    <code className='text-xs'>{'{r:140,g:63,b:248}'}</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    Second gradient color (hex or RGB)
                  </td>
                </tr>
                <tr className='hover:bg-muted/30 transition-colors'>
                  <td className='p-4'>
                    <code className='text-blue-400 font-mono'>color3</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    <code className='text-xs'>string | RGB</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    <code className='text-xs'>{'{r:86,g:255,b:195}'}</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    Third gradient color (hex or RGB)
                  </td>
                </tr>
                <tr className='hover:bg-muted/30 transition-colors'>
                  <td className='p-4'>
                    <code className='text-blue-400 font-mono'>speed</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    <code className='text-xs'>number</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    <code className='text-xs'>0.5</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    Animation speed (0.1 - 3.0)
                  </td>
                </tr>
                <tr className='hover:bg-muted/30 transition-colors'>
                  <td className='p-4'>
                    <code className='text-blue-400 font-mono'>scale</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    <code className='text-xs'>number</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    <code className='text-xs'>1.2</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    Pattern scale (0.5 - 3.0)
                  </td>
                </tr>
                <tr className='hover:bg-muted/30 transition-colors'>
                  <td className='p-4'>
                    <code className='text-blue-400 font-mono'>type</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    <code className='text-xs'>string</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    <code className='text-xs'>&apos;aurora&apos;</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    Gradient pattern type
                    <div className='flex flex-wrap gap-1.5 mt-2'>
                      {[
                        'linear',
                        'animated',
                        'conic',
                        'wave',
                        'silk',
                        'smoke',
                        'stripe',
                        'mesh',
                        'aurora',
                      ].map((t) => (
                        <span
                          key={t}
                          className='inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-foreground/80 border border-border'
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr className='hover:bg-muted/30 transition-colors'>
                  <td className='p-4'>
                    <code className='text-blue-400 font-mono'>noise</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    <code className='text-xs'>number</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    <code className='text-xs'>0.32</code>
                  </td>
                  <td className='p-4 text-muted-foreground'>
                    Noise intensity (0 - 0.5)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Download Stat */}
        <Link
          href='https://www.npmjs.com/package/gradflow'
          target='_blank'
          className='group relative block overflow-hidden rounded-3xl px-8 py-12 text-center'
        >
          <div className='pointer-events-none absolute inset-0 -z-10'>
            <GradFlow
              config={{
                color1: { r: 14, g: 82, b: 255 },
                color2: { r: 130, g: 220, b: 255 },
                color3: { r: 255, g: 255, b: 255 },
                speed: 0.4,
                scale: 0.5,
                type: 'silk',
                noise: 0,
              }}
            />
            <div className='absolute inset-0' />
          </div>

          <div className='relative flex flex-col items-center gap-3'>
            <span className='flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl'>
              <TrendingUp className='h-5 w-5' />
            </span>
            <p className='text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-sm'>
              2.5k+
            </p>
            <p className='text-sm font-medium uppercase tracking-[0.2em] text-white'>
              Weekly Downloads on npm
            </p>
            <span className='mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-xl transition-colors group-hover:bg-white/20 group-hover:text-white'>
              <Download className='h-3 w-3' />
              npm install gradflow
            </span>
          </div>
        </Link>

        {/* Footer */}
        <div className='flex w-full items-center justify-between gap-2 pt-8 border-t border-border'>
          <Link href='https://www.meera.dev/' target='_blank'>
            <Image
              src='https://www.meera.dev/logo.svg'
              width={32}
              height={32}
              alt='Meera Dev Logo'
              className='w-8 h-8 opacity-70 hover:opacity-100 transition-opacity invert dark:invert-0'
            />
          </Link>

          <Link target='_blank' href='https://github.com/meerbahadin/gradflow'>
            <Button
              variant='secondary'
              size='sm'
              className='cursor-pointer gap-2'
            >
              <Code className='w-4 h-4' />
              View on GitHub
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
