import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, Bell, LifeBuoy, LogOut, Menu, Search, Settings, ShieldCheck, UserRound } from 'lucide-react'
import { cn, timeAgo } from '../../lib/utils'
import { useAuth } from '../../context/AuthContext'
import { useDebounced, useOnClickOutside } from '../../hooks'
import searchService from '../../services/searchService'
import { notificationService, analyticsService } from '../../services/platformService'
import Logo from '../ui/Logo'
import Badge from '../ui/Badge'
import { Avatar, Dropdown, DropdownDivider, DropdownItem, DropdownLabel } from '../ui/Misc'

function GlobalSearch({ id = 'admin-search' }) {
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

  const grouped = results.reduce((acc, r) => {
    acc[r.type] = [...(acc[r.type] || []), r]
    return acc
  }, {})

  return (
    <div ref={ref} className="relative w-full max-w-lg">
      <label htmlFor={id} className="sr-only">
        Search businesses, users, subscriptions, invoices, calls and tickets
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
        placeholder="Search businesses, users, invoices, tickets…"
        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-[0.84rem] text-ink-900 transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/25"
      />

      <AnimatePresence>
        {open && query.trim().length >= 2 && (
          <motion.div
            key="admin-search-results"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 top-12 z-50 max-h-[28rem] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lift"
          >
            {loading && <p className="px-3 py-3 text-[0.8rem] text-slate-500">Searching…</p>}
            {!loading && !results.length && <p className="px-3 py-3 text-[0.8rem] text-slate-500">No matches for “{query}”.</p>}
            {!loading &&
              Object.entries(grouped).map(([type, items]) => (
                <div key={type}>
                  <DropdownLabel>{type}</DropdownLabel>
                  {items.map((r) => (
                    <button
                      key={`${r.type}-${r.id}`}
                      type="button"
                      onClick={() => {
                        setOpen(false)
                        setQuery('')
                        navigate(r.href)
                      }}
                      className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-100"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[0.82rem] font-semibold text-ink-900">{r.title}</span>
                        {r.subtitle && <span className="block truncate text-[0.74rem] text-slate-500">{r.subtitle}</span>}
                      </span>
                    </button>
                  ))}
                </div>
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
            <span className="absolute -right-1 -top-1 grid h-[1.1rem] min-w-[1.1rem] place-items-center rounded-full bg-rose-500 px-1 text-[0.6rem] font-bold text-white">
              {unread}
            </span>
          )}
        </button>
      )}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <p className="text-[0.8rem] font-bold text-ink-900">Platform notifications</p>
        {unread > 0 && (
          <button
            type="button"
            onClick={async () => setItems(await notificationService.markAllRead())}
            className="text-[0.7rem] font-semibold text-brand-600 hover:underline"
          >
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
            onClick={async () => {
              if (!n.read) setItems(await notificationService.markRead(n.id))
            }}
            className={cn('flex gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-100', !n.read && 'bg-brand-50/60')}
          >
            <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', n.read ? 'bg-slate-300' : 'bg-brand-500')} aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-[0.79rem] font-semibold text-ink-900">{n.title}</span>
              <span className="block truncate text-[0.74rem] text-slate-500">{n.body}</span>
              <span className="mt-0.5 block text-[0.68rem] text-slate-400">{timeAgo(n.at)}</span>
            </span>
          </Link>
        ))}
        {!items.length && <p className="px-3 py-6 text-center text-[0.8rem] text-slate-500">No notifications.</p>}
      </div>
    </Dropdown>
  )
}

function SystemStatus() {
  const [health, setHealth] = useState([])

  useEffect(() => {
    analyticsService.getHealth().then(setHealth)
  }, [])

  const down = health.filter((h) => h.status === 'Down').length
  const warning = health.filter((h) => h.status === 'Warning').length
  const tone = down ? 'danger' : warning ? 'warning' : 'success'
  const label = down ? `${down} down` : warning ? `${warning} warning` : 'All systems go'

  return (
    <Dropdown
      width="w-64"
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition-colors hover:bg-slate-50 lg:inline-flex"
          aria-label="System status"
        >
          <Activity className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <Badge tone={tone} size="sm" dot>
            {label}
          </Badge>
        </button>
      )}
    >
      <DropdownLabel>Platform health</DropdownLabel>
      {health.map((h) => (
        <div key={h.id} className="flex items-center justify-between gap-3 rounded-lg px-3 py-1.5">
          <span className="truncate text-[0.8rem] text-slate-600">{h.name}</span>
          <Badge tone={h.status === 'Operational' ? 'success' : h.status === 'Warning' ? 'warning' : 'danger'} size="sm">
            {h.status}
          </Badge>
        </div>
      ))}
      <DropdownDivider />
      <DropdownItem as={Link} to="/dashboard">
        Open dashboard
      </DropdownItem>
    </Dropdown>
  )
}

export default function AdminHeader({ onOpenSidebar }) {
  const { admin, role, logout } = useAuth()
  const navigate = useNavigate()

  const signOut = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
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
        <Link to="/dashboard" className="min-w-0 flex-1 md:hidden" aria-label="Go to dashboard">
          <Logo size="sm" />
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <SystemStatus />

          <Link
            to="/support"
            className="hidden h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-ink-900 sm:grid"
            aria-label="Support"
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
                aria-label="Admin account menu"
              >
                <Avatar name={admin?.name} size="sm" />
                <span className="hidden min-w-0 text-left sm:block">
                  <span className="block max-w-[9rem] truncate text-[0.79rem] font-semibold text-ink-900">{admin?.name}</span>
                  <span className="block max-w-[9rem] truncate text-[0.67rem] text-slate-500">{role?.name}</span>
                </span>
              </button>
            )}
          >
            <div className="px-3 py-2">
              <p className="truncate text-[0.82rem] font-semibold text-ink-900">{admin?.name}</p>
              <p className="truncate text-[0.72rem] text-slate-500">{admin?.email}</p>
              <div className="mt-2">
                <Badge tone="brand" size="sm">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  {role?.name}
                </Badge>
              </div>
            </div>
            <DropdownDivider />
            <DropdownItem as={Link} to="/profile" icon={UserRound}>
              Profile
            </DropdownItem>
            <DropdownItem as={Link} to="/security" icon={ShieldCheck}>
              Security
            </DropdownItem>
            <DropdownItem as={Link} to="/settings" icon={Settings}>
              Preferences
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem icon={LogOut} tone="danger" onClick={signOut}>
              Log out
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="border-t border-slate-200/80 px-4 py-2.5 md:hidden">
        <GlobalSearch id="admin-search-mobile" />
      </div>
    </header>
  )
}
