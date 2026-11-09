'use client'

import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'

import { Flow } from '@/components/showcase/flow/flow'
import { Button } from '@/components/arc/button/button'
import { Input } from '@/components/arc/input/input'

/**
 * A sign-in card with a living planet (the `core` shader) rising behind the form. Every
 * keystroke stirs the orb; once the email and password are valid it turns
 * from violet to green; signing in spins it up, then it settles on a welcome.
 * Pressing Sign in with the form empty types a demo login in for you, then
 * signs in on its own.
 */

const IDLE = { color1: '#6a4dff', color2: '#1b1450', color3: '#f0b8ff' }
const READY = { color1: '#1fbf86', color2: '#06281c', color3: '#c8ffe6' }
const DEMO = { email: 'mira@studio.com', password: 'gradients' }

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [energy, setEnergy] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [filling, setFilling] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // each keystroke adds energy; it drains away on its own
  useEffect(() => {
    if (energy <= 0.01) return
    const id = setTimeout(() => setEnergy((e) => Math.max(0, e * 0.82 - 0.02)), 90)
    return () => clearTimeout(id)
  }, [energy])
  const stir = () => setEnergy((e) => Math.min(1, e + 0.35))

  const ready = /\S+@\S+\.\S+/.test(email) && password.length >= 8
  const palette = status === 'done' || ready ? READY : IDLE
  const speed = status === 'loading' ? 3.2 : 0.5 + energy * 2.4

  const signIn = () => {
    setStatus('loading')
    later(() => setStatus('done'), 1600)
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    signIn()
  }

  // types the demo login in quickly, a key at a time (each one stirs the orb), then signs in
  const autofill = () => {
    setFilling(true)
    const steps: (() => void)[] = []
    const typeInto = (name: string, value: string, set: (v: string) => void) => {
      steps.push(() => root.current?.querySelector<HTMLInputElement>(`input[name=${name}]`)?.focus({ preventScroll: true }))
      for (let i = 1; i <= value.length; i++)
        steps.push(() => {
          set(value.slice(0, i))
          stir()
        })
    }
    typeInto('email', DEMO.email, setEmail)
    typeInto('password', DEMO.password, setPassword)
    let at = 0
    for (const step of steps) {
      at += 24 + Math.random() * 30
      later(step, at)
    }
    later(() => {
      ;(document.activeElement as HTMLElement | null)?.blur()
      setFilling(false)
      signIn()
    }, at + 260)
  }

  return (
    <div ref={root} className='on-gradient relative isolate flex h-full min-h-[560px] items-center justify-center overflow-hidden bg-[#07060f] px-6 py-12'>
      {/* a planet rising from the bottom edge: only its lit arc and halo show, behind the form */}
      <div
        className='pointer-events-none absolute left-1/2 -z-10 size-[900px] transition-transform duration-700'
        style={{
          top: 'calc(100% - 300px)',
          transform: `translateX(-50%) translateY(${status === 'done' ? -40 : status === 'loading' ? -20 : -energy * 14}px)`,
          maskImage: 'radial-gradient(closest-side, #000 64%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(closest-side, #000 64%, transparent 100%)',
        }}
      >
        <Flow config={{ type: 'core', ...palette, speed, scale: 1, noise: 0.04 }} transition={700} />
      </div>

      <div className='w-full max-w-sm rounded-(--radius-panel) border border-border bg-black/45 p-7 backdrop-blur-2xl'>
        {status === 'done' ? (
          <div className='grid justify-items-start gap-4'>
            <span className='grid size-11 place-items-center rounded-full bg-[#1fbf86] text-black'>
              <Check className='size-5' />
            </span>
            <div>
              <h3 className='text-2xl font-medium leading-tight'>Welcome back</h3>
              <p className='mt-1.5 text-sm text-subtle'>Signed in as {email || 'you'}.</p>
            </div>
            <Button
              variant='secondary'
              onClick={() => {
                setStatus('idle')
                setPassword('')
              }}
            >
              Sign out
            </Button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h3 className='text-2xl font-medium leading-tight'>Welcome back</h3>
            <p className='mt-1.5 text-sm text-subtle'>{ready ? 'All set. The orb agrees.' : 'Type to wake the orb.'}</p>

            <div className='mt-7 grid gap-4'>
              <Input
                label='Email'
                type='email'
                name='email'
                placeholder='you@studio.com'
                autoComplete='email'
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  stir()
                }}
              />
              <Input
                label='Password'
                type='password'
                name='password'
                placeholder='At least 8 characters'
                autoComplete='current-password'
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  stir()
                }}
              />
            </div>

            <Button
              type='submit'
              size='lg'
              loading={status === 'loading'}
              className='mt-6 w-full'
              onClick={(event) => {
                // a valid form submits as usual; otherwise fill it in first
                if (ready) return
                event.preventDefault()
                if (!filling) autofill()
              }}
            >
              Sign in
            </Button>

            <p className='mt-5 text-center text-sm text-subtle'>
              New here?{' '}
              <a href='#' className='text-foreground underline underline-offset-4'>
                Create an account
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
