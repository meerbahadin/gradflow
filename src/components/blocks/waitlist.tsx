'use client'

import { useState } from 'react'

import GradFlow from '@/components/grad-flow'
import { Button } from '@/components/arc/button/button'

/** A wide call to action: one field, one button, and a gradient that follows the pointer. */
export default function Waitlist() {
  const [joined, setJoined] = useState(false)

  return (
    <div className='on-gradient relative isolate overflow-hidden bg-black px-7 py-14 sm:px-12 sm:py-20'>
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <GradFlow preset='andromeda' interactive />
        <div className='absolute inset-0 bg-black/25' />
      </div>

      <div className='mx-auto flex max-w-xl flex-col items-center text-center'>
        <h3 className='text-balance text-3xl font-medium leading-[1.05] sm:text-4xl'>
          Be first through the door.
        </h3>
        <p className='mt-4 text-pretty text-subtle'>
          One email when we open, and nothing after that unless you ask.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            setJoined(true)
          }}
          className='mt-8 flex w-full max-w-md items-center gap-2 rounded-(--radius-control) border border-border bg-black/30 p-1.5 pl-4 backdrop-blur-2xl'
        >
          <input
            type='email'
            required
            disabled={joined}
            placeholder='you@studio.com'
            aria-label='Email address'
            className='min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground disabled:opacity-60'
          />
          <Button type='submit' size='sm' disabled={joined}>
            {joined ? 'You are on the list' : 'Join the waitlist'}
          </Button>
        </form>
      </div>
    </div>
  )
}
