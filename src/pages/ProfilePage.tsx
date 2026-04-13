import { Card, Layout, List, Typography, theme } from 'antd'
import type { AuthData } from '../entities/user'

const { Content } = Layout

type ProfilePageProps = {
  authData: AuthData
}

export function ProfilePage({ authData }: ProfilePageProps) {
  const { token } = theme.useToken()

  return (
    <Content style={{ padding: token.paddingLG }}>
      <Card style={{ maxWidth: 720, marginInline: 'auto' }}>
        <Typography.Title level={3}>My profile</Typography.Title>
        <Typography.Title level={1} style={{ marginTop: 0, marginBottom: token.marginLG, fontSize: 56 }}>
          Hello, {authData.login}!
        </Typography.Title>

        <div style={{ display: 'grid', gap: token.marginMD }}>
          <Card size="small" title="Movies and your ratings">
            {authData.ratedMovies.length > 0 ? (
              <List
                size="small"
                dataSource={authData.ratedMovies}
                renderItem={(item) => (
                  <List.Item>
                    <Typography.Text>{item.title}</Typography.Text>
                    <Typography.Text type="secondary">Rating: {item.rating}</Typography.Text>
                  </List.Item>
                )}
              />
            ) : (
              <Typography.Text type="secondary">Empty for now</Typography.Text>
            )}
          </Card>

          <Card size="small" title="Watch later">
            {authData.watchLater.length > 0 ? (
              <List
                size="small"
                dataSource={authData.watchLater}
                renderItem={(item) => (
                  <List.Item>
                    <Typography.Text>{item}</Typography.Text>
                  </List.Item>
                )}
              />
            ) : (
              <Typography.Text type="secondary">Empty for now</Typography.Text>
            )}
          </Card>
        </div>
      </Card>
    </Content>
  )
}
