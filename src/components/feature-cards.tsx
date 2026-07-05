'use client'

import { useRef } from 'react'
import { Palette, Sparkles, Zap } from 'lucide-react'

const cardData = [
  {
    icon: Zap,
    title: 'High Performance',
    subtitle:
      'Hardware-accelerated WebGL rendering with optimized shaders for smooth 60fps animations',
    iconBg: 'bg-blue-500/10 text-blue-400',
    glowColor: '59, 130, 246',
  },
  {
    icon: Palette,
    title: 'Fully Customizable',
    subtitle:
      '9 gradient types with real-time color, speed, scale, and noise controls',
    iconBg: 'bg-purple-500/10 text-purple-400',
    glowColor: '168, 85, 247',
  },
  {
    icon: Sparkles,
    title: 'Easy Integration',
    subtitle:
      'Drop-in React component with TypeScript support and zero configuration',
    iconBg: 'bg-green-500/10 text-green-400',
    glowColor: '34, 197, 94',
  },
]

export default function FeatureCards() {
  const cardsRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const cards = cardsRef.current?.getElementsByClassName('card')
    if (!cards) return

    for (const card of cards) {
      const htmlCard = card as HTMLElement
      const rect = htmlCard.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      htmlCard.style.setProperty('--mouse-x', `${x}px`)
      htmlCard.style.setProperty('--mouse-y', `${y}px`)
    }
  }

  return (
    <section className='py-16 space-y-8 container max-w-5xl mx-auto px-4'>
      <div className='text-center space-y-3'>
        <h2 className='text-3xl md:text-4xl text-balance font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-transparent'>
          WebGL-Powered Gradient Backgrounds
        </h2>
        <p className='text-muted-foreground text-base md:text-lg'>
          High-performance, fully customizable animated gradients for modern web
          applications
        </p>
      </div>
      <div
        ref={cardsRef}
        className='cards-container grid grid-cols-1 md:grid-cols-3 gap-4 group'
        onMouseMove={handleMouseMove}
      >
        {cardData.map((card, index) => (
          <div
            key={index}
            className='card bg-foreground/10 rounded-xl cursor-pointer flex min-h-60 flex-col relative'
            style={{
              ['--glow-color' as string]: card.glowColor,
            }}
          >
            <div className='card-content bg-card rounded-xl flex flex-col flex-grow absolute inset-[1px] p-6 z-[2]'>
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-lg ${card.iconBg} mb-4`}
              >
                <card.icon size={24} />
              </div>
              <div className='flex flex-col gap-3 flex-grow'>
                <h3 className='text-xl text-card-foreground font-semibold'>
                  {card.title}
                </h3>
                <p className='text-card-foreground/60 text-sm leading-relaxed'>
                  {card.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
