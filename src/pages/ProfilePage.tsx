import { Card, Layout, List, Typography, theme } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useContext, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../app/providers/AuthContext'
import type { AuthData } from '../entities/user'

const { Content } = Layout

type ProfilePageProps = {
  authData: AuthData
}

export function ProfilePage({ authData }: ProfilePageProps) {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const { toggleWatchLater } = useContext(AuthContext)
  const getScrollableStyle = (itemsCount: number): CSSProperties | undefined =>
    itemsCount > 5
      ? { maxHeight: 240, overflowY: 'auto', paddingRight: token.paddingXS }
      : undefined

  return (
    <Content style={{ padding: token.paddingLG }}>
      <Card style={{ maxWidth: 720, marginInline: 'auto' }}>
        <Typography.Title level={3}>My profile</Typography.Title>
        <Typography.Title level={2} style={{ marginTop: 0, marginBottom: token.marginLG }}>
          Hello, {authData.login}!
        </Typography.Title>

        <div style={{ display: 'grid', gap: token.marginMD }}>
          <Card size="small" title="Movies and your ratings">
            {authData.ratedMovies.length > 0 ? (
              <div style={getScrollableStyle(authData.ratedMovies.length)}>
                <List
                  size="small"
                  dataSource={authData.ratedMovies}
                  renderItem={(item) => (
                    <List.Item>
                      <Typography.Link onClick={() => navigate(`/show/${item.showId}`)}>
                        {item.title}
                      </Typography.Link>
                      <Typography.Text type="secondary">Your rating: {item.rating}/10</Typography.Text>
                    </List.Item>
                  )}
                />
              </div>
            ) : (
              <Typography.Text type="secondary">Empty for now</Typography.Text>
            )}
          </Card>

          <Card size="small" title="Watch later">
            {authData.watchLater.length > 0 ? (
              <div style={getScrollableStyle(authData.watchLater.length)}>
                <List
                  size="small"
                  dataSource={authData.watchLater}
                  renderItem={(item) => (
                    <List.Item>
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography.Link onClick={() => navigate(`/show/${item.showId}`)}>
                          {item.title}
                        </Typography.Link>
                        <Typography.Link
                          onClick={() => toggleWatchLater(item.showId, item.title)}
                          aria-label={`Remove ${item.title} from watch later`}
                          style={{ color: token.colorError }}
                        >
                          <CloseOutlined /> Remove
                        </Typography.Link>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            ) : (
              <Typography.Text type="secondary">Empty for now</Typography.Text>
            )}
          </Card>
        </div>
      </Card>
    </Content>
  )
}
