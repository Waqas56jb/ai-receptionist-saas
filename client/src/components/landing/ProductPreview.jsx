import { motion, useReducedMotion } from 'framer-motion'
import {
  LayoutDashboard,
  MessagesSquare,
  Users,
  Database,
  BarChart3,
  Settings,
  Search,
  PhoneCall,
  MessageSquare,
  Instagram,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

const sidebar = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: MessagesSquare, label: 'Conversations' },
  { icon: Users, label: 'Contacts' },
  { icon: Database, label: 'Knowledge Base' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Settings, label: 'Settings' },
]

const stats = [
  { label: 'Total calls', value: '1,284', delta: '+12.4%' },
  { label: 'Conversations', value: '3,410', delta: '+8.1%' },
  { label: 'AI handled', value: '92%', delta: '+3.2%' },
  { label: 'New leads', value: '187', delta: '+21.6%' },
]

const chart = [
  { day: 'Mon', calls: 52, messages: 74 },
  { day: 'Tue', calls: 61, messages: 66 },
  { day: 'Wed', calls: 48, messages: 82 },
  { day: 'Thu', calls: 70, messages: 71 },
  { day: 'Fri', calls: 84, messages: 92 },
  { day: 'Sat', calls: 66, messages: 58 },
  { day: 'Sun', calls: 41, messages: 47 },
]

const conversations = [
  { icon: PhoneCall, name: 'Daniel Reyes', preview: 'Room availability for tonight', time: '2m', tag: 'Booked' },
  { icon: MessageSquare, name: 'Aisha Karim', preview: 'Does the rate include breakfast?', time: '14m', tag: 'Answered' },
  { icon: Instagram, name: 'Marco Bianchi', preview: 'Is late check-out possible?', time: '38m', tag: 'Answered' },
  { icon: PhoneCall, name: 'Sofia Lindqvist', preview: 'Group booking for 12 guests', time: '1h', tag: 'Lead' },
]

export default function ProductPreview() {
  const reduceMotion = useReducedMotion()
  const maxBar = Math.max(...chart.flatMap((d) => [d.calls, d.messages]))

  return (
    <section className="section-y bg-slate-50/70" aria-labelledby="preview-heading">
      <div className="container-page">
        <SectionHeading
          id="preview-heading"
          eyebrow="Business Dashboard"
          title="Every conversation, in one place."
          description="Calls, messages, transcripts, contacts and AI activity — your team follows everything from a single dashboard built for the business, not for engineers."
        />

        <Reveal delay={0.1}>
          <div className="mt-14 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lift sm:rounded-[1.5rem]">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-50/80 px-4 py-3">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              </span>
              <div className="mx-auto flex max-w-xs flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
                <Search className="h-3 w-3 text-slate-400" aria-hidden="true" />
                <span className="truncate text-[0.7rem] text-slate-400">
                  app.example.com/dashboard
                </span>
              </div>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <aside className="hidden w-52 shrink-0 border-r border-slate-200/80 bg-slate-50/50 p-4 lg:block">
                <div className="flex items-center gap-2 px-2 pb-4">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink-900">
                    <Sparkles className="h-3.5 w-3.5 text-brand-300" aria-hidden="true" />
                  </span>
                  <span className="font-display text-sm font-bold text-ink-900">Harbour View</span>
                </div>
                <ul className="space-y-1">
                  {sidebar.map((item) => (
                    <li key={item.label}>
                      <span
                        className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.8rem] font-medium ${
                          item.active
                            ? 'bg-brand-600 text-white'
                            : 'text-slate-500'
                        }`}
                      >
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Main */}
              <div className="min-w-0 flex-1 p-4 sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-bold text-ink-900 sm:text-lg">
                      Overview
                    </h3>
                    <p className="text-xs text-slate-500">Last 7 days</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[0.65rem] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    AI receptionist active
                  </span>
                </div>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.45, delay: reduceMotion ? 0 : i * 0.07 }}
                      className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-subtle"
                    >
                      <p className="text-[0.7rem] font-medium uppercase tracking-wider text-slate-500">
                        {stat.label}
                      </p>
                      <div className="mt-1.5 flex items-baseline gap-2">
                        <span className="font-display text-xl font-bold tabular-nums text-ink-900 sm:text-2xl">
                          {stat.value}
                        </span>
                        <span className="inline-flex items-center text-[0.7rem] font-semibold text-emerald-600">
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                          {stat.delta}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
                  {/* Chart */}
                  <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-subtle">
                    <div className="flex items-center justify-between">
                      <p className="text-[0.8rem] font-semibold text-ink-900">Activity</p>
                      <div className="flex items-center gap-3 text-[0.65rem] font-medium text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-sm bg-brand-600" aria-hidden="true" />
                          Calls
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-sm bg-brand-200" aria-hidden="true" />
                          Messages
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 flex items-end gap-2 sm:gap-3">
                      {chart.map((entry, i) => (
                        <div key={entry.day} className="flex flex-1 flex-col items-center gap-2">
                          {/* Definite height so the percentage bar heights resolve */}
                          <div className="flex h-28 w-full items-end justify-center gap-1 lg:h-40">
                            {['calls', 'messages'].map((series) => (
                              <motion.span
                                key={series}
                                initial={{ scaleY: reduceMotion ? 1 : 0 }}
                                whileInView={{ scaleY: 1 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{
                                  duration: 0.6,
                                  delay: reduceMotion ? 0 : i * 0.06,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                                style={{ height: `${(entry[series] / maxBar) * 100}%` }}
                                className={`w-full max-w-[10px] origin-bottom rounded-t-[3px] ${
                                  series === 'calls' ? 'bg-brand-600' : 'bg-brand-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[0.6rem] font-medium text-slate-400">{entry.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent conversations */}
                  <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-subtle">
                    <p className="text-[0.8rem] font-semibold text-ink-900">Recent conversations</p>
                    <ul className="mt-3 divide-y divide-slate-100">
                      {conversations.map((item) => (
                        <li key={item.name} className="flex items-center gap-3 py-2.5">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                            <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[0.78rem] font-semibold text-ink-900">
                              {item.name}
                            </p>
                            <p className="truncate text-[0.72rem] text-slate-500">{item.preview}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-[0.65rem] text-slate-400">{item.time}</p>
                            <p className="text-[0.65rem] font-semibold text-brand-600">{item.tag}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-5 text-center text-xs text-slate-400">
            Product preview — sample data shown for illustration.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
