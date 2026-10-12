import { Accessibility, AppWindow, EyeOff, RotateCcw } from 'lucide-react'

import { cn } from '@/lib/utils'
import SectionHeading from '@/components/site/section-heading'
import { MorphDemo, PaletteStrip, PointerDemo } from './feature-demos'

const card =
  'relative isolate overflow-hidden rounded-(--radius-surface) border border-border bg-surface'

const IDLE_STATES = [
  { icon: EyeOff, when: 'Scrolled out of view', then: 'Paused' },
  { icon: AppWindow, when: 'Tab in the background', then: 'Paused' },
  { icon: Accessibility, when: 'Reduced motion requested', then: 'Still frame' },
  { icon: RotateCcw, when: 'WebGL context lost', then: 'Restored' },
]

function CardCopy({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <h3 className='text-xl font-medium leading-tight'>{title}</h3>
      <p className='mt-2 max-w-sm text-pretty text-sm leading-relaxed text-subtle'>
        {children}
      </p>
    </div>
  )
}

export default function Features() {
  return (
    <section className='container py-24 sm:py-32'>
      <SectionHeading eyebrow='What is new' title='Rebuilt from the triangle up.'>
        The renderer was rewritten for this release. It is smaller, it
        survives things the old one did not, and it learned a few tricks.
      </SectionHeading>

      <div className='mt-12 grid gap-3 lg:grid-cols-12'>
        <div className={cn(card, 'on-gradient flex min-h-[420px] flex-col justify-end p-7 lg:col-span-7')}>
          <MorphDemo />
          <CardCopy title='It morphs. It never cuts.'>
            Change the type, the colors or the speed and the canvas blends
            there over a noise front, at whatever duration you set.
          </CardCopy>
        </div>

        <div className={cn(card, 'on-gradient flex min-h-[420px] flex-col justify-end p-7 lg:col-span-5')}>
          <PointerDemo />
          <CardCopy title='It follows the pointer.'>
            Set <code className='font-mono text-[13px]'>interactive</code> and
            the pattern swells under the cursor. Try it on this card.
          </CardCopy>
        </div>

        <div className={cn(card, 'flex flex-col justify-between gap-10 p-7 lg:col-span-4')}>
          <p className='font-heading text-[7rem] font-medium leading-[0.8] tracking-[-0.06em]'>
            0
          </p>
          <CardCopy title='Dependencies.'>
            Raw WebGL: one fragment shader and one triangle, 11 kB gzipped.
            The rendering library the last version shipped with is gone.
          </CardCopy>
        </div>

        <div className={cn(card, 'flex flex-col justify-between gap-8 p-7 lg:col-span-4')}>
          <ul className='divide-y divide-hairline'>
            {IDLE_STATES.map(({ icon: Icon, when, then }) => (
              <li key={when} className='flex items-center gap-3 py-2.5 text-sm first:pt-0'>
                <Icon className='size-4 shrink-0 text-muted-foreground' />
                <span className='flex-1 text-subtle'>{when}</span>
                <span className='font-mono text-xs'>{then}</span>
              </li>
            ))}
          </ul>
          <CardCopy title='Asleep when unseen.'>
            The render loop only runs while someone can see it. No props, no
            observers to wire up.
          </CardCopy>
        </div>

        <div className={cn(card, 'flex flex-col justify-between gap-8 p-7 lg:col-span-4')}>
          <PaletteStrip />
          <CardCopy title='Three colors in.'>
            Every shader reads the same three colors, as hex strings or RGB
            objects, so a palette carries across all twenty.
          </CardCopy>
        </div>
      </div>
    </section>
  )
}
