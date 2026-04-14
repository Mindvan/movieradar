export type RecentlyViewedShow = {
  showId: number
  title: string
  img?: string
  country?: string
  visitedAt: number
}

export const RECENTLY_VIEWED_STORAGE_KEY = 'recently-viewed-shows'

function resolveViewerKey(login?: string): string {
  const trimmedLogin = login?.trim()
  return trimmedLogin ? `user:${trimmedLogin}` : 'guest'
}

function parseHistoryEntry(item: unknown): RecentlyViewedShow | null {
  if (typeof item !== 'object' || item === null) return null
  const maybe = item as {
    showId?: unknown
    title?: unknown
    img?: unknown
    country?: unknown
    visitedAt?: unknown
  }

  if (typeof maybe.showId !== 'number' || typeof maybe.title !== 'string' || typeof maybe.visitedAt !== 'number') {
    return null
  }

  return {
    showId: maybe.showId,
    title: maybe.title,
    img: typeof maybe.img === 'string' ? maybe.img : undefined,
    country: typeof maybe.country === 'string' ? maybe.country : undefined,
    visitedAt: maybe.visitedAt,
  }
}

export function readRecentlyViewedShows(login?: string): RecentlyViewedShow[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY)
  if (!raw) return []

  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return []

    const historyByViewer = parsed as Record<string, unknown>
    const history = historyByViewer[resolveViewerKey(login)]
    if (!Array.isArray(history)) return []

    return history
      .map(parseHistoryEntry)
      .filter((item): item is RecentlyViewedShow => item !== null)
      .sort((a, b) => b.visitedAt - a.visitedAt)
  } catch {
    return []
  }
}

export function addRecentlyViewedShow(
  show: Omit<RecentlyViewedShow, 'visitedAt'>,
  login?: string,
  maxItems = 12,
): void {
  if (typeof window === 'undefined') return

  const viewerKey = resolveViewerKey(login)
  const currentHistory = readRecentlyViewedShows(login).filter((item) => item.showId !== show.showId)
  const nextHistory = [{ ...show, visitedAt: Date.now() }, ...currentHistory].slice(0, maxItems)

  const raw = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY)
  let parsed: Record<string, unknown> = {}
  if (raw) {
    try {
      const maybeParsed: unknown = JSON.parse(raw)
      if (typeof maybeParsed === 'object' && maybeParsed !== null) {
        parsed = maybeParsed as Record<string, unknown>
      }
    } catch {
      parsed = {}
    }
  }

  parsed[viewerKey] = nextHistory
  localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(parsed))
}
