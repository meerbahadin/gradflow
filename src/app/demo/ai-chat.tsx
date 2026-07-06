'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Send,
  Square,
  X,
  Sparkles,
  SquarePen,
  Copy,
  Check,
  ArrowDown,
  Plane,
  Hotel,
  Utensils,
  Compass,
  Wallet,
  Sun,
  Paperclip,
  Palette,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import GradFlow from '@/components/grad-flow'
import type { GradientType } from '@/types/gradient'

const GRADIENT_TYPES: GradientType[] = [
  'linear',
  'animated',
  'conic',
  'wave',
  'silk',
  'smoke',
  'stripe',
  'mesh',
  'aurora',
]

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  image?: string
  followups?: string[]
}

type Suggestion = { icon: React.ElementType; label: string; text: string }

const SUGGESTIONS: Suggestion[] = [
  {
    icon: Compass,
    label: 'Itinerary',
    text: 'Plan a 5-day itinerary for Lisbon',
  },
  {
    icon: Hotel,
    label: 'Stays',
    text: 'Find boutique hotels near the coast under $200/night',
  },
  {
    icon: Utensils,
    label: 'Food',
    text: 'Recommend local restaurants for authentic food',
  },
]

const FAKE_REPLY = `Here's a quick plan to get you started:

- **Day 1-2**: Explore the old town, Alfama, and São Jorge Castle
- **Day 3**: Day trip to Sintra for the palaces and coastline
- **Day 4-5**: Belém, local food markets, and a sunset river cruise

Estimated budget: around **$650** per person for flights, stays, and food.

Want me to adjust this for a longer trip or a tighter budget?`

const FAKE_FOLLOWUPS = [
  'Make it a 7-day trip',
  'Suggest a lower budget option',
  'Add more outdoor activities',
]

let idCounter = 0
const nextId = () => `msg-${++idCounter}-${Date.now()}`

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const copy = useCallback(() => {
    navigator.clipboard?.writeText(content).then(() => {
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1500)
    })
  }, [content])

  return (
    <button
      onClick={copy}
      className='flex h-7 w-7 items-center justify-center rounded-md text-black/50 opacity-0 transition-all hover:bg-black/10 hover:text-black focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 group-hover:opacity-100'
      aria-label={copied ? 'Copied' : 'Copy message'}
    >
      {copied ? (
        <Check className='h-3.5 w-3.5 text-emerald-400' />
      ) : (
        <Copy className='h-3.5 w-3.5' />
      )}
    </button>
  )
}

function UserMessage({ content, image }: { content: string; image?: string }) {
  return (
    <div className='flex justify-end'>
      <div className='max-w-[85%] space-y-2'>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt='Attached'
            className='ml-auto block max-h-48 rounded-xl rounded-br-md object-cover shadow-sm'
          />
        )}
        {content && (
          <div className='whitespace-pre-wrap rounded-2xl rounded-br-md border border-black/10 bg-black/85 px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm backdrop-blur-xl'>
            {content}
          </div>
        )}
      </div>
    </div>
  )
}

function FollowupChips({
  questions,
  onSelect,
}: {
  questions: string[]
  onSelect: (q: string) => void
}) {
  const [chosen, setChosen] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className='mt-3 flex flex-wrap gap-2 px-1'
    >
      {questions.map((q) => {
        const isChosen = chosen === q
        const locked = chosen !== null
        return (
          <button
            key={q}
            disabled={locked}
            onClick={() => {
              setChosen(q)
              onSelect(q)
            }}
            className={`rounded-full border px-3 py-1.5 text-xs transition-all duration-200 ${
              isChosen
                ? 'border-black/30 bg-black/10 text-black'
                : locked
                  ? 'cursor-default border-black/10 bg-black/5 text-black/30'
                  : 'border-black/10 bg-white/40 text-black/60 hover:border-black/20 hover:bg-white/60 hover:text-black'
            }`}
          >
            {q}
          </button>
        )
      })}
    </motion.div>
  )
}

