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

export type WebScheduleItemType = {
  id: number
  name: string
  season?: number
  number?: number
  airdate?: string
  airtime?: string
  runtime?: number
  summary?: string
  img?: string
  show: {
    id: number
    name: string
    img?: string
    country?: string
  }
}

export type ShowCastType = {
  personId: number
  personName: string
  characterName: string
  personImg?: string
}

export type ShowCrewType = {
  personId: number
  personName: string
  type: string
  personImg?: string
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
    cast: ShowCastType[]
    crew: ShowCrewType[]
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

function parseScheduleData(data: unknown): WebScheduleItemType[] {
  if (!Array.isArray(data)) return []

  return data
    .map((item): WebScheduleItemType | null => {
      if (!isRecord(item)) return null
      const show = isRecord(item.show)
        ? item.show
        : isRecord(item._embedded) && isRecord(item._embedded.show)
          ? item._embedded.show
          : null
      if (!show) return null
      if (
        typeof item.id !== 'number' ||
        typeof item.name !== 'string' ||
        typeof show.id !== 'number' ||
        typeof show.name !== 'string'
      ) {
        return null
      }

      return {
        id: item.id,
        name: item.name,
        season: typeof item.season === 'number' ? item.season : undefined,
        number: typeof item.number === 'number' ? item.number : undefined,
        airdate: typeof item.airdate === 'string' ? item.airdate : undefined,
        airtime: typeof item.airtime === 'string' ? item.airtime : undefined,
        runtime: typeof item.runtime === 'number' ? item.runtime : undefined,
        summary: typeof item.summary === 'string' ? item.summary : undefined,
        img: isRecord(item.image) && typeof item.image.medium === 'string' ? item.image.medium : undefined,
        show: {
          id: show.id,
          name: show.name,
          img: isRecord(show.image) && typeof show.image.medium === 'string' ? show.image.medium : undefined,
          country:
            isRecord(show.network) && isRecord(show.network.country) && typeof show.network.country.name === 'string'
              ? show.network.country.name
              : isRecord(show.webChannel) &&
                  isRecord(show.webChannel.country) &&
                  typeof show.webChannel.country.name === 'string'
                ? show.webChannel.country.name
                : undefined,
        },
      }
    })
    .filter((item): item is WebScheduleItemType => item !== null)
}

function parseCast(x: unknown): ShowCastType[] {
  if (!Array.isArray(x)) return []

  return x
    .map((item): ShowCastType | null => {
      if (!isRecord(item) || !isRecord(item.person) || !isRecord(item.character)) return null
      if (
        typeof item.person.id !== 'number' ||
        typeof item.person.name !== 'string' ||
        typeof item.character.name !== 'string'
      ) {
        return null
      }

      return {
        personId: item.person.id,
        personName: item.person.name,
        characterName: item.character.name,
        personImg:
          isRecord(item.person.image) && typeof item.person.image.medium === 'string'
            ? item.person.image.medium
            : undefined,
      }
    })
    .filter((item): item is ShowCastType => item !== null)
}

function parseCrew(x: unknown): ShowCrewType[] {
  if (!Array.isArray(x)) return []

  return x
    .map((item): ShowCrewType | null => {
      if (!isRecord(item) || !isRecord(item.person)) return null
      if (
        typeof item.person.id !== 'number' ||
        typeof item.person.name !== 'string' ||
        typeof item.type !== 'string'
      ) {
        return null
      }

      return {
        personId: item.person.id,
        personName: item.person.name,
        type: item.type,
        personImg:
          isRecord(item.person.image) && typeof item.person.image.medium === 'string'
            ? item.person.image.medium
            : undefined,
      }
    })
    .filter((item): item is ShowCrewType => item !== null)
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

export async function fetchSchedule(date?: string, country?: string): Promise<WebScheduleItemType[]> {
  try {
    const params = new URLSearchParams()
    if (date) params.set('date', date)
    if (country !== undefined) params.set('country', country)

    const queryString = params.toString()
    const response = await fetch(`https://api.tvmaze.com/schedule${queryString ? `?${queryString}` : ''}`)
    if (!response.ok) return []
    const result: unknown = await response.json()
    return parseScheduleData(result)
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function fetchShowById(id: number): Promise<ShowDetailsType | null> {
  try {
    const [showResponse, castResponse, crewResponse] = await Promise.all([
      fetch(`https://api.tvmaze.com/shows/${id}?embed=episodes`),
      fetch(`https://api.tvmaze.com/shows/${id}/cast`),
      fetch(`https://api.tvmaze.com/shows/${id}/crew`),
    ])
    if (!showResponse.ok) return null

    const result: unknown = await showResponse.json()
    const castResult: unknown = castResponse.ok ? await castResponse.json() : []
    const crewResult: unknown = crewResponse.ok ? await crewResponse.json() : []
    const parsedShow = parseShow(result)
    if (!parsedShow || !isRecord(result)) return null

    const scheduleDays =
      isRecord(result.schedule) && Array.isArray(result.schedule.days)
        ? result.schedule.days.filter((x): x is string => typeof x === 'string')
        : []

    const episodes = isRecord(result._embedded) ? parseEpisodes(result._embedded.episodes) : []
    const cast = parseCast(castResult)
    const crew = parseCrew(crewResult)

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
        cast,
        crew,
      },
    }
  } catch (e) {
    console.error(e)
    return null
  }
}
