import { useEffect, useRef, useState } from 'react'
import { fetchData, fetchShowsPage, type ShowType } from '../../../entities/show/api/fetchData'

export function useSearch(searchInput: string) {
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [data, setData] = useState<ShowType[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const pageRef = useRef(0)
  const requestIdRef = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
    }, 400)

    return () => {
      clearTimeout(timer)
    }
  }, [searchInput])

  useEffect(() => {
    let isActive = true
    requestIdRef.current += 1
    const requestId = requestIdRef.current
    const controller = new AbortController()

    const load = async () => {
      const query = debouncedSearch.trim()
      if (!query) {
        setLoading(false)
        setLoadingMore(false)
        setHasMore(false)
        pageRef.current = 0
        setData([])
        return
      }

      setLoading(true)
      setLoadingMore(false)
      pageRef.current = 1
      try {
        const res = await fetchData(query, controller.signal)
        if (isActive && requestIdRef.current === requestId) {
          setData(res)
          setHasMore(true)
        }
      } finally {
        if (isActive && requestIdRef.current === requestId) {
          setLoading(false)
        }
      }
    }
    load()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [debouncedSearch])

  const loadMore = async () => {
    const query = debouncedSearch.trim().toLowerCase()
    if (!query || loading || loadingMore || !hasMore) return
    const requestId = requestIdRef.current

    setLoadingMore(true)
    try {
      let hasAddedResults = false
      const existingIds = new Set(data.map(({ show }) => show.id))

      while (!hasAddedResults) {
        const pageData = await fetchShowsPage(pageRef.current)
        pageRef.current += 1

        if (requestIdRef.current !== requestId) {
          return
        }

        if (pageData === null) {
          setHasMore(false)
          return
        }

        const matched = pageData.filter(({ show }) => show.name.toLowerCase().includes(query))
        if (matched.length > 0) {
          const uniqueMatched = matched.filter(({ show }) => !existingIds.has(show.id))
          if (uniqueMatched.length > 0) {
            setData((prev) => [...prev, ...uniqueMatched])
            hasAddedResults = true
          }
        }
      }
    } finally {
      setLoadingMore(false)
    }
  }

  return { data, loading, loadingMore, hasMore, loadMore }
}
