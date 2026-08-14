import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  Building2,
  CreditCard,
  LifeBuoy,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
  Check,
} from 'lucide-react'
import cn from '../../lib/cn'
import { timeAgo } from '../../lib/format'
import { useAuth } from '../../context/AuthContext'
import useDebounced from '../../hooks/useDebounced'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import searchService from '../../services/searchService'
import notificationService from '../../services/notificationService'
import Avatar from '../ui/Avatar'
import Logo from '../ui/Logo'
import Dropdown, { DropdownDivider, DropdownItem, DropdownLabel } from '../ui/Dropdown'

function GlobalSearch({ id = 'global-search' }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounced = useDebounced(query, 250)
  const ref = useRef(null)
  const navigate = useNavigate()
  useOnClickOutside(ref, () => setOpen(false), open)

  useEffect(() => {
    let active = true
    if (debounced.trim().length < 2) {
      setResults([])
      setLoading(false)
      return () => {
        active = false
      }
    }
    setLoading(true)
    searchService
      .search(debounced)
      .then((res) => active && setResults(res))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [debounced])

  const go = (href) => {
    setOpen(false)
    setQuery('')
    navigate(href)
  }

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <label htmlFor={id} className="sr-only">
        Search contacts, conversations, leads, calls and knowledge
      </label>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        placeholder="Search contacts, conversations, leads…"
        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-[0.85rem] text-ink-900 transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/25"
      />

      <AnimatePresence>
        {open && query.trim().length >= 2 && (
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 top-12 z-50 max-h-[26rem] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lift"
          >
            {loading && <p className="px-3 py-3 text-[0.8rem] text-slate-500">Searching…</p>}
            {!loading && !results.length && (
              <p className="px-3 py-3 text-[0.8rem] text-slate-500">No matches for “{query}”.</p>
            )}
            {!loading &&
              results.map((r) => (
                <button
                  key={`${r.type}-${r.id}`}
                  type="button"
                  onClick={() => go(r.href)}
                  className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-100"
                >
                  <span className="mt-0.5 shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-slate-500">
                    {r.type}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.83rem] font-semibold text-ink-900">{r.title}</span>
                    {r.subtitle && <span className="block truncate text-[0.75rem] text-slate-500">{r.subtitle}</span>}
                  </span>
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NotificationsMenu() {
  const [items, setItems] = useState([])
  const unread = items.filter((n) => !n.read).length

  useEffect(() => {
    notificationService.list().then(setItems)
  }, [])

  const markAll = async () => setItems(await notificationService.markAllRead())
  const markOne = async (id) => setItems(await notificationService.markRead(id))

  return (
    <Dropdown
      width="w-[21rem]"
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-ink-900"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        >
          <Bell className="h-[1.05rem] w-[1.05rem]" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 grid h-[1.1rem] min-w-[1.1rem] place-items-center rounded-full bg-rose-500 px-1 text-[0.62rem] font-bold text-white">
              {unread}
            </span>
          )}
        </button>
      )}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <p className="text-[0.8rem] font-bold text-ink-900">Notifications</p>
        {unread > 0 && (
          <button type="button" onClick={markAll} className="text-[0.72rem] font-semibold text-brand-600 hover:underline">
            Mark all read
          </button>
        )}
      </div>
      <DropdownDivider />
      <div className="max-h-80 overflow-y-auto">
        {items.slice(0, 6).map((n) => (
          <Link
            key={n.id}
            to={n.href}
            onClick={() => markOne(n.id)}
            className={cn('flex gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-100', !n.read && 'bg-brand-50/60')}
          >
            <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', n.read ? 'bg-slate-300' : 'bg-brand-500')} aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-[0.8rem] font-semibold text-ink-900">{n.title}</span>
              <span className="block truncate text-[0.75rem] text-slate-500">{n.body}</span>
              <span className="mt-0.5 block text-[0.68rem] text-slate-400">{timeAgo(n.at)}</span>
            </span>
          </Link>
        ))}
        {!items.length && <p className="px-3 py-6 text-center text-[0.8rem] text-slate-500">No notifications yet.</p>}
      </div>
      <DropdownDivider />
      <DropdownItem as={Link} to="/app/notifications">
        View all notifications
      </DropdownItem>
    </Dropdown>
  )
}

export default function AppHeader({ onOpenSidebar }) {
  const { user, business, logout } = useAuth()
  const navigate = useNavigate()

  const signOut = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="flex h-[4.25rem] items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-ink-900 transition-colors hover:bg-slate-50 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden min-w-0 flex-1 md:block">
          <GlobalSearch />
        </div>

        {/* The sidebar is hidden on small screens, so the header carries the brand */}
        <Link to="/app/dashboard" className="min-w-0 flex-1 md:hidden" aria-label="Go to dashboard">
          <Logo size="sm" />
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/app/help"
            className="hidden h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-ink-900 sm:grid"
            aria-label="Help and support"
          >
            <LifeBuoy className="h-[1.05rem] w-[1.05rem]" />
          </Link>

          <NotificationsMenu />

          <Dropdown
            width="w-64"
            trigger={({ toggle }) => (
              <button
                type="button"
                onClick={toggle}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-slate-50"
                aria-label="Account menu"
              >
                <Avatar name={user?.name} size="sm" />
                <span className="hidden min-w-0 text-left sm:block">
                  <span className="block max-w-[9rem] truncate text-[0.8rem] font-semibold text-ink-900">{user?.name}</span>
                  <span className="block max-w-[9rem] truncate text-[0.68rem] text-slate-500">{business?.name}</span>
                </span>
              </button>
            )}
          >
            <div className="px-3 py-2">
              <p className="truncate text-[0.83rem] font-semibold text-ink-900">{user?.name}</p>
              <p className="truncate text-[0.72rem] text-slate-500">{user?.email}</p>
            </div>
            <DropdownDivider />
            <DropdownLabel>Current business</DropdownLabel>
            <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-ink-900 text-white">
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 truncate text-[0.8rem] font-medium text-ink-900">{business?.name}</span>
              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
            </div>
            <DropdownDivider />
            <DropdownItem as={Link} to="/app/settings/profile" icon={UserRound}>
              Profile
            </DropdownItem>
            <DropdownItem as={Link} to="/app/settings/business" icon={Settings}>
              Business Settings
            </DropdownItem>
            <DropdownItem as={Link} to="/app/subscription" icon={CreditCard}>
              Subscription
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem icon={LogOut} tone="danger" onClick={signOut}>
              Log out
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Search moves to its own row on small screens */}
      <div className="border-t border-slate-200/80 px-4 py-2.5 md:hidden">
        <GlobalSearch id="global-search-mobile" />
      </div>
    </header>
  )
}
