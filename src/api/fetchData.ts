export type TvMazeShowSearchHit = {
  show: {
    name: string
  }
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null
}

function isTvMazeShowSearchHit(x: unknown): x is TvMazeShowSearchHit {
  if (!isRecord(x) || !isRecord(x.show)) return false
  return typeof x.show.name === 'string'
}

function parseShowSearchJson(data: unknown): TvMazeShowSearchHit[] {
  if (!Array.isArray(data)) return []
  return data.filter(isTvMazeShowSearchHit)
}

export async function fetchData(query: string): Promise<TvMazeShowSearchHit[]> {
  try {
    const response = await fetch('https://api.tvmaze.com/search/shows?q=' + query)
    const result: unknown = await response.json()
    return parseShowSearchJson(result)
  } catch (e) {
    console.error(e)
    return []
  }
}
