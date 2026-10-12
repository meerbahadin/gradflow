import { ArrowUpRight } from 'lucide-react'

import Pricing from '@/components/blocks/pricing'
import SignIn from '@/components/blocks/sign-in'
import ButtonLink from '@/components/site/button-link'
import SectionHeading from '@/components/site/section-heading'

const frame = 'overflow-hidden rounded-(--radius-surface) border border-border'

export default function Showcase() {
  return (
    <section className='container py-24 sm:py-32'>
      <div className='flex flex-col justify-between gap-8 md:flex-row md:items-end'>
        <SectionHeading eyebrow='In an interface' title='Behind real UI, not just a hero.'>
          A gradient earns its place when there is something on top of it.
          These are working components, and their source is one click away.
        </SectionHeading>
        <ButtonLink href='/demo' variant='secondary'>
          See all five
          <ArrowUpRight className='size-4' />
        </ButtonLink>
      </div>

      <div className='mt-12 grid gap-3 lg:grid-cols-12'>
        <div className={`${frame} lg:col-span-7`}>
          <SignIn />
        </div>
        <div className={`${frame} lg:col-span-5`}>
          <Pricing />
        </div>
      </div>
    </section>
  )
}