function AssistantMessage({
  message,
  isLast,
  isLoading,
  onFollowup,
}: {
  message: ChatMessage
  isLast: boolean
  isLoading: boolean
  onFollowup: (text: string) => void
}) {
  const showFollowups = isLast && !isLoading && !!message.followups?.length

  return (
    <div className='group flex flex-col'>
      <div className='whitespace-pre-wrap py-1 text-sm leading-relaxed text-black'>
        {message.content}
      </div>
      {message.content && (
        <div className='mt-0.5 flex h-7 items-center'>
          <CopyButton content={message.content} />
        </div>
      )}
      {showFollowups && (
        <FollowupChips questions={message.followups!} onSelect={onFollowup} />
      )}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div
      className='flex items-center gap-1.5 py-2'
      aria-label='Assistant is typing'
    >
      <span className='h-1.5 w-1.5 animate-bounce rounded-full bg-black/40 [animation-delay:0ms]' />
      <span className='h-1.5 w-1.5 animate-bounce rounded-full bg-black/40 [animation-delay:150ms]' />
      <span className='h-1.5 w-1.5 animate-bounce rounded-full bg-black/40 [animation-delay:300ms]' />
    </div>
  )
}

export function AiChat({
  onCloseAction,
}: {
  onCloseAction?: () => void
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [atBottom, setAtBottom] = useState(true)
  const [gradientType, setGradientType] = useState<GradientType>('smoke')
  const [image, setImage] = useState<{
    dataUrl: string
    mimeType: string
  } | null>(null)

  const cycleGradientType = useCallback(() => {
    setGradientType((prev) => {
      const idx = GRADIENT_TYPES.indexOf(prev)
      return GRADIENT_TYPES[(idx + 1) % GRADIENT_TYPES.length]
    })
  }, [])

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<{ aborted: boolean } | null>(null)
  const atBottomRef = useRef(true)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight
    setAtBottom(distance < 80)
  }, [])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior })
  }, [])

  useEffect(() => {
    if (atBottom) scrollToBottom('smooth')
  }, [messages, atBottom, scrollToBottom])

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  useEffect(() => {
    atBottomRef.current = atBottom
  }, [atBottom])

  const stop = useCallback(() => {
    if (abortRef.current) abortRef.current.aborted = true
    setIsLoading(false)
  }, [])

  const addMessage = useCallback(
    (role: ChatMessage['role'], content: string, image?: string) => {
      setMessages((prev) => [...prev, { id: nextId(), role, content, image }])
    },
    [],
  )

  // simulated streaming reply — UI-only demo, no backend
  const send = useCallback(
    (
      text: string,
      attachedImage?: { dataUrl: string; mimeType: string } | null,
    ) => {
      const trimmed = text.trim()
      const img = attachedImage ?? image
      if ((!trimmed && !img) || isLoading) return

      const token = { aborted: false }
      abortRef.current = token

      addMessage('user', trimmed, img?.dataUrl)
      setInput('')
      setImage(null)
      setIsLoading(true)
      setAtBottom(true)

      const assistantId = nextId()
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '' },
      ])

      let shown = 0
      const step = () => {
        if (token.aborted) return
        shown = Math.min(FAKE_REPLY.length, shown + 3)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: FAKE_REPLY.slice(0, shown) }
              : m,
          ),
        )
        if (atBottomRef.current) scrollToBottom('auto')

        if (shown < FAKE_REPLY.length) {
          setTimeout(step, 12)
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, followups: FAKE_FOLLOWUPS } : m,
            ),
          )
          setIsLoading(false)
          requestAnimationFrame(() => inputRef.current?.focus())
        }
      }
      setTimeout(step, 400)
    },
    [addMessage, image, isLoading, scrollToBottom],
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const hasMessages = messages.length > 0
  const lastMsgIdx = messages.length - 1
  const waitingForFirstToken =
    isLoading && messages[messages.length - 1]?.content === ''

  return (
    <div className='relative flex h-full w-full flex-col overflow-hidden '>
      {/* full-bleed animated GradFlow background, blended into black at the edges */}
      <div className='pointer-events-none absolute inset-0 z-0 mask-b-to-80%'>
        <GradFlow
          config={{
            color1: { r: 14, g: 82, b: 255 },
            color2: { r: 130, g: 220, b: 255 },
            color3: { r: 255, g: 255, b: 255 },
            speed: 0.4,
            scale: 2,
            type: gradientType,
            noise: 0.16,
          }}
        />
        <div className='absolute inset-0' />
        <div className='absolute inset-0 bg-white rounded-full blur-[100px] h-200 w-200 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
      </div>

      <header className='relative z-10 flex shrink-0 items-center justify-between px-6 py-4'>
        <div className='flex items-center gap-2.5 rounded-full border border-black/10 bg-white/40 py-1.5 pl-1.5 pr-4 backdrop-blur-xl'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-black text-white shadow-sm'>
            <Sparkles className='h-4 w-4' />
          </div>
          <div className='leading-tight'>
            <p className='text-sm font-semibold text-black'>AI Assistant</p>
            <div className='flex items-center gap-1.5'>
              <span className='relative flex h-1.5 w-1.5'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60' />
                <span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400' />
              </span>
              <p className='text-[11px] text-black/60'>Online · trip planner</p>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-1 rounded-full border border-black/10 bg-white/40 p-1 backdrop-blur-xl'>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 rounded-full text-black/70 hover:bg-black/10 hover:text-black'
            onClick={cycleGradientType}
            aria-label='Change background gradient style'
            title={`Gradient: ${gradientType}`}
          >
            <Palette className='h-4 w-4' />
          </Button>
          {hasMessages && (
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 rounded-full text-black/70 hover:bg-black/10 hover:text-black'
              onClick={() => {
                stop()
                setMessages([])
              }}
              aria-label='New chat'
              title='New chat'
            >
              <SquarePen className='h-4 w-4' />
            </Button>
          )}
          {onCloseAction && (
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 rounded-full text-black/70 hover:bg-black/10 hover:text-black'
              onClick={onCloseAction}
              aria-label='Close chat'
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </div>
      </header>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className='relative z-10 flex-1 overflow-y-auto scroll-smooth px-4 py-5'
      >
        <AnimatePresence mode='wait'>
          {!hasMessages ? (
            <motion.div
              key='empty'
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='relative flex h-full flex-col items-center justify-center gap-8 pb-4'
            >
              <div className='relative z-10 flex flex-col items-center gap-4 text-center'>
                <div className='relative flex h-16 w-16 items-center justify-center rounded-2xl border border-black/10 bg-white/50 text-black shadow-lg backdrop-blur-xl'>
                  <Sparkles className='h-8 w-8' />
                  <span className='absolute -right-1 -top-1 flex h-3.5 w-3.5'>
                    <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
                    <span className='relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500' />
                  </span>
                </div>
                <div className='space-y-1.5'>
                  <p className='text-xl font-semibold tracking-tight text-black'>
                    How can I help today?
                  </p>
                  <p className='max-w-sm text-balance text-sm text-black/60'>
                    Ask anything about destinations, itineraries, stays, and
                    local recommendations.
                  </p>
                </div>
              </div>

              <div className='relative z-10 flex flex-wrap justify-center gap-2'>
                {[
                  { icon: Plane, label: 'Flights' },
                  { icon: Hotel, label: 'Stays' },
                  { icon: Utensils, label: 'Food' },
                  { icon: Compass, label: 'Itinerary' },
                  { icon: Wallet, label: 'Budget' },
                  { icon: Sun, label: 'Weather' },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className='flex items-center gap-1.5 rounded-full border border-black/10 bg-white/40 px-3 py-1.5 text-xs font-medium text-black/70 backdrop-blur-xl'
                  >
                    <Icon className='h-3.5 w-3.5' />
                    {label}
                  </span>
                ))}
              </div>

              <div className='relative z-10 w-full max-w-sm space-y-2'>
                {SUGGESTIONS.map(({ icon: Icon, label, text }) => (
                  <button
                    key={text}
                    onClick={() => send(text)}
                    className='group flex w-full items-center gap-3 rounded-xl border border-black/10 bg-white/40 px-4 py-3 text-left backdrop-blur-xl transition-all hover:border-black/20 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20'
                  >
                    <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/10 text-black'>
                      <Icon className='h-3.5 w-3.5' />
                    </span>
                    <span className='min-w-0 flex-1 text-sm text-black/80 group-hover:text-black'>
                      {text}
                    </span>
                    <span className='sr-only'>{label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key='messages'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className='mx-auto flex max-w-3xl flex-col gap-6'
              role='log'
              aria-live='polite'
              aria-relevant='additions text'
            >
              {messages.map((m, idx) =>
                m.role === 'user' ? (
                  <UserMessage key={m.id} content={m.content} image={m.image} />
                ) : (
                  <AssistantMessage
                    key={m.id}
                    message={m}
                    isLast={idx === lastMsgIdx}
                    isLoading={isLoading}
                    onFollowup={send}
                  />
                ),
              )}
              {waitingForFirstToken && <TypingIndicator />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className='relative z-10 shrink-0 px-4 pb-4 pt-2'>
        <div className='relative mx-auto max-w-3xl'>
          <AnimatePresence>
            {hasMessages && !atBottom && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                onClick={() => {
                  setAtBottom(true)
                  scrollToBottom('smooth')
                }}
                className='absolute -top-12 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-black/70 shadow-md backdrop-blur-xl transition-colors hover:text-black'
                aria-label='Scroll to latest message'
              >
                <ArrowDown className='h-3.5 w-3.5' />
                Latest
              </motion.button>
            )}
          </AnimatePresence>

          <div className='rounded-2xl border border-black/10 bg-white/60 shadow-lg backdrop-blur-xl transition-colors focus-within:border-black/20 focus-within:ring-2 focus-within:ring-black/10'>
            {image && (
              <div className='relative w-fit px-3 pt-3'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.dataUrl}
                  alt='Attached'
                  className='h-20 rounded-lg object-cover'
                />
                <button
                  onClick={() => setImage(null)}
                  className='absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white shadow'
                  aria-label='Remove image'
                >
                  <X className='h-3 w-3' />
                </button>
              </div>
            )}
            <div className='flex items-end gap-2 p-2 pl-4'>
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={(e) => {
                  const item = Array.from(e.clipboardData.items).find((i) =>
                    i.type.startsWith('image/'),
                  )
                  if (!item) return
                  e.preventDefault()
                  const file = item.getAsFile()
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () =>
                    setImage({
                      dataUrl: reader.result as string,
                      mimeType: file.type,
                    })
                  reader.readAsDataURL(file)
                }}
                placeholder='Ask anything…'
                aria-label='Message'
                className='max-h-40 flex-1 resize-none self-center bg-transparent py-1.5 text-sm leading-5 text-black outline-none placeholder:text-black/40'
              />
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => {
                    setImage({
                      dataUrl: reader.result as string,
                      mimeType: file.type,
                    })
                  }
                  reader.readAsDataURL(file)
                  e.target.value = ''
                }}
              />
              {!isLoading && (
                <button
                  className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-black/60 transition-colors hover:bg-black/10 hover:text-black'
                  onClick={() => fileInputRef.current?.click()}
                  aria-label='Attach image'
                >
                  <Paperclip className='h-4 w-4' />
                </button>
              )}
              {isLoading ? (
                <button
                  className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white'
                  onClick={stop}
                  aria-label='Stop generating'
                >
                  <Square className='h-3.5 w-3.5 fill-current' />
                </button>
              ) : (
                <button
                  className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white transition-opacity disabled:opacity-40'
                  disabled={!input.trim() && !image}
                  onClick={() => send(input)}
                  aria-label='Send message'
                >
                  <Send className='h-4 w-4' />
                </button>
              )}
            </div>
          </div>
          <p className='mt-2 text-center text-[10px] text-black/50'>
            <kbd className='rounded border border-black/10 bg-black/5 px-1 py-0.5 font-sans text-black/60'>
              Enter
            </kbd>{' '}
            to send ·{' '}
            <kbd className='rounded border border-black/10 bg-black/5 px-1 py-0.5 font-sans text-black/60'>
              Shift
            </kbd>
            +
            <kbd className='rounded border border-black/10 bg-black/5 px-1 py-0.5 font-sans text-black/60'>
              Enter
            </kbd>{' '}
            for new line
          </p>
        </div>
      </div>
    </div>
  )
}
