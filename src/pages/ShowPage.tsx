import { Button, Card, Empty, Layout, Select, Spin, Typography, theme } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useRef, useState, type WheelEvent } from 'react'
import { useParams } from 'react-router-dom'
import { concatGenres, fetchShowById, type EpisodeType, type ShowDetailsType } from '../entities/show'

const { Content } = Layout

function stripHtml(html?: string) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function formatEpisodeTitle(episode: EpisodeType) {
  const season = episode.season ?? 0
  const number = episode.number ?? 0
  return `S${String(season).padStart(2, '0')}E${String(number).padStart(2, '0')}`
}

export function ShowPage() {
  const { token } = theme.useToken()
  const { id } = useParams()
  const [showData, setShowData] = useState<ShowDetailsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSeason, setSelectedSeason] = useState<number>()
  const episodesCarouselRef = useRef<HTMLDivElement | null>(null)
  const metaTextStyle = { color: 'rgba(255,255,255,0.88)' }

  useEffect(() => {
    const showId = Number(id)
    if (!Number.isInteger(showId)) {
      setShowData(null)
      setLoading(false)
      return
    }

    let isActive = true

    const loadShow = async () => {
      setLoading(true)
      const res = await fetchShowById(showId)
      if (isActive) {
        setShowData(res)
        setLoading(false)
      }
    }

    loadShow()

    return () => {
      isActive = false
    }
  }, [id])

  useEffect(() => {
    if (!showData) {
      setSelectedSeason(undefined)
      return
    }

    const seasons = [...new Set(showData.show.episodes.map((episode) => episode.season).filter((x): x is number => typeof x === 'number'))]
      .sort((a, b) => a - b)

    if (seasons.length === 0) {
      setSelectedSeason(undefined)
      return
    }

    setSelectedSeason((prevSeason) =>
      typeof prevSeason === 'number' && seasons.includes(prevSeason) ? prevSeason : seasons[0],
    )
  }, [showData])

  const seasonOptions = useMemo(() => {
    if (!showData) return []

    return [...new Set(showData.show.episodes.map((episode) => episode.season).filter((x): x is number => typeof x === 'number'))]
      .sort((a, b) => a - b)
      .map((season) => ({ label: `Season ${season}`, value: season }))
  }, [showData])

  const filteredEpisodes = useMemo(() => {
    if (!showData) return []
    if (typeof selectedSeason !== 'number') return []
    return showData.show.episodes.filter((episode) => episode.season === selectedSeason)
  }, [showData, selectedSeason])

  const scrollEpisodes = (direction: 'left' | 'right') => {
    const container = episodesCarouselRef.current
    if (!container) return

    container.scrollBy({
      left: direction === 'right' ? 360 : -360,
      behavior: 'smooth',
    })
  }

  const handleEpisodesWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!episodesCarouselRef.current) return
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return

    event.preventDefault()
    episodesCarouselRef.current.scrollBy({
      left: event.deltaY,
      behavior: 'auto',
    })
  }

  return (
    <Content style={{ padding: token.paddingLG }}>
      {loading ? (
        <div
          style={{
            minHeight: 280,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: token.marginSM,
          }}
        >
          <Spin size="large" />
          <Typography.Text type="secondary">Loading show...</Typography.Text>
        </div>
      ) : showData ? (
        <div style={{ display: 'grid', gap: token.marginXL }}>
          <section
            className="show-hero"
            style={{
              backgroundImage: `url(${showData.show.img ?? 'https://placehold.co/1200x800?text=No+Poster'})`,
            }}
          >
            <div className="show-hero-overlay">
              <div className="show-hero-content">
                <div>
                  <Typography.Title level={1} style={{ marginBottom: token.marginSM, color: token.colorWhite }}>
                    {showData.show.name}
                  </Typography.Title>
                  <Typography.Paragraph style={{ color: 'rgba(255,255,255,0.88)' }}>
                    {stripHtml(showData.show.summary) || 'Synopsis not specified'}
                  </Typography.Paragraph>
                  <div
                    className="show-meta-grid"
                    style={{ marginTop: token.marginXL, maxWidth: 680 }}
                  >
                    <Typography.Text style={metaTextStyle}>
                      Genres: {showData.show.genres.length ? concatGenres(showData.show.genres) : 'Not specified'}
                    </Typography.Text>
                    <Typography.Text style={metaTextStyle}>
                      Year of start: {showData.show.premiered?.slice(0, 4) ?? 'Not specified'}
                    </Typography.Text>
                    <Typography.Text style={metaTextStyle}>
                      Country: {showData.show.country ?? 'Not specified'}
                    </Typography.Text>
                    <Typography.Text style={metaTextStyle}>
                      Language: {showData.show.language ?? 'Not specified'}
                    </Typography.Text>
                    <Typography.Text style={metaTextStyle}>
                      Status: {showData.show.status ?? 'Not specified'}
                    </Typography.Text>
                    <Typography.Text style={metaTextStyle}>
                      Rating: {showData.show.rating ?? 'Not specified'}
                    </Typography.Text>
                    <Typography.Text style={metaTextStyle}>
                      Network: {showData.show.network ?? 'Not specified'}
                    </Typography.Text>
                    <Typography.Text style={metaTextStyle}>
                      {showData.show.scheduleDays.length
                        ? `${showData.show.scheduleDays.join(', ')} ${showData.show.scheduleTime ?? ''}`
                        : 'Not specified'}
                    </Typography.Text>
                  </div>
                </div>
                <Card
                  className="show-poster-card"
                  style={{ width: 320, minWidth: 320 }}
                  styles={{ body: { display: 'none', padding: 0 } }}
                  cover={
                    <img
                      src={showData.show.img ?? 'https://placehold.co/420x590?text=No+Poster'}
                      alt={showData.show.name}
                      style={{ width: '100%', aspectRatio: '420 / 590', objectFit: 'cover', display: 'block' }}
                    />
                  }
                />
              </div>
            </div>
          </section>

          <section>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: token.marginSM,
                marginBottom: token.marginSM,
              }}
            >
              <Typography.Title level={3} style={{ margin: 0 }}>
                Episodes
              </Typography.Title>
              {seasonOptions.length > 0 && (
                <Select
                  value={selectedSeason}
                  onChange={(value) => setSelectedSeason(value)}
                  options={seasonOptions}
                  style={{ minWidth: 180 }}
                />
              )}
            </div>
            {filteredEpisodes.length > 0 ? (
              <div className="episodes-carousel-shell">
                <Button
                  type="default"
                  shape="circle"
                  icon={<LeftOutlined />}
                  onClick={() => scrollEpisodes('left')}
                />
                <div
                  ref={episodesCarouselRef}
                  className="episodes-carousel"
                  onWheel={handleEpisodesWheel}
                >
                  {filteredEpisodes.map((episode) => (
                    <Card
                      key={episode.id}
                      className="episode-card"
                      size="small"
                      styles={{
                        body: {
                          height: 165,
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: token.marginXXS,
                        },
                      }}
                      cover={
                        <img
                          src={episode.img ?? 'https://placehold.co/320x180?text=No+Image'}
                          alt={episode.name}
                          className="episode-card-image"
                        />
                      }
                    >
                      <Typography.Text
                        strong
                        ellipsis={{ tooltip: `${formatEpisodeTitle(episode)} - ${episode.name}` }}
                      >
                        {formatEpisodeTitle(episode)} - {episode.name}
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        {episode.airdate ?? 'Unknown air date'}
                        {episode.runtime ? ` • ${episode.runtime} min` : ''}
                      </Typography.Text>
                      {episode.summary && (
                        <Typography.Paragraph
                          style={{ marginBottom: 0 }}
                          ellipsis={{ rows: 3, tooltip: stripHtml(episode.summary) }}
                        >
                          {stripHtml(episode.summary)}
                        </Typography.Paragraph>
                      )}
                    </Card>
                  ))}
                </div>
                <Button
                  type="default"
                  shape="circle"
                  icon={<RightOutlined />}
                  onClick={() => scrollEpisodes('right')}
                />
              </div>
            ) : showData.show.episodes.length > 0 ? (
              <Empty
                description={<Typography.Text type="secondary">No episodes found for this season</Typography.Text>}
              />
            ) : (
              <Empty
                description={<Typography.Text type="secondary">No episodes found</Typography.Text>}
              />
            )}
          </section>
        </div>
      ) : (
        <Empty
          description={<Typography.Text type="secondary">Show not found</Typography.Text>}
        />
      )}
    </Content>
  )
}
