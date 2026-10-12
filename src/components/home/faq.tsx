import { Accordion } from '@/components/arc/accordion/accordion'
import SectionHeading from '@/components/site/section-heading'

const QUESTIONS = [
  {
    title: 'Does it work with Next.js and server components?',
    content:
      'Yes. GradFlow is marked as a client component, so you can import it straight into a server component. It renders an empty canvas on the server and starts drawing once it mounts.',
  },
  {
    title: 'How heavy is it at runtime?',
    content:
      'Each gradient is a single full-screen triangle and one fragment shader, capped at twice the device pixel ratio. The loop stops whenever the canvas is off screen or the tab is hidden, so a gradient nobody is looking at costs nothing.',
  },
  {
    title: 'How many can I put on one page?',
    content:
      'Every GradFlow owns a WebGL context, and browsers allow roughly sixteen per page before they start dropping the oldest. A handful is fine. For a grid of dozens, render them from one shared context, which is how the collection on this page works.',
  },
  {
    title: 'What happens for people who prefer reduced motion?',
    content:
      'They get a single still frame of the same gradient. Nothing animates, and the pointer effect is switched off. You can force the same behaviour yourself with the paused prop.',
  },
  {
    title: 'Can I export a still image?',
    content:
      'Yes. GradFlow forwards its ref to the canvas, so with preserveDrawingBuffer set you can call toBlob or toDataURL on it at any time. The playground does exactly that.',
  },
  {
    title: 'Can I write my own shader?',
    content:
      'Not through the public API yet. The twenty built-in types cover a wide range, and each responds to scale, speed, noise and your three colors.',
  },
]

export default function Faq() {
  return (
    <section className='container grid gap-12 py-24 sm:py-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16'>
      <SectionHeading eyebrow='Questions' title='Things people ask first.' />
      <div className='min-w-0'>
        <Accordion items={QUESTIONS} size='lg' />
      </div>
    </section>
  )
}
