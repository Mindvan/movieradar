import { Empty, Layout, Select, Spin, Typography, theme } from 'antd'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSearch } from '../features/show-search'
import { fetchSchedule, type WebScheduleItemType } from '../entities/show'
import { readRecentlyViewedShows, type RecentlyViewedShow } from '../entities/user'
import { AuthContext } from '../app/providers/AuthContext'
import { HomeDashboard } from '../widgets/show-list/HomeDashboard'
import { ShowCatalogGrid } from '../widgets/show-list/ShowCatalogGrid'

const { Content } = Layout
const posterHeight = 320
const cardWidth = 230

type ShowListPageProps = {
  search: string
}

function currentDateIso() {
  return new Date().toISOString().slice(0, 10)
}

export function ShowListPage({ search }: ShowListPageProps) {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthorized, authData, toggleWatchLater } = useContext(AuthContext)
  const genreFromUrl = useMemo(() => new URLSearchParams(location.search).get('genre')?.trim() ?? '', [location.search])
  const countryFromUrl = useMemo(() => new URLSearchParams(location.search).get('country')?.trim() ?? '', [location.search])
  const { data, loading, loadingMore, hasMore, loadMore } = useSearch(search, genreFromUrl, countryFromUrl)
  const trimmedSearch = search.trim()
  const hasSearch = trimmedSearch.length > 0 || genreFromUrl.length > 0 || countryFromUrl.length > 0
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedShow[]>([])
  const [todaySchedule, setTodaySchedule] = useState<WebScheduleItemType[]>([])
  const [todayScheduleLoading, setTodayScheduleLoading] = useState(false)
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
    if (!genreFromUrl) return
    setSelectedGenres((prevGenres) => (prevGenres.includes(genreFromUrl) ? prevGenres : [...prevGenres, genreFromUrl]))
  }, [genreFromUrl])

  useEffect(() => {
    if (!countryFromUrl) return
    setSelectedCountries((prevCountries) =>
      prevCountries.includes(countryFromUrl) ? prevCountries : [...prevCountries, countryFromUrl],
    )
  }, [countryFromUrl])

  useEffect(() => {
    setRecentlyViewed(readRecentlyViewedShows(authData?.login))
  }, [authData?.login, location.key])

  useEffect(() => {
    let isActive = true
    const loadTodaySchedule = async () => {
      setTodayScheduleLoading(true)
      const data = await fetchSchedule(currentDateIso(), 'RU')
      if (isActive) {
        setTodaySchedule(data.slice(0, 5))
        setTodayScheduleLoading(false)
      }
    }
    loadTodaySchedule()

    return () => {
      isActive = false
    }
  }, [])

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
        <HomeDashboard
          todayScheduleLoading={todayScheduleLoading}
          todaySchedule={todaySchedule}
          recentlyViewed={recentlyViewed}
          cardWidth={cardWidth}
          posterHeight={posterHeight}
          onOpenShow={(showId) => navigate(`/show/${showId}`)}
        />
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
        <ShowCatalogGrid
          data={filteredData}
          cardWidth={cardWidth}
          posterHeight={posterHeight}
          authData={authData}
          isAuthorized={isAuthorized}
          onOpenShow={(showId) => navigate(`/show/${showId}`)}
          onRequireLogin={() => navigate('/login')}
          onToggleWatchLater={toggleWatchLater}
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
