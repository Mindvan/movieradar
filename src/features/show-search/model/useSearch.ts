import { useEffect, useRef, useState } from 'react'
import { fetchData, fetchShowsPage, type ShowType } from '../../../entities/show/api/fetchData'

type SearchMode = 'name' | 'genre' | 'country' | null

export function useSearch(searchInput: string, genreInput = '', countryInput = '') {
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [data, setData] = useState<ShowType[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const pageRef = useRef(0)
  const requestIdRef = useRef(0)
  const modeRef = useRef<SearchMode>(null)

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
      const genreQuery = genreInput.trim().toLowerCase()
      const countryQuery = countryInput.trim().toLowerCase()

      if (!query && !genreQuery && !countryQuery) {
        modeRef.current = null
        setLoading(false)
        setLoadingMore(false)
        setHasMore(false)
        pageRef.current = 0
        setData([])
        return
      }

      setLoading(true)
      setLoadingMore(false)
      pageRef.current = 0
      try {
        if (query) {
          modeRef.current = 'name'
          pageRef.current = 1
          const res = await fetchData(query, controller.signal)
          if (isActive && requestIdRef.current === requestId) {
            setData(res)
            setHasMore(true)
          }
          return
        }

        modeRef.current = genreQuery ? 'genre' : 'country'
        let firstBatch: ShowType[] = []
        let reachedEnd = false
        while (firstBatch.length === 0) {
          const pageData = await fetchShowsPage(pageRef.current)
          pageRef.current += 1

          if (!isActive || requestIdRef.current !== requestId) return

          if (pageData === null) {
            reachedEnd = true
            break
          }

          firstBatch = pageData.filter(({ show }) => {
            if (genreQuery) {
              return show.genres.some((genre) => genre.toLowerCase() === genreQuery)
            }
            return (show.country ?? '').toLowerCase() === countryQuery
          })
        }

        if (isActive && requestIdRef.current === requestId) {
          setData(firstBatch)
          setHasMore(!reachedEnd)
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
  }, [debouncedSearch, genreInput, countryInput])

  const loadMore = async () => {
    const query = debouncedSearch.trim().toLowerCase()
    const genreQuery = genreInput.trim().toLowerCase()
    const countryQuery = countryInput.trim().toLowerCase()
    if (loading || loadingMore || !hasMore) return
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

        const matched = modeRef.current === 'genre'
          ? pageData.filter(({ show }) => show.genres.some((genre) => genre.toLowerCase() === genreQuery))
          : modeRef.current === 'country'
            ? pageData.filter(({ show }) => (show.country ?? '').toLowerCase() === countryQuery)
          : pageData.filter(({ show }) => show.name.toLowerCase().includes(query))
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
