import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { ChatMessage, IpoDetail } from '../types'
import { mockAssistantReply } from '../lib/mockChat'
import { IconArrowUp, IconClose } from './icons'

const SUGGESTED_QUESTIONS = [
  'What are the biggest risks?',
  'Where does the money raised go?',
  'Who is the promoter?',
]

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={`anim-fade-up flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] ${isUser ? '' : 'w-full'}`}>
        <div
          className={`rounded-md px-3.5 py-2.5 text-[0.875rem] leading-relaxed ${
            isUser ? 'bg-primary text-white' : 'border border-line bg-surface text-ink'
          }`}
        >
          {message.text}
        </div>
        {message.source && (
          <p className="label-caps mt-1.5 px-1 text-primary normal-case tracking-normal">{message.source}</p>
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="anim-fade-in flex justify-start">
      <div className="flex items-center gap-1 rounded-md border border-line bg-surface px-3.5 py-3" aria-label="Assistant is typing">
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-faint" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-faint" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-faint" />
      </div>
    </div>
  )
}

function useChatThread(ipo: IpoDetail) {
  const [messages, setMessages] = useState<ChatMessage[]>(ipo.sampleChat)
  const [typing, setTyping] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  function send(text: string) {
    if (typing) return
    setMessages((prev) => [...prev, { role: 'user', text }])
    setTyping(true)
    const reply = mockAssistantReply(text, ipo)
    timeoutRef.current = setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', ...reply }])
      setTyping(false)
    }, 700)
  }

  return { messages, typing, send }
}

function ChatHeader({ ipo, onClose, dragHandle }: { ipo: IpoDetail; onClose: () => void; dragHandle?: boolean }) {
  return (
    <>
      {dragHandle && <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-line" aria-hidden="true" />}
      <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary p-1.5">
            <img src="/chatbot-s45.svg" alt="" className="h-full w-full" />
          </span>
          <p className="text-sm font-semibold text-ink">Ask about {ipo.name.split(' (')[0]}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-ink-muted hover:text-ink"
        >
          <IconClose width={18} height={18} />
        </button>
      </div>
    </>
  )
}

function ChatBody({
  ipo,
  messages,
  typing,
  onSend,
}: {
  ipo: IpoDetail
  messages: ChatMessage[]
  typing: boolean
  onSend: (text: string) => void
}) {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length, typing])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    onSend(trimmed)
    setInput('')
  }

  const asked = new Set(messages.filter((m) => m.role === 'user').map((m) => m.text))
  const suggestions = SUGGESTED_QUESTIONS.filter((q) => !asked.has(q))

  return (
    <>
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto scrollbar-thin px-4 py-4">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        {typing && <TypingIndicator />}
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {suggestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onSend(q)}
              disabled={typing}
              className="rounded-pill border border-line px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-accent hover:text-primary disabled:opacity-40"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-line px-3 py-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          aria-label="Ask a question about this IPO"
          placeholder="Ask a question..."
          className="min-w-0 flex-1 rounded-pill border border-line bg-surface-sunken px-3.5 py-2 text-sm text-ink placeholder:text-ink-faint transition-colors focus:outline-none focus:border-primary/40 focus:bg-surface"
        />
        <button
          type="submit"
          aria-label={typing ? 'Sending' : 'Send'}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-hover disabled:opacity-60"
          disabled={!input.trim() || typing}
        >
          {typing ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          ) : input.trim() ? (
            <IconArrowUp width={16} height={16} />
          ) : (
            <img src="/chatbot-s45.svg" alt="" className="h-4 w-4" />
          )}
        </button>
      </form>
      <p className="label-caps px-4 pb-3 text-ink-faint normal-case tracking-normal">Scoped to {ipo.name} only</p>
    </>
  )
}

export function ChatWidget({ ipo }: { ipo: IpoDetail }) {
  const [open, setOpen] = useState(false)
  const { messages, typing, send } = useChatThread(ipo)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const isMobile = window.matchMedia('(max-width: 639px)').matches
    if (isMobile) document.body.style.overflow = 'hidden'

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    function onPointerDown(e: PointerEvent) {
      if (isMobile) return
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Ask about ${ipo.name}`}
          className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary p-3 shadow-[0_8px_24px_-6px_rgba(5,93,86,0.5)] transition-transform active:scale-95 sm:bottom-6 sm:right-6"
        >
          <img src="/chatbot-s45.svg" alt="" className="h-full w-full" />
        </button>
      )}

      {open && (
        <>
          {/* Mobile: full-width bottom sheet */}
          <div
            className="fixed inset-0 z-50 flex items-end sm:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={`Chat about ${ipo.name}`}
          >
            <button
              type="button"
              aria-label="Close chat"
              className="anim-fade-in absolute inset-0 bg-ink/30"
              onClick={() => setOpen(false)}
            />
            <div className="anim-sheet-up relative flex h-[75vh] w-full flex-col rounded-t-2xl bg-surface shadow-2xl">
              <ChatHeader ipo={ipo} onClose={() => setOpen(false)} dragHandle />
              <ChatBody ipo={ipo} messages={messages} typing={typing} onSend={send} />
            </div>
          </div>

          {/* Desktop/tablet: floating corner panel, no page-dimming backdrop */}
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-label={`Chat about ${ipo.name}`}
            className="anim-fade-up fixed bottom-6 right-6 z-50 hidden h-[min(34rem,calc(100vh-3rem))] w-96 max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-card border border-line bg-surface shadow-2xl sm:flex"
          >
            <ChatHeader ipo={ipo} onClose={() => setOpen(false)} />
            <ChatBody ipo={ipo} messages={messages} typing={typing} onSend={send} />
          </div>
        </>
      )}
    </>
  )
}
