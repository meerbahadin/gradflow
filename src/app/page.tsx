import Collection from '@/components/home/collection'
import Faq from '@/components/home/faq'
import Features from '@/components/home/features'
import Hero from '@/components/home/hero'
import QuickStart from '@/components/home/quick-start'
import Showcase from '@/components/home/showcase'

export default function Home() {
  return (
    <main>
      <Hero />
      <Collection />
      <Features />
      <QuickStart />
      <Showcase />
      <Faq />
    </main>
  )
}
