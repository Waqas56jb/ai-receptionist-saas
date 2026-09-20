import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import cn from '../../lib/cn'
import useOnClickOutside from '../../hooks/useOnClickOutside'

/**
 * Lightweight popover menu. `trigger` receives `{ open, toggle }` so callers
 * can render any button they like.
 */
export default function Dropdown({ trigger, children, align = 'right', width = 'w-56', className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setOpen(false), open)

  return (
    <div ref={ref} className={cn('relative', className)}>
      {trigger({ open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) })}

      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'absolute z-50 mt-2 overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-lift',
              align === 'right' ? 'right-0' : 'left-0',
              width,
            )}
            onClick={() => setOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function DropdownItem({ icon: Icon, children, onClick, as: Tag = 'button', tone = 'default', ...props }) {
  return (
    <Tag
      type={Tag === 'button' ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[0.83rem] font-medium transition-colors',
        tone === 'danger' ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-700 hover:bg-slate-100 hover:text-ink-900',
      )}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />}
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </Tag>
  )
}

export function DropdownDivider() {
  return <div className="my-1.5 h-px bg-slate-100" />
}

export function DropdownLabel({ children }) {
  return <p className="px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">{children}</p>
}
