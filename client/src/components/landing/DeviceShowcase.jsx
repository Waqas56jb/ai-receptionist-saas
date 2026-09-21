import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Signal, Wifi, Battery } from 'lucide-react'
import { industries } from '../../data/landing'
import Img from '../ui/Img'

const TIMES = ['09:00', '10:30', '12:15', '14:00', '16:20']
const SPRING = { type: 'spring', stiffness: 140, damping: 22, mass: 0.9 }

function wrappedOffset(index, active, total) {
  let offset = index - active
  const half = total / 2
  if (offset > half) offset -= total
  if (offset < -half) offset += total
  return offset
}

function slotStyle(offset, compact) {
  const abs = Math.abs(offset)
  const dir = Math.sign(offset)
  const spread = compact ? 86 : 196
  return {
    x: dir * abs * spread - dir * Math.max(0, abs - 1) * (compact ? 10 : 18),
    z: abs === 0 ? 160 : -abs * 110,
    rotateY: -dir * abs * (compact ? 11 : 7),
    scale: abs === 0 ? 1 : abs === 1 ? 0.9 : abs === 2 ? 0.78 : 0.68,
    opacity: abs === 0 ? 1 : abs === 1 ? 0.86 : abs === 2 ? 0.55 : 0.28,
    blur: abs > 2 ? 0.8 : 0,
  }
}

function rowsFor(industry) {
  const extras = [
    `${industry.name} front desk`,
    industry.useCase.replace(/\.$/, ''),
  ]
  const titles = [...industry.lines, ...extras].slice(0, 5)
  return titles.map((title, i) => ({
    time: TIMES[i],
    title,
    status: i === 0 ? industry.tags[0] : i === 1 ? industry.tags[1] || 'Open' : i === 2 ? 'Available' : industry.tags[2] || 'Live',
    tone: i === 0 ? 'amber' : i === 1 ? 'mint' : 'muted',
  }))
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-4 pb-1 pt-2 text-[0.58rem] font-semibold text-white/80">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <Signal className="h-2.5 w-2.5" aria-hidden="true" />
        <Wifi className="h-2.5 w-2.5" aria-hidden="true" />
        <Battery className="h-2.5 w-2.5" aria-hidden="true" />
      </span>
    </div>
  )
}

