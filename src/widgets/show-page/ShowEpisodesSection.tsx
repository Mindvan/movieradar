import { Button, Card, Empty, Select, Typography, theme } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useRef, type WheelEvent } from 'react'
import type { EpisodeType } from '../../entities/show'
import { formatEpisodeTitle, stripHtml } from './lib/text'

type ShowEpisodesSectionProps = {
  seasonOptions: Array<{ label: string; value: number }>
  selectedSeason?: number
  onSeasonChange: (season: number) => void
  filteredEpisodes: EpisodeType[]
  allEpisodesCount: number
}

export function ShowEpisodesSection({
  seasonOptions,
  selectedSeason,
  onSeasonChange,
  filteredEpisodes,
  allEpisodesCount,
}: ShowEpisodesSectionProps) {
  const { token } = theme.useToken()
  const episodesCarouselRef = useRef<HTMLDivElement | null>(null)

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
    <section>
      <div
        className="show-episodes-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: token.marginSM,
          marginBottom: token.marginSM,
          paddingInline: 40,
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Episodes
        </Typography.Title>
        {seasonOptions.length > 0 && (
          <Select
            value={selectedSeason}
            onChange={(value: number) => onSeasonChange(value)}
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
      ) : allEpisodesCount > 0 ? (
        <Empty
          description={<Typography.Text type="secondary">No episodes found for this season</Typography.Text>}
        />
      ) : (
        <Empty
          description={<Typography.Text type="secondary">No episodes found</Typography.Text>}
        />
      )}
    </section>
  )
}
