import { useEffect, useRef, useState } from 'react'
import { Bot, RotateCcw, Send, UserRound } from 'lucide-react'
import cn from '../../lib/cn'
import { formatTime } from '../../lib/format'
import { channelLabel } from '../../lib/channels'
import aiService from '../../services/aiService'

const suggestions = [
  'Do you have rooms available tomorrow?',
  'Is breakfast included?',
  'Do you have parking?',
  'What is your cancellation policy?',
]

const seed = [
  {
    id: 'welcome',
    from: 'ai',
    at: new Date().toISOString(),
    text: 'Hello! I am your AI receptionist. Ask me anything a customer might ask and I will answer from your business knowledge.',
  },
]

export default function AITestChat({ channel = 'voice', className = '' }) {
  const [messages, setMessages] = useState(seed)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  const send = async (text) => {
    const value = (text ?? input).trim()
    if (!value || thinking) return
    setInput('')
    setMessages((prev) => [...prev, { id: `u${Date.now()}`, from: 'customer', at: new Date().toISOString(), text: value }])
    setThinking(true)
    try {
      const reply = await aiService.sendTestMessage({ text: value, channel })
      setMessages((prev) => [...prev, reply])
    } finally {
      setThinking(false)
    }
  }

  return (
    <div className={cn('flex h-full min-h-[26rem] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-50/60 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
            <Bot className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[0.85rem] font-semibold text-ink-900">Test conversation</p>
            <p className="text-[0.72rem] text-slate-500">{channelLabel(channel)} agent · sandbox</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMessages(seed)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.75rem] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-ink-900"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Clear
        </button>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3.5 overflow-y-auto px-4 py-4 sm:px-5">
        {messages.map((m) => {
          const isAi = m.from === 'ai'
          return (
            <div key={m.id} className={cn('flex gap-2.5', isAi ? '' : 'justify-end')}>
              {isAi && (
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              )}
              <div className={cn('max-w-[80%]', isAi ? '' : 'text-right')}>
                <p
                  className={cn(
                    'inline-block text-left text-[0.85rem] leading-relaxed',
                    isAi
                      ? 'rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2.5 text-slate-700'
                      : 'rounded-2xl rounded-tr-sm bg-brand-600 px-3.5 py-2.5 text-white',
                  )}
                >
                  {m.text}
                </p>
                <p className="mt-1 text-[0.65rem] text-slate-400">{formatTime(m.at)}</p>
              </div>
              {!isAi && (
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500">
                  <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              )}
            </div>
          )
        })}

        {thinking && (
          <div className="flex gap-2.5">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
              <Bot className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="inline-flex items-center gap-1 rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200/80 px-4 py-3 sm:px-5">
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[0.72rem] font-medium text-slate-600 transition-colors hover:border-brand-200 hover:text-brand-700"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="ai-test-input" className="sr-only">
            Message the AI
          </label>
          <input
            id="ai-test-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask what a customer would ask…"
            className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 text-[0.88rem] text-ink-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25"
          />
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            aria-label="Send test message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
