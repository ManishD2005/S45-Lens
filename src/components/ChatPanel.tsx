import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { ChatMessage, IpoDetail } from '../types'
import { mockAssistantReply } from '../lib/mockChat'
import { IconChat, IconClose, IconSend } from './icons'

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
          className={`rounded-[14px] px-3.5 py-2.5 text-[0.875rem] leading-relaxed ${
            isUser ? 'bg-primary text-white' : 'border border-line bg-surface text-ink'
          }`}
        >
          {message.text}
        </div>
        {message.source && (
          <p className="label-caps mt-1.5 px-1 text-accent normal-case tracking-normal">{message.source}</p>
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="anim-fade-in flex justify-start">
      <div className="flex items-center gap-1 rounded-[14px] border border-line bg-surface px-3.5 py-3" aria-label="Assistant is typing">
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
          aria-label="Send"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-hover disabled:opacity-40"
          disabled={!input.trim() || typing}
        >
          <IconSend width={16} height={16} />
        </button>
      </form>
      <p className="label-caps px-4 pb-3 text-ink-faint normal-case tracking-normal">Scoped to {ipo.name} only</p>
    </>
  )
}

export function DockedChatPanel({ ipo }: { ipo: IpoDetail }) {
  const { messages, typing, send } = useChatThread(ipo)

  return (
    <aside className="hidden h-[calc(100vh-4rem)] w-[280px] shrink-0 flex-col border-l border-line bg-surface lg:sticky lg:top-16 lg:flex xl:w-[300px]">
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-4">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[0.6rem] font-semibold text-white">
          AI
        </span>
        <p className="text-sm font-semibold leading-snug text-ink">Ask about {ipo.name.split(' (')[0]}</p>
      </div>
      <ChatBody ipo={ipo} messages={messages} typing={typing} onSend={send} />
    </aside>
  )
}

export function MobileChatSheet({ ipo }: { ipo: IpoDetail }) {
  const [open, setOpen] = useState(false)
  const { messages, typing, send } = useChatThread(ipo)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ask about ${ipo.name}`}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_8px_24px_-6px_rgba(5,93,86,0.5)] transition-transform active:scale-95"
      >
        <IconChat width={22} height={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end" role="dialog" aria-modal="true" aria-label={`Chat about ${ipo.name}`}>
          <button
            type="button"
            aria-label="Close chat"
            className="anim-fade-in absolute inset-0 bg-ink/30"
            onClick={() => setOpen(false)}
          />
          <div className="anim-sheet-up relative flex h-[75vh] w-full flex-col rounded-t-2xl bg-surface shadow-2xl">
            <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-line" aria-hidden="true" />
            <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[0.6rem] font-semibold text-white">
                  AI
                </span>
                <p className="text-sm font-semibold text-ink">Ask about {ipo.name.split(' (')[0]}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="p-1 text-ink-muted">
                <IconClose width={18} height={18} />
              </button>
            </div>
            <ChatBody ipo={ipo} messages={messages} typing={typing} onSend={send} />
          </div>
        </div>
      )}
    </div>
  )
}
