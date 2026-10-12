'use client'

import { useState } from 'react'

import GradFlow from '@/components/grad-flow'
import { Button } from '@/components/arc/button/button'
import { Input } from '@/components/arc/input/input'

/** A sign-in card on a pale gradient that fades to white behind the form. */
export default function SignIn() {
  const [loading, setLoading] = useState(false)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 1600)
  }

  return (
    <div className='on-light relative isolate flex h-full min-h-[560px] items-center justify-center overflow-hidden bg-white p-6'>
      <div className='pointer-events-none absolute inset-0 -z-10 mask-b-to-90%'>
        <GradFlow
          config={{
            type: 'smoke',
            color1: '#0e52ff',
            color2: '#82dcff',
            color3: '#ffffff',
            speed: 0.4,
            scale: 2,
            noise: 0.16,
          }}
        />
      </div>

      <form
        onSubmit={submit}
        className='w-full max-w-sm rounded-(--radius-panel) border border-border bg-white/70 p-7 shadow-(--shadow-floating) backdrop-blur-2xl'
      >
        <h3 className='text-2xl font-medium leading-tight'>Welcome back</h3>
        <p className='mt-1.5 text-sm text-subtle'>
          Sign in to pick up where you left off.
        </p>

        <div className='mt-7 grid gap-4'>
          <Input
            label='Email'
            type='email'
            name='email'
            placeholder='you@studio.com'
            autoComplete='email'
            required
          />
          <Input
            label='Password'
            type='password'
            name='password'
            placeholder='At least 8 characters'
            autoComplete='current-password'
            required
          />
        </div>

        <Button type='submit' size='lg' loading={loading} className='mt-6 w-full'>
          Sign in
        </Button>

        <p className='mt-5 text-center text-sm text-subtle'>
          New here?{' '}
          <a href='#' className='text-foreground underline underline-offset-4'>
            Create an account
          </a>
        </p>
      </form>
    </div>
  )
}
