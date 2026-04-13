import type { AuthData, RatedMovie } from '../model/auth'

export const AUTH_STORAGE_KEY = 'auth-user'

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
      ? (parsed as { ratedMovies: unknown[] }).ratedMovies.filter((item): item is RatedMovie => {
          if (typeof item !== 'object' || item === null) return false
          const maybe = item as { title?: unknown; rating?: unknown }
          return typeof maybe.title === 'string' && typeof maybe.rating === 'number'
        })
      : []

    const watchLater = Array.isArray((parsed as { watchLater?: unknown }).watchLater)
      ? (parsed as { watchLater: unknown[] }).watchLater.filter((x): x is string => typeof x === 'string')
      : []

    return { login, ratedMovies, watchLater }
  } catch {
    return null
  }
}
