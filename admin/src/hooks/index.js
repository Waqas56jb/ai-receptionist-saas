import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/** Loading / error / data triple plus a reload for retry buttons. */
export function useAsync(fn, deps = [], { immediate = true } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  const mounted = useRef(true)
  const callback = useRef(fn)
  callback.current = fn

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await callback.current()
      if (mounted.current) setData(result)
      return result
    } catch (err) {
      if (mounted.current) setError(err)
      return null
    } finally {
      if (mounted.current) setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    if (immediate) run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, immediate])

  return { data, setData, loading, error, reload: run }
}

export function useDebounced(value, delay = 250) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export function useOnClickOutside(ref, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return
      handler(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler, enabled])
}

/**
 * Filtering, sorting, pagination and row selection for the admin tables.
 * Keeps every table on the same behaviour without repeating the logic.
 */
export function useTable(rows = [], { pageSize = 10, initialSort = null, searchFields = [] } = {}) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [sort, setSort] = useState(initialSort)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState([])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (!row) return false
      const bySearch =
        !q || searchFields.some((field) => String(row[field] ?? '').toLowerCase().includes(q))
      const byFilters = Object.entries(filters).every(([key, value]) => {
        if (!value || value === 'All') return true
        if (Array.isArray(row[key])) return row[key].includes(value)
        return String(row[key]) === String(value)
      })
      return bySearch && byFilters
    })
  }, [rows, query, filters, searchFields])

  const sorted = useMemo(() => {
    if (!sort?.key) return filtered
    const copy = [...filtered]
    copy.sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      if (av === bv) return 0
      if (av === null || av === undefined) return 1
      if (bv === null || bv === undefined) return -1
      const result = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sort.direction === 'desc' ? -result : result
    })
    return copy
  }, [filtered, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    setPage(1)
    setSelected([])
  }, [query, filters])

  const toggleSort = (key) =>
    setSort((prev) =>
      prev?.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' },
    )

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))
  const clearFilters = () => {
    setFilters({})
    setQuery('')
  }

  const activeFilters = Object.entries(filters).filter(([, v]) => v && v !== 'All')

  const toggleRow = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  const toggleAll = () =>
    setSelected((prev) => (prev.length === paged.length ? [] : paged.map((r) => r.id)))

  return {
    query, setQuery,
    filters, setFilter, clearFilters, activeFilters,
    sort, toggleSort,
    page: currentPage, setPage, totalPages, pageSize,
    rows: paged, filteredRows: sorted, total: sorted.length, sourceTotal: rows.length,
    selected, setSelected, toggleRow, toggleAll,
  }
}
