'use client'

import { useEffect, useRef, useState } from 'react'

import { Flow } from '@/components/showcase/flow/flow'
import { Button } from '@/components/arc/button/button'

/**
 * A wide call to action on a stream of light (the `current` shader). Every
 * keystroke pushes the stream faster, a valid address warms it, and joining
 * makes it rush and then settle green with your place in line. Pressing the
 * button with no address types a demo one in for you, then joins on its own.
 */

const AHEAD = 2481
const DEMO = 'ada@studio.com'

const PALETTE = {
  idle: { color1: '#3a62ff', color2: '#04081e', color3: '#3cdcc8' },
  valid: { color1: '#ffb36b', color2: '#0d0716', color3: '#ff6fb0' },
  joined: { color1: '#2fd08a', color2: '#03140d', color3: '#c8ffe6' },
}

export default function Waitlist() {
  const [email, setEmail] = useState('')
  const [energy, setEnergy] = useState(0)
  const [state, setState] = useState<'open' | 'surge' | 'joined'>('open')
  const [filling, setFilling] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  useEffect(() => {
    if (energy <= 0.01) return
    const id = setTimeout(() => setEnergy((e) => Math.max(0, e * 0.8 - 0.02)), 90)
    return () => clearTimeout(id)
  }, [energy])

  const valid = /\S+@\S+\.\S+/.test(email)

  const join = () => {
    setState('surge')
    later(() => setState('joined'), 1200)
  }

  // types the demo address in quickly, a key at a time (each one pulses the stream), then joins
  const autofill = () => {
    setFilling(true)
    input.current?.focus({ preventScroll: true })
    let at = 0
    for (let i = 1; i <= DEMO.length; i++) {
      at += 24 + Math.random() * 30
      later(() => {
        setEmail(DEMO.slice(0, i))
        setEnergy((x) => Math.min(1, x + 0.4))
      }, at)
    }
    later(() => {
      input.current?.blur()
      setFilling(false)
      join()
    }, at + 260)
  }
  const palette = state === 'open' ? (valid ? PALETTE.valid : PALETTE.idle) : PALETTE.joined
  const speed = state === 'surge' ? 2.4 : state === 'joined' ? 0.4 : 0.4 + energy * 1.6

  return (
    <div className='on-gradient relative isolate overflow-hidden bg-black px-7 py-16 sm:px-12 sm:py-24'>
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <Flow
          config={{ type: 'current', ...palette, speed, scale: 0.45, noise: 0.06 }}
          transition={state === 'open' ? 260 : 900}
          quality={0.6}
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-black/25' />
      </div>

      <div className='mx-auto flex max-w-xl flex-col items-center text-center'>
        <h3 className='text-balance text-4xl font-medium leading-[1.02] sm:text-5xl'>
          {state === 'joined' ? 'You’re on the list.' : 'Be first through the door.'}
        </h3>
        <p className='mt-4 text-pretty text-subtle'>
          {state === 'joined'
            ? `You’re number ${(AHEAD + 1).toLocaleString('en-US')}. One email when we open, nothing after that.`
            : `${AHEAD.toLocaleString('en-US')} people are already waiting. Type your email and watch the sky.`}
        </p>

        {state === 'joined' ? (
          <Button
            variant='secondary'
            className='mt-8'
            onClick={() => {
              setState('open')
              setEmail('')
            }}
          >
            Use another email
          </Button>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              join()
            }}
            className='mt-8 flex w-full max-w-md items-center gap-2 rounded-(--radius-control) border border-border bg-black/40 p-1.5 pl-4 backdrop-blur-2xl'
          >
            <input
              ref={input}
              type='email'
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEnergy((x) => Math.min(1, x + 0.4))
              }}
              disabled={state === 'surge'}
              placeholder='you@studio.com'
              aria-label='Email address'
              className='min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground disabled:opacity-60'
            />
            <Button
              type='submit'
              size='sm'
              loading={state === 'surge'}
              onClick={(event) => {
                // a valid address submits as usual; otherwise type one in first
                if (valid) return
                event.preventDefault()
                if (!filling) autofill()
              }}
            >
              Join the waitlist
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
