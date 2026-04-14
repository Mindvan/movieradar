import { Card, Checkbox, Slider, Typography, theme } from 'antd'
import type { ShowDetailsType } from '../../entities/show'
import type { CSSProperties } from 'react'
import { stripHtml } from './lib/text'

type ShowHeroSectionProps = {
  show: ShowDetailsType['show']
  mainInfo: {
    year: string
    country: string
    language: string
  }
  showRatingColor: string
  ratingDraft: number
  inWatchLater: boolean
  onGenreClick: (genre: string) => void
  onCountryClick: (country: string) => void
  onRatingPreviewChange: (rating: number) => void
  onRatingCommit: (rating: number) => void
  onToggleWatchLater: () => void
}

export function ShowHeroSection({
  show,
  mainInfo,
  showRatingColor,
  ratingDraft,
  inWatchLater,
  onGenreClick,
  onCountryClick,
  onRatingPreviewChange,
  onRatingCommit,
  onToggleWatchLater,
}: ShowHeroSectionProps) {
  const { token } = theme.useToken()
  const metaTextStyle: CSSProperties = { color: 'rgba(255,255,255,0.88)' }

  return (
    <section
      className="show-hero"
      style={{
        backgroundImage: `url(${show.img ?? 'https://placehold.co/1200x800?text=No+Poster'})`,
      }}
    >
      <div className="show-hero-overlay">
        <div className="show-hero-content">
          <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography.Title level={1} style={{ marginBottom: token.marginSM, color: token.colorWhite }}>
              {show.name}
            </Typography.Title>
            <Typography.Paragraph style={{ color: 'rgba(255,255,255,0.88)' }}>
              {stripHtml(show.summary) || 'Synopsis not specified'}
            </Typography.Paragraph>
            <div style={{ marginTop: token.marginLG, maxWidth: 680 }}>
              <div className="show-genres-row">
                {show.genres.length > 0 ? (
                  show.genres.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      className="show-genre-chip show-genre-chip--clickable"
                      onClick={() => onGenreClick(genre)}
                    >
                      {genre}
                    </button>
                  ))
                ) : (
                  <span className="show-genre-chip">Not specified</span>
                )}
              </div>
              <div className="show-main-info-line" style={{ marginTop: token.marginSM }}>
                <Typography.Text style={metaTextStyle}>{mainInfo.year}</Typography.Text>
                <Typography.Text style={metaTextStyle}>|</Typography.Text>
                {mainInfo.country !== 'Not specified' ? (
                  <button
                    type="button"
                    className="show-main-info-link"
                    onClick={() => onCountryClick(mainInfo.country)}
                  >
                    {mainInfo.country}
                  </button>
                ) : (
                  <Typography.Text style={metaTextStyle}>Not specified</Typography.Text>
                )}
                <Typography.Text style={metaTextStyle}>|</Typography.Text>
                <Typography.Text style={metaTextStyle}>{mainInfo.language}</Typography.Text>
              </div>
              <Typography.Text
                style={{
                  display: 'block',
                  marginTop: token.marginSM,
                  fontSize: 30,
                  lineHeight: 1.15,
                  fontWeight: 700,
                  color: showRatingColor,
                }}
              >
                Rating: {show.rating ? `${show.rating.toFixed(1)}/10` : 'Not specified'}
              </Typography.Text>
            </div>
            <div
              style={{
                marginTop: 'auto',
                paddingTop: token.marginLG,
                maxWidth: 680,
                display: 'grid',
                gap: token.marginXS,
              }}
            >
              <div className="show-rating-control">
                <Typography.Text style={metaTextStyle}>
                  Your rating: {ratingDraft}/10
                </Typography.Text>
                <Slider
                  className="show-rating-slider"
                  min={1}
                  max={10}
                  step={1}
                  value={ratingDraft}
                  tooltip={{ formatter: (value) => `${value}/10` }}
                  onChange={(value) => onRatingPreviewChange(Array.isArray(value) ? value[0] ?? 1 : value)}
                  onChangeComplete={(value) => onRatingCommit(Array.isArray(value) ? value[0] ?? 1 : value)}
                />
              </div>
              <Checkbox
                checked={inWatchLater}
                style={{ color: token.colorWhite, marginTop: token.marginXL }}
                onChange={onToggleWatchLater}
              >
                <span style={{ color: token.colorWhite }}>Watch later</span>
              </Checkbox>
            </div>
          </div>
          <Card
            className="show-poster-card"
            style={{ width: 320, minWidth: 320 }}
            styles={{ body: { display: 'none', padding: 0 } }}
            cover={
              <img
                src={show.img ?? 'https://placehold.co/420x590?text=No+Poster'}
                alt={show.name}
                style={{ width: '100%', aspectRatio: '420 / 590', objectFit: 'cover', display: 'block' }}
              />
            }
          />
        </div>
      </div>
    </section>
  )
}
