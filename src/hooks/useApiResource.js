import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useApiResource(fetcher)
 * Generic hook for loading a single resource from the API.
 * `fetcher` is a memoized async function returning the resource.
 */
export function useApiResource(fetcher) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const requestId = useRef(0)

  const reload = useCallback(async () => {
    const id = ++requestId.current
    setLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      if (id === requestId.current) setData(result)
    } catch (err) {
      if (id === requestId.current) {
        setError(err)
      }
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }, [fetcher])

  useEffect(() => {
    // Schedule the initial load on a microtask so we don't synchronously
    // setState inside the effect body (react-hooks/set-state-in-effect).
    const promise = Promise.resolve().then(() => reload())
    return () => {
      // Bump the request id so any in-flight load won't apply its results.
      requestId.current += 1
      promise.catch(() => {})
    }
  }, [reload])

  return { data, setData, loading, error, reload }
}
