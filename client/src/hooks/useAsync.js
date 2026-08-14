import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Runs a service call and exposes the loading / error / data triple every
 * data-heavy screen needs, plus a `reload` for retry buttons.
 */
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

export default useAsync