function PhoneScreen({ industry, featured }) {
  const rows = useMemo(() => rowsFor(industry), [industry])

  return (
    <div className="flex h-full flex-col bg-[#050814] text-white">
      <StatusBar />
      <div className="relative mx-2 h-[34%] overflow-hidden rounded-xl">
        <Img src={industry.image} alt={industry.alt} className="h-full w-full object-cover" width={640} height={400} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-[#050814]/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-primary-300/90">{industry.sector}</p>
          <p className="mt-1 font-display text-[1.15rem] font-bold leading-[1.1] tracking-tight">{industry.name}</p>
        </div>
      </div>

      <ul className="mt-2 flex-1 space-y-1.5 overflow-hidden px-3">
        {rows.map((row) => (
          <li key={row.title} className="flex items-start gap-2 rounded-lg bg-white/[0.035] px-2 py-1.5">
            <span className="mt-0.5 w-8 shrink-0 text-[0.58rem] tabular-nums text-white/45">{row.time}</span>
            <span className="min-w-0 flex-1 truncate text-[0.68rem] font-medium leading-snug text-white/90">{row.title}</span>
            <span
              className={`shrink-0 rounded-full px-1.5 py-0.5 text-[0.5rem] font-bold uppercase tracking-wide ${
                row.tone === 'amber'
                  ? 'bg-amber-400/20 text-amber-300'
                  : row.tone === 'mint'
                    ? 'bg-primary-400/15 text-primary-300'
                    : 'bg-white/[0.08] text-white/50'
              }`}
            >
              {row.status}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex justify-center py-2.5">
        <span className={`h-1 w-16 rounded-full ${featured ? 'bg-white/35' : 'bg-white/20'}`} aria-hidden="true" />
      </div>
    </div>
  )
}

function Phone({ industry, featured, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={featured}
      aria-label={`${industry.sector}: ${industry.name}`}
      className={`relative aspect-[9/19.2] w-[220px] origin-center overflow-hidden rounded-[2.15rem] border bg-black p-[7px] text-left sm:w-[244px] lg:w-[272px] ${
        featured
          ? 'border-primary-400 shadow-[0_0_0_2px_rgb(255_122_0_/_0.9),0_0_48px_rgb(0_102_255_/_0.45),0_28px_70px_rgb(0_0_0_/_0.55)]'
          : 'border-white/10 shadow-[0_18px_50px_rgb(0_0_0_/_0.45)]'
      }`}
    >
      <div className="h-full overflow-hidden rounded-[1.7rem] bg-[#050814]">
        <PhoneScreen industry={industry} featured={featured} />
      </div>
    </button>
  )
}

export default function DeviceShowcase() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(() => industries.findIndex((item) => item.sector === 'Hotel'))
  const [paused, setPaused] = useState(false)
  const [compact, setCompact] = useState(false)
  const total = industries.length
  const start = active < 0 ? 0 : active

  const prev = () => setActive((i) => (i <= 0 ? total - 1 : i - 1))
  const next = () => setActive((i) => (i >= total - 1 ? 0 : i + 1))

  useEffect(() => {
    const onResize = () => setCompact(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (paused || reduceMotion) return undefined
    const id = window.setInterval(next, 4200)
    return () => window.clearInterval(id)
  }, [paused, reduceMotion, start])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const visible = industries
    .map((industry, index) => ({ industry, index, offset: wrappedOffset(index, start, total) }))
    .filter((item) => Math.abs(item.offset) <= 3)
    .sort((a, b) => Math.abs(b.offset) - Math.abs(a.offset))

  return (
    <section
      id="screens"
      className="relative overflow-hidden py-20 sm:py-24"
      aria-labelledby="screens-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(20_184_166_/_0.08),transparent_58%)]" aria-hidden="true" />

      <div className="section-shell relative mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-500">Today&apos;s pick</p>
        <h2 id="screens-heading" className="mt-3 font-display text-3xl font-bold tracking-[-0.025em] text-ink sm:text-4xl">
          What these receptionists handle
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Live inboxes for banks, hotels, hospitals and more — every screen trained on that
          business, then answering calls and messages from one platform.
        </p>
      </div>

      <div className="relative mx-auto h-[560px] max-w-[1400px] overflow-hidden sm:h-[620px] lg:h-[680px]">
        <motion.div
          className="device-stage mask-fade-x absolute inset-0 flex cursor-grab items-center justify-center active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.06}
          onDragEnd={(_, info) => {
            if (info.offset.x < -70) next()
            if (info.offset.x > 70) prev()
          }}
        >
          {visible.map(({ industry, index, offset }) => {
            const slot = slotStyle(offset, compact)
            return (
              <motion.div
                key={industry.sector}
                className="absolute will-change-transform"
                initial={false}
                animate={{
                  x: slot.x,
                  z: reduceMotion ? 0 : slot.z,
                  rotateY: reduceMotion ? 0 : slot.rotateY,
                  scale: slot.scale,
                  opacity: slot.opacity,
                  filter: slot.blur ? `blur(${slot.blur}px)` : 'blur(0px)',
                }}
                transition={reduceMotion ? { duration: 0.2 } : SPRING}
                style={{ zIndex: 20 - Math.abs(offset) }}
              >
                <Phone industry={industry} featured={offset === 0} onSelect={() => setActive(index)} />
              </motion.div>
            )
          })}
        </motion.div>

        <button
          type="button"
          onClick={prev}
          className="absolute left-4 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-[#080e1c]/80 text-white shadow-lift backdrop-blur-md transition hover:border-primary-400/50 hover:text-primary-300 sm:left-8"
          aria-label="Previous screen"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-4 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-[#080e1c]/80 text-white shadow-lift backdrop-blur-md transition hover:border-primary-400/50 hover:text-primary-300 sm:right-8"
          aria-label="Next screen"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}
