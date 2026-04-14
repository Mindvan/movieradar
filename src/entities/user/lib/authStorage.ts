import type { AuthData, MovieListItem, RatedMovie } from '../model/auth'

export const AUTH_STORAGE_KEY = 'auth-user'

function parseMovieListItem(item: unknown, fallbackId: number): MovieListItem | null {
  if (typeof item === 'string') {
    return { showId: fallbackId, title: item }
  }

  if (typeof item !== 'object' || item === null) return null
  const maybe = item as { showId?: unknown; title?: unknown }
  if (typeof maybe.title !== 'string') return null

  return {
    showId: typeof maybe.showId === 'number' ? maybe.showId : fallbackId,
    title: maybe.title,
  }
}

export function readAuthData(): AuthData | null {
  if (typeof window === 'undefined') return null

  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null

    const login = typeof (parsed as { login?: unknown }).login === 'string'
      ? (parsed as { login: string }).login
      : ''

    if (!login) return null

    const ratedMovies = Array.isArray((parsed as { ratedMovies?: unknown }).ratedMovies)
      ? (parsed as { ratedMovies: unknown[] }).ratedMovies.reduce<RatedMovie[]>((acc, item, index) => {
          if (typeof item !== 'object' || item === null) return acc
          const maybe = item as { showId?: unknown; title?: unknown; rating?: unknown }
          if (typeof maybe.title !== 'string' || typeof maybe.rating !== 'number') return acc

          acc.push({
            showId: typeof maybe.showId === 'number' ? maybe.showId : -(index + 1),
            title: maybe.title,
            rating: maybe.rating,
          })
          return acc
        }, [])
      : []

    const watchLater = Array.isArray((parsed as { watchLater?: unknown }).watchLater)
      ? (parsed as { watchLater: unknown[] }).watchLater.reduce<MovieListItem[]>((acc, item, index) => {
          const parsedItem = parseMovieListItem(item, -(index + 1))
          if (parsedItem) acc.push(parsedItem)
          return acc
        }, [])
      : []

    return { login, ratedMovies, watchLater }
  } catch {
    return null
  }
}
