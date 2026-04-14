import { Card, List, Spin, Typography, theme } from 'antd'
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
  cardWidth,
  posterHeight,
  onOpenShow,
}: HomeDashboardProps) {
  const { token } = theme.useToken()

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
          <List
            grid={{ gutter: token.marginMD, xs: 1, sm: 2, md: 3, lg: 5 }}
            dataSource={todaySchedule}
            renderItem={(item) => (
              <List.Item key={`today-${item.id}`} style={{ height: '100%', display: 'flex', justifyContent: 'center' }}>
                <Card
                  className="movie-card"
                  hoverable
                  onClick={() => onOpenShow(item.show.id)}
                  style={{ width: cardWidth, height: '100%' }}
                  cover={
                    <div className="movie-card-poster-wrap">
                      <img
                        className="movie-card-poster"
                        src={item.img ?? item.show.img ?? 'https://placehold.co/210x295?text=No+Poster'}
                        alt={item.name}
                        style={{ width: cardWidth, height: posterHeight, objectFit: 'cover' }}
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
              </List.Item>
            )}
          />
        ) : (
          <Typography.Text type="secondary">No schedule entries for today</Typography.Text>
        )}
      </div>

      {recentlyViewed.length > 0 && (
        <div style={{ width: '100%', marginTop: token.marginLG }}>
          <Typography.Title level={3} style={{ marginBottom: token.marginSM }}>
            Recently viewed
          </Typography.Title>
          <List
            grid={{ gutter: token.marginMD, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={recentlyViewed.slice(0, 8)}
            renderItem={(item) => (
              <List.Item
                key={`recent-${item.showId}`}
                style={{ height: '100%', display: 'flex', justifyContent: 'center' }}
              >
                <Card
                  className="movie-card"
                  hoverable
                  onClick={() => onOpenShow(item.showId)}
                  style={{ width: cardWidth, height: '100%' }}
                  cover={
                    <div className="movie-card-poster-wrap">
                      <img
                        className="movie-card-poster"
                        src={item.img ?? 'https://placehold.co/210x295?text=No+Poster'}
                        alt={item.title}
                        style={{ width: cardWidth, height: posterHeight, objectFit: 'cover' }}
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
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  )
}
