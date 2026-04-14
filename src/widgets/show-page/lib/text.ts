import type { EpisodeType } from '../../../entities/show'

export function stripHtml(html?: string) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function formatEpisodeTitle(episode: EpisodeType) {
  const season = episode.season ?? 0
  const number = episode.number ?? 0
  return `S${String(season).padStart(2, '0')}E${String(number).padStart(2, '0')}`
}
