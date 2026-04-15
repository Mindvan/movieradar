import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Card, Spin, Typography, theme } from 'antd'
import { useEffect, useState } from 'react'
import type { WebScheduleItemType } from '../../entities/show'
import type { RecentlyViewedShow } from '../../entities/user'

type HomeDashboardProps = {
  todayScheduleLoading: boolean
  todaySchedule: WebScheduleItemType[]
  recentlyViewed: RecentlyViewedShow[]
  cardWidth: number
  posterHeight: number
  onOpenShow: (showId: number) => void
}

function stripHtml(html?: string) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function HomeDashboard({
  todayScheduleLoading,
  todaySchedule,
  recentlyViewed,
  cardWidth: _cardWidth,
  posterHeight,
  onOpenShow,
}: HomeDashboardProps) {
  const { token } = theme.useToken()
  const [isSliderMode, setIsSliderMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= 450
  })
  const [activeScheduleSlide, setActiveScheduleSlide] = useState(0)
  const [scheduleSlidePhase, setScheduleSlidePhase] = useState<'idle' | 'leaving' | 'entering'>('idle')
  const [activeRecentSlide, setActiveRecentSlide] = useState(0)
  const [recentSlidePhase, setRecentSlidePhase] = useState<'idle' | 'leaving' | 'entering'>('idle')

  useEffect(() => {
    const onResize = () => {
      setIsSliderMode(window.innerWidth <= 450)
    }

    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    setActiveScheduleSlide(0)
  }, [todaySchedule.length])

  const recentItems = recentlyViewed.slice(0, 5)

  useEffect(() => {
    setActiveRecentSlide(0)
  }, [recentItems.length])

  const scheduleSlideCount = todaySchedule.length
  const currentScheduleSlide = todaySchedule[activeScheduleSlide]
  const recentSlideCount = recentItems.length
  const currentRecentSlide = recentItems[activeRecentSlide]

  const switchScheduleSlide = (direction: 'prev' | 'next') => {
    if (scheduleSlideCount <= 1 || scheduleSlidePhase !== 'idle') return
    setScheduleSlidePhase('leaving')
    window.setTimeout(() => {
      setActiveScheduleSlide((prev) => {
        if (direction === 'next') return (prev + 1) % scheduleSlideCount
        return (prev - 1 + scheduleSlideCount) % scheduleSlideCount
      })
      setScheduleSlidePhase('entering')
      window.setTimeout(() => {
        setScheduleSlidePhase('idle')
      }, 180)
    }, 180)
  }

  const switchRecentSlide = (direction: 'prev' | 'next') => {
    if (recentSlideCount <= 1 || recentSlidePhase !== 'idle') return
    setRecentSlidePhase('leaving')
    window.setTimeout(() => {
      setActiveRecentSlide((prev) => {
        if (direction === 'next') return (prev + 1) % recentSlideCount
        return (prev - 1 + recentSlideCount) % recentSlideCount
      })
      setRecentSlidePhase('entering')
      window.setTimeout(() => {
        setRecentSlidePhase('idle')
      }, 180)
    }, 180)
  }

  return (
    <div
      style={{
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: token.marginXS,
      }}
    >
      <Typography.Title level={1} style={{ marginBottom: token.marginXXS }}>
        Welcome!
      </Typography.Title>
      <Typography.Text style={{ fontSize: token.fontSizeLG }}>
        Welcome to MovieRadar, a React platform to check info of your favorite shows!
      </Typography.Text>
      <Typography.Text type="secondary">
        (используется tvmazeAPI)
      </Typography.Text>

      <div style={{ width: '100%', marginTop: token.marginLG }}>
        <Typography.Title level={3} style={{ marginBottom: token.marginSM }}>
          Schedule for today
        </Typography.Title>
        {todayScheduleLoading ? (
          <Spin />
        ) : todaySchedule.length > 0 ? (
          isSliderMode && currentScheduleSlide ? (
            <div className="home-schedule-slider">
              <Button
                shape="circle"
                icon={<LeftOutlined />}
                onClick={() => switchScheduleSlide('prev')}
              />
              <div className={`home-schedule-slider-card home-schedule-slider-card--${scheduleSlidePhase}`}>
                <Card
                  className="movie-card"
                  hoverable
                  onClick={() => onOpenShow(currentScheduleSlide.show.id)}
                  style={{ width: '100%', height: '100%' }}
                  cover={
                    <div className="movie-card-poster-wrap">
                      <img
                        className="movie-card-poster"
                        src={currentScheduleSlide.img ?? currentScheduleSlide.show.img ?? 'https://placehold.co/210x295?text=No+Poster'}
                        alt={currentScheduleSlide.name}
                        style={{ width: '100%', height: posterHeight, objectFit: 'cover' }}
                      />
                    </div>
                  }
                >
                  <Typography.Text strong ellipsis={{ tooltip: currentScheduleSlide.name }}>
                    {currentScheduleSlide.name}
                  </Typography.Text>
                  <br />
                  <Typography.Text ellipsis={{ tooltip: currentScheduleSlide.show.name }}>
                    {currentScheduleSlide.show.name}
                  </Typography.Text>
                  <br />
                  <Typography.Text type="secondary">
                    {currentScheduleSlide.airdate ?? 'Unknown date'} {currentScheduleSlide.airtime ? `• ${currentScheduleSlide.airtime}` : ''}
                  </Typography.Text>
                  <Typography.Paragraph
                    type="secondary"
                    style={{ marginBottom: 0, marginTop: token.marginXS }}
                    ellipsis={{ rows: 2, tooltip: stripHtml(currentScheduleSlide.summary) }}
                  >
                    {stripHtml(currentScheduleSlide.summary) || 'No description'}
                  </Typography.Paragraph>
                </Card>
              </div>
              <Button
                shape="circle"
                icon={<RightOutlined />}
                onClick={() => switchScheduleSlide('next')}
              />
            </div>
          ) : (
          <div className="home-schedule-list">
            {todaySchedule.map((item) => (
              <div key={`today-${item.id}`} className="home-schedule-item">
                <Card
                  className="movie-card"
                  hoverable
                  onClick={() => onOpenShow(item.show.id)}
                  style={{ width: '100%', height: '100%' }}
                  cover={
                    <div className="movie-card-poster-wrap">
                      <img
                        className="movie-card-poster"
                        src={item.img ?? item.show.img ?? 'https://placehold.co/210x295?text=No+Poster'}
                        alt={item.name}
                        style={{ width: '100%', height: posterHeight, objectFit: 'cover' }}
                      />
                    </div>
                  }
                >
                  <Typography.Text strong ellipsis={{ tooltip: item.name }}>
                    {item.name}
                  </Typography.Text>
                  <br />
                  <Typography.Text ellipsis={{ tooltip: item.show.name }}>
                    {item.show.name}
                  </Typography.Text>
                  <br />
                  <Typography.Text type="secondary">
                    {item.airdate ?? 'Unknown date'} {item.airtime ? `• ${item.airtime}` : ''}
                  </Typography.Text>
                  <Typography.Paragraph
                    type="secondary"
                    style={{ marginBottom: 0, marginTop: token.marginXS }}
                    ellipsis={{ rows: 2, tooltip: stripHtml(item.summary) }}
                  >
                    {stripHtml(item.summary) || 'No description'}
                  </Typography.Paragraph>
                </Card>
              </div>
            ))}
          </div>
          )
        ) : (
          <Typography.Text type="secondary">No schedule entries for today</Typography.Text>
        )}
      </div>

      <div style={{ width: '100%', marginTop: token.marginLG }}>
        <Typography.Title level={3} style={{ marginBottom: token.marginSM }}>
          Recently viewed
        </Typography.Title>
        {recentlyViewed.length === 0 ? (
          <Typography.Text type="secondary">Nothing recently viewed</Typography.Text>
        ) : isSliderMode && currentRecentSlide ? (
            <div className="home-schedule-slider">
              <Button
                shape="circle"
                icon={<LeftOutlined />}
                onClick={() => switchRecentSlide('prev')}
              />
              <div className={`home-schedule-slider-card home-schedule-slider-card--${recentSlidePhase}`}>
                <Card
                  className="movie-card"
                  hoverable
                  onClick={() => onOpenShow(currentRecentSlide.showId)}
                  style={{ width: '100%', height: '100%' }}
                  cover={
                    <div className="movie-card-poster-wrap">
                      <img
                        className="movie-card-poster"
                        src={currentRecentSlide.img ?? 'https://placehold.co/210x295?text=No+Poster'}
                        alt={currentRecentSlide.title}
                        style={{ width: '100%', height: posterHeight, objectFit: 'cover' }}
                      />
                    </div>
                  }
                >
                  <Typography.Text strong ellipsis={{ tooltip: currentRecentSlide.title }}>
                    {currentRecentSlide.title}
                  </Typography.Text>
                  <br />
                  <Typography.Text type="secondary">
                    {currentRecentSlide.country ?? 'Country not specified'}
                  </Typography.Text>
                </Card>
              </div>
              <Button
                shape="circle"
                icon={<RightOutlined />}
                onClick={() => switchRecentSlide('next')}
              />
            </div>
          ) : (
            <div className="home-schedule-list">
              {recentItems.map((item) => (
                <div key={`recent-${item.showId}`} className="home-schedule-item">
                  <Card
                    className="movie-card"
                    hoverable
                    onClick={() => onOpenShow(item.showId)}
                    style={{ width: '100%', height: '100%' }}
                    cover={
                      <div className="movie-card-poster-wrap">
                        <img
                          className="movie-card-poster"
                          src={item.img ?? 'https://placehold.co/210x295?text=No+Poster'}
                          alt={item.title}
                          style={{ width: '100%', height: posterHeight, objectFit: 'cover' }}
                        />
                      </div>
                    }
                  >
                    <Typography.Text strong ellipsis={{ tooltip: item.title }}>
                      {item.title}
                    </Typography.Text>
                    <br />
                    <Typography.Text type="secondary">
                      {item.country ?? 'Country not specified'}
                    </Typography.Text>
                  </Card>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}
