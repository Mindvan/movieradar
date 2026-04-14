import { Card, Empty, Input, Layout, List, Spin, Typography, theme } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchSchedule, type WebScheduleItemType } from '../entities/show'

const { Content } = Layout

function currentDateIso() {
  return new Date().toISOString().slice(0, 10)
}

function stripHtml(html?: string) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function SchedulePage() {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const [date, setDate] = useState(currentDateIso())
  const [loading, setLoading] = useState(false)
  const [episodes, setEpisodes] = useState<WebScheduleItemType[]>([])

  useEffect(() => {
    let isActive = true
    const loadSchedule = async () => {
      setLoading(true)
      const data = await fetchSchedule(date || undefined, 'RU')
      if (isActive) {
        setEpisodes(data)
        setLoading(false)
      }
    }
    loadSchedule()

    return () => {
      isActive = false
    }
  }, [date])

  return (
    <Content style={{ padding: token.paddingLG }}>
      <div className="app-main-container" style={{ display: 'grid', gap: token.marginLG }}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          Schedule
        </Typography.Title>

        <Card size="small">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: token.marginSM }}>
            <Input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              style={{ width: 190 }}
            />
            <Typography.Text type="secondary" style={{ alignSelf: 'center' }}>
              Searching for releases in Russia only
            </Typography.Text>
          </div>
        </Card>

        {loading ? (
          <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin size="large" />
          </div>
        ) : episodes.length > 0 ? (
          <List
            size="small"
            dataSource={episodes}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <Card
                  className="schedule-card"
                  hoverable
                  onClick={() => navigate(`/show/${item.show.id}`)}
                  style={{ width: '100%' }}
                >
                  <div className="schedule-card-layout">
                    <img
                      className="schedule-card-image"
                      src={item.img ?? item.show.img ?? 'https://placehold.co/420x236?text=No+Image'}
                      alt={item.name}
                    />
                    <div className="schedule-card-content">
                      <Typography.Text strong ellipsis={{ tooltip: item.name }}>
                        {item.name}
                      </Typography.Text>
                      <Typography.Text ellipsis={{ tooltip: item.show.name }}>
                        {item.show.name}
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        {item.airdate ?? 'Unknown date'} {item.airtime ? `• ${item.airtime}` : ''}
                      </Typography.Text>
                      <Typography.Paragraph
                        type="secondary"
                        style={{ marginBottom: 0, marginTop: token.marginXS }}
                        ellipsis={{ rows: 3, tooltip: stripHtml(item.summary) }}
                      >
                        {stripHtml(item.summary) || 'No description'}
                      </Typography.Paragraph>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Empty description={<Typography.Text type="secondary">No schedule entries found</Typography.Text>} />
        )}
      </div>
    </Content>
  )
}
