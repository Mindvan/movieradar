export type ShowType = {
  show: {
    id: number
    name: string
    genres: string[]
    img?: string
    country?: string
  }
}

type ParsedShow = ShowType['show']

export type EpisodeType = {
  id: number
  name: string
  season?: number
  number?: number
  airdate?: string
  runtime?: number
  summary?: string
  img?: string
}

export type ShowDetailsType = {
  show: ParsedShow & {
    summary?: string
    language?: string
    status?: string
    premiered?: string
    ended?: string
    runtime?: number
    rating?: number
    network?: string
    scheduleDays: string[]
    scheduleTime?: string
    episodes: EpisodeType[]
  }
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null
}

function parseShow(s: unknown): ParsedShow | null {
  if (!isRecord(s)) return null

  if (typeof s.id !== 'number' || typeof s.name !== 'string') return null

  const genres = Array.isArray(s.genres)
    ? s.genres.filter((g): g is string => typeof g === 'string')
    : []

  let img: string | undefined
  if (isRecord(s.image) && typeof s.image.medium === 'string') {
    img = s.image.medium
  }

  let country: string | undefined
  if (
    isRecord(s.network) &&
    isRecord(s.network.country) &&
    typeof s.network.country.name === 'string'
  ) {
    country = s.network.country.name
  } else if (
    isRecord(s.webChannel) &&
    isRecord(s.webChannel.country) &&
    typeof s.webChannel.country.name === 'string'
  ) {
    country = s.webChannel.country.name
  }

  return { id: s.id, name: s.name, genres, img, country }
}

function parseEpisodes(x: unknown): EpisodeType[] {
  if (!Array.isArray(x)) return []

  return x
    .map((episode): EpisodeType | null => {
      if (!isRecord(episode) || typeof episode.id !== 'number' || typeof episode.name !== 'string') {
        return null
      }

      return {
        id: episode.id,
        name: episode.name,
        season: typeof episode.season === 'number' ? episode.season : undefined,
        number: typeof episode.number === 'number' ? episode.number : undefined,
        airdate: typeof episode.airdate === 'string' ? episode.airdate : undefined,
        runtime: typeof episode.runtime === 'number' ? episode.runtime : undefined,
        summary: typeof episode.summary === 'string' ? episode.summary : undefined,
        img:
          isRecord(episode.image) && typeof episode.image.medium === 'string'
            ? episode.image.medium
            : undefined,
      }
    })
    .filter((episode): episode is EpisodeType => episode !== null)
}

function getSearchShowFields(x: unknown): ShowType | null {
  if (!isRecord(x) || !('show' in x)) return null
  const parsedShow = parseShow(x.show)
  return parsedShow ? { show: parsedShow } : null
}

function getIndexShowFields(x: unknown): ShowType | null {
  const parsedShow = parseShow(x)
  return parsedShow ? { show: parsedShow } : null
}

function parseSearchData(data: unknown): ShowType[] {
  if (!Array.isArray(data)) return []
  return data.map(getSearchShowFields).filter((x): x is ShowType => x !== null)
}

function parseIndexData(data: unknown): ShowType[] {
  if (!Array.isArray(data)) return []
  return data.map(getIndexShowFields).filter((x): x is ShowType => x !== null)
}

export async function fetchData(query: string, signal?: AbortSignal): Promise<ShowType[]> {
  try {
    const response = await fetch('https://api.tvmaze.com/search/shows?q=' + query, { signal })
    const result: unknown = await response.json()
    return parseSearchData(result)
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      return []
    }
    console.error(e)
    return []
  }
}

export async function fetchShowsPage(page: number): Promise<ShowType[] | null> {
  try {
    const response = await fetch(`https://api.tvmaze.com/shows?page=${page}`)
    if (response.status === 404) return null
    const result: unknown = await response.json()
    return parseIndexData(result)
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function fetchShowById(id: number): Promise<ShowDetailsType | null> {
  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${id}?embed=episodes`)
    if (!response.ok) return null
    const result: unknown = await response.json()
    const parsedShow = parseShow(result)
    if (!parsedShow || !isRecord(result)) return null

    const scheduleDays =
      isRecord(result.schedule) && Array.isArray(result.schedule.days)
        ? result.schedule.days.filter((x): x is string => typeof x === 'string')
        : []

    const episodes = isRecord(result._embedded) ? parseEpisodes(result._embedded.episodes) : []

    return {
      show: {
        ...parsedShow,
        summary: typeof result.summary === 'string' ? result.summary : undefined,
        language: typeof result.language === 'string' ? result.language : undefined,
        status: typeof result.status === 'string' ? result.status : undefined,
        premiered: typeof result.premiered === 'string' ? result.premiered : undefined,
        ended: typeof result.ended === 'string' ? result.ended : undefined,
        runtime: typeof result.runtime === 'number' ? result.runtime : undefined,
        rating:
          isRecord(result.rating) && typeof result.rating.average === 'number'
            ? result.rating.average
            : undefined,
        network: isRecord(result.network) && typeof result.network.name === 'string' ? result.network.name : undefined,
        scheduleDays,
        scheduleTime:
          isRecord(result.schedule) && typeof result.schedule.time === 'string' ? result.schedule.time : undefined,
        episodes,
      },
    }
  } catch (e) {
    console.error(e)
    return null
  }
}
