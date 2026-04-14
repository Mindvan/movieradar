import { Card, Checkbox, List, Typography, theme } from 'antd'
import { concatGenres, type ShowType } from '../../entities/show'
import type { AuthData } from '../../entities/user'

type ShowCatalogGridProps = {
  data: ShowType[]
  cardWidth: number
  posterHeight: number
  authData: AuthData | null
  isAuthorized: boolean
  onOpenShow: (showId: number) => void
  onRequireLogin: () => void
  onToggleWatchLater: (showId: number, title: string) => void
}

export function ShowCatalogGrid({
  data,
  cardWidth,
  posterHeight,
  authData,
  isAuthorized,
  onOpenShow,
  onRequireLogin,
  onToggleWatchLater,
}: ShowCatalogGridProps) {
  const { token } = theme.useToken()

  return (
    <List
      grid={{ gutter: token.marginLG, xs: 1, sm: 2, md: 3, lg: 4 }}
      dataSource={data}
      renderItem={({ show }) => (
        <List.Item
          key={show.id}
          style={{ height: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Card
            hoverable
            className="movie-card"
            onClick={() => onOpenShow(show.id)}
            style={{ height: '100%', width: cardWidth }}
            styles={{
              body: {
                minHeight: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: token.marginXXS,
              },
            }}
            cover={
              <div className="movie-card-poster-wrap">
                <div className="movie-card-watchlater-overlay">
                  <Checkbox
                    checked={authData?.watchLater.some((item) => item.showId === show.id) ?? false}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => {
                      event.stopPropagation()
                      if (!isAuthorized) {
                        onRequireLogin()
                        return
                      }
                      onToggleWatchLater(show.id, show.name)
                    }}
                  >
                    <span className="movie-card-watchlater-label">Watch later</span>
                  </Checkbox>
                </div>
                <img
                  className="movie-card-poster"
                  src={show.img ?? 'https://placehold.co/210x295?text=No+Poster'}
                  alt={show.name}
                  style={{ width: cardWidth, height: posterHeight, objectFit: 'cover' }}
                />
              </div>
            }
          >
            <Typography.Text strong ellipsis={{ tooltip: show.name }}>
              {show.name}
            </Typography.Text>
            <Typography.Text
              type="secondary"
              ellipsis={{ tooltip: show.genres.join(', ') || 'Genre not specified' }}
            >
              {show.genres.length > 0 ? concatGenres(show.genres) : 'Genre not specified'}
            </Typography.Text>
            <Typography.Text type="secondary" italic>
              {show.country ?? 'Country not specified'}
            </Typography.Text>
          </Card>
        </List.Item>
      )}
    />
  )
}
