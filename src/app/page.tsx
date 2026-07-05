import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import CodeBlock from '@/components/code/code-block'
import GradFlowDemo from '@/components/grad-flow-demo'

import { Code, Download } from 'lucide-react'
import FeatureCards from '@/components/feature-cards'

export default function Home() {
  return (
    <main className='relative'>
      <GradFlowDemo />

      <FeatureCards />

      {/* Installation Section */}
      <section
        id='installation'
        className='container max-w-4xl py-16 space-y-16'
      >
        <div className='space-y-8'>
          <div className='space-y-3'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center'>
                <Download className='w-4 h-4 text-blue-400' />
              </div>
              <h2 className='text-3xl font-bold'>Installation</h2>
            </div>
            <p className='text-zinc-400 text-base leading-relaxed'>
              Get started in seconds. Install the package via npm.
            </p>
          </div>

          <div className='space-y-6'>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <span className='text-sm font-mono text-zinc-500'>01</span>
                <h3 className='text-xl font-semibold'>Install Package</h3>
              </div>
              <CodeBlock code={`npm install gradflow`} lang='bash' />
            </div>

            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <span className='text-sm font-mono text-zinc-500'>02</span>
                <h3 className='text-xl font-semibold'>Import & Use</h3>
              </div>
              <p className='text-sm text-zinc-400'>
                Import the component and start using it right away
              </p>
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
            <h2 className='text-3xl font-bold'>Usage Examples</h2>
            <p className='text-zinc-400 text-base leading-relaxed'>
              Customize colors, animation speed, scale, and noise settings to
              create unique gradient backgrounds.
            </p>
          </div>

          <div className='space-y-6'>
            <div className='space-y-3'>
              <h3 className='text-xl font-semibold'>With Custom Colors</h3>
              <p className='text-sm text-zinc-400'>
                Use RGB objects or hex strings
              </p>
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
              <h3 className='text-xl font-semibold'>Using Presets</h3>
              <p className='text-sm text-zinc-400'>
                Choose from 10 built-in gradient presets
              </p>
              <CodeBlock
                code={`import { GradFlow } from 'gradflow'

<GradFlow preset='cosmic' />

// Available presets:
// cosmic, matrix, electric, inferno, mystic,
// cyber, neon, plasma, dream, borealis`}
              />
            </div>

            <div className='space-y-3'>
              <h3 className='text-xl font-semibold'>Random Gradients</h3>
              <p className='text-sm text-zinc-400'>
                Generate random colors for unique gradients
              </p>
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
            <h2 className='text-3xl font-bold'>Configuration</h2>
            <p className='text-zinc-400 text-base leading-relaxed'>
              All available configuration options for the GradFlow component
            </p>
          </div>

          <div className='rounded-xl border border-zinc-800 overflow-hidden'>
            <table className='w-full text-sm'>
              <thead className='bg-zinc-900/50'>
                <tr className='border-b border-zinc-800'>
                  <th className='text-left p-4 font-semibold text-zinc-200'>
                    Property
                  </th>
                  <th className='text-left p-4 font-semibold text-zinc-200'>
                    Type
                  </th>
                  <th className='text-left p-4 font-semibold text-zinc-200'>
                    Default
                  </th>
                  <th className='text-left p-4 font-semibold text-zinc-200'>
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-zinc-800'>
                <tr className='hover:bg-zinc-900/30 transition-colors'>
                  <td className='p-4'>
                    <code className='text-blue-400 font-mono'>color1</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    <code className='text-xs'>string | RGB</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    <code className='text-xs'>{'{r:210,g:21,b:112}'}</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    First gradient color (hex or RGB)
                  </td>
                </tr>
                <tr className='hover:bg-zinc-900/30 transition-colors'>
                  <td className='p-4'>
                    <code className='text-blue-400 font-mono'>color2</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    <code className='text-xs'>string | RGB</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    <code className='text-xs'>{'{r:140,g:63,b:248}'}</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    Second gradient color (hex or RGB)
                  </td>
                </tr>
                <tr className='hover:bg-zinc-900/30 transition-colors'>
                  <td className='p-4'>
                    <code className='text-blue-400 font-mono'>color3</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    <code className='text-xs'>string | RGB</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    <code className='text-xs'>{'{r:86,g:255,b:195}'}</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    Third gradient color (hex or RGB)
                  </td>
                </tr>
                <tr className='hover:bg-zinc-900/30 transition-colors'>
                  <td className='p-4'>
                    <code className='text-blue-400 font-mono'>speed</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    <code className='text-xs'>number</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    <code className='text-xs'>0.5</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    Animation speed (0.1 - 3.0)
                  </td>
                </tr>
                <tr className='hover:bg-zinc-900/30 transition-colors'>
                  <td className='p-4'>
                    <code className='text-blue-400 font-mono'>scale</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    <code className='text-xs'>number</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    <code className='text-xs'>1.2</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    Pattern scale (0.5 - 3.0)
                  </td>
                </tr>
                <tr className='hover:bg-zinc-900/30 transition-colors'>
                  <td className='p-4'>
                    <code className='text-blue-400 font-mono'>type</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    <code className='text-xs'>string</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    <code className='text-xs'>&apos;aurora&apos;</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
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
                          className='inline-flex items-center px-2 py-0.5 rounded text-xs bg-zinc-800/50 text-zinc-300 border border-zinc-700/50'
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr className='hover:bg-zinc-900/30 transition-colors'>
                  <td className='p-4'>
                    <code className='text-blue-400 font-mono'>noise</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    <code className='text-xs'>number</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    <code className='text-xs'>0.32</code>
                  </td>
                  <td className='p-4 text-zinc-400'>
                    Noise intensity (0 - 0.5)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className='flex w-full items-center justify-between gap-2 pt-8 border-t border-zinc-800'>
          <Link href='https://www.meera.dev/' target='_blank'>
            <Image
              src='https://www.meera.dev/logo.svg'
              width={32}
              height={32}
              alt='Meera Dev Logo'
              className='w-8 h-8 opacity-70 hover:opacity-100 transition-opacity'
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
