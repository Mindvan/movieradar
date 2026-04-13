import { Card, Empty, Layout, List, Select, Spin, Typography, theme } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../features/show-search'
import { concatGenres } from '../entities/show'

const { Content } = Layout
const posterHeight = 320
const cardWidth = 230

type ShowListPageProps = {
  search: string
}

export function ShowListPage({ search }: ShowListPageProps) {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const { data, loading, loadingMore, hasMore, loadMore } = useSearch(search)
  const trimmedSearch = search.trim()
  const hasSearch = trimmedSearch.length > 0
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null)

  const countryOptions = useMemo(
    () =>
      [...new Set(data.map(({ show }) => show.country).filter((country): country is string => !!country))]
        .sort((a, b) => a.localeCompare(b))
        .map((country) => ({ label: country, value: country })),
    [data],
  )

  const genreOptions = useMemo(
    () =>
      [...new Set(data.flatMap(({ show }) => show.genres))]
        .sort((a, b) => a.localeCompare(b))
        .map((genre) => ({ label: genre, value: genre })),
    [data],
  )

  const filteredData = useMemo(
    () =>
      data.filter(({ show }) => {
        if (selectedCountries.length > 0 && (!show.country || !selectedCountries.includes(show.country))) {
          return false
        }
        if (selectedGenres.length > 0 && !selectedGenres.some((genre) => show.genres.includes(genre))) return false
        return true
      }),
    [data, selectedCountries, selectedGenres],
  )

  useEffect(() => {
    if (!hasSearch) {
      setSelectedCountries([])
      setSelectedGenres([])
      return
    }

    setSelectedCountries((prevCountries) =>
      prevCountries.filter((country) => countryOptions.some(({ value }) => value === country)),
    )
    setSelectedGenres((prevGenres) =>
      prevGenres.filter((genre) => genreOptions.some(({ value }) => value === genre)),
    )
  }, [hasSearch, countryOptions, genreOptions])

  useEffect(() => {
    if (!hasSearch || loading || !hasMore) return

    const target = loadMoreTriggerRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loadingMore) {
          loadMore()
        }
      },
      {
        root: null,
        rootMargin: '300px 0px',
        threshold: 0,
      },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [hasSearch, loading, hasMore, loadingMore, loadMore])

  return (
    <Content style={{ padding: token.paddingLG }}>
      <div className="app-main-container">
      {hasSearch && !loading && data.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: token.marginSM,
            marginBottom: token.marginLG,
          }}
        >
          <Select
            mode="multiple"
            allowClear
            maxTagCount="responsive"
            placeholder="Choose countries"
            options={countryOptions}
            value={selectedCountries}
            onChange={(value) => setSelectedCountries(value)}
            style={{ minWidth: 260 }}
          />
          <Select
            mode="multiple"
            allowClear
            maxTagCount="responsive"
            placeholder="Choose genres"
            options={genreOptions}
            value={selectedGenres}
            onChange={(value) => setSelectedGenres(value)}
            style={{ minWidth: 260 }}
          />
        </div>
      )}

      {!hasSearch ? (
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
        </div>
      ) : loading ? (
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
          <Typography.Text type="secondary">Loading...</Typography.Text>
        </div>
      ) : filteredData.length > 0 ? (
        <List
          grid={{ gutter: token.marginLG, xs: 1, sm: 2, md: 3, lg: 4 }}
          dataSource={filteredData}
          renderItem={({ show }) => (
            <List.Item
              key={show.id}
              style={{ height: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <Card
                hoverable
                className="movie-card"
                onClick={() => navigate(`/show/${show.id}`)}
                style={{ height: '100%', width: cardWidth }}
                styles={{ body: { minHeight: 100 } }}
                cover={
                  <div className="movie-card-poster-wrap">
                    <img
                      className="movie-card-poster"
                      src={show.img ?? 'https://placehold.co/210x295?text=No+Poster'}
                      alt={show.name}
                      style={{ width: cardWidth, height: posterHeight, objectFit: 'cover' }}
                    />
                  </div>
                }
              >
                <Card.Meta
                  title={<Typography.Text ellipsis={{ tooltip: show.name }}>{show.name}</Typography.Text>}
                  description={
                    <div>
                      <Typography.Text
                        type="secondary"
                        ellipsis={{ tooltip: show.genres.join(', ') || 'Genre not specified' }}
                      >
                        {show.genres.length > 0 ? concatGenres(show.genres) : 'Genre not specified'}
                      </Typography.Text>
                      <br />
                      <Typography.Text type="secondary" italic>
                        {show.country ?? 'Country not specified'}
                      </Typography.Text>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty
          description={
            <Typography.Text type="secondary">
              {data.length === 0
                ? 'Nothing found for your request. Try searching the entire database below.'
                : 'Nothing found for the selected countries and/or genres'}
            </Typography.Text>
          }
        />
      )}

      {hasSearch && !loading && hasMore && (
        <div
          ref={loadMoreTriggerRef}
          style={{
            marginTop: token.marginLG,
            display: 'flex',
            justifyContent: 'center',
            minHeight: 48,
          }}
        >
          {loadingMore && <Spin />}
        </div>
      )}
      </div>
    </Content>
  )
}
