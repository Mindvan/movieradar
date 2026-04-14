import { Empty, Layout, Spin, Typography, theme } from 'antd'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchShowById, type ShowDetailsType } from '../entities/show'
import { addRecentlyViewedShow } from '../entities/user'
import { AuthContext } from '../app/providers/AuthContext'
import { ShowCreditsSection } from '../widgets/show-page/ShowCreditsSection'
import { ShowEpisodesSection } from '../widgets/show-page/ShowEpisodesSection'
import { ShowHeroSection } from '../widgets/show-page/ShowHeroSection'

const { Content } = Layout

export function ShowPage() {
  const { token } = theme.useToken()
  const { id } = useParams()
  const navigate = useNavigate()
  const { authData, isAuthorized, toggleWatchLater, setMovieRating } = useContext(AuthContext)
  const [showData, setShowData] = useState<ShowDetailsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSeason, setSelectedSeason] = useState<number>()
  const [ratingDraft, setRatingDraft] = useState(1)

  useEffect(() => {
    const showId = Number(id)
    if (!Number.isInteger(showId)) {
      setShowData(null)
      setLoading(false)
      return
    }

    let isActive = true

    const loadShow = async () => {
      setLoading(true)
      const res = await fetchShowById(showId)
      if (isActive) {
        setShowData(res)
        setLoading(false)
      }
    }

    loadShow()

    return () => {
      isActive = false
    }
  }, [id])

  useEffect(() => {
    if (!showData) {
      setSelectedSeason(undefined)
      return
    }

    const seasons = [...new Set(showData.show.episodes.map((episode) => episode.season).filter((x): x is number => typeof x === 'number'))]
      .sort((a, b) => a - b)

    if (seasons.length === 0) {
      setSelectedSeason(undefined)
      return
    }

    setSelectedSeason((prevSeason) =>
      typeof prevSeason === 'number' && seasons.includes(prevSeason) ? prevSeason : seasons[0],
    )
  }, [showData])

  const seasonOptions = useMemo(() => {
    if (!showData) return []

    return [...new Set(showData.show.episodes.map((episode) => episode.season).filter((x): x is number => typeof x === 'number'))]
      .sort((a, b) => a - b)
      .map((season) => ({ label: `Season ${season}`, value: season }))
  }, [showData])

  const filteredEpisodes = useMemo(() => {
    if (!showData) return []
    if (typeof selectedSeason !== 'number') return []
    return showData.show.episodes.filter((episode) => episode.season === selectedSeason)
  }, [showData, selectedSeason])

  const inWatchLater = useMemo(() => {
    if (!showData) return false
    return authData?.watchLater.some((item) => item.showId === showData.show.id) ?? false
  }, [authData, showData])

  const userRating = useMemo(() => {
    if (!showData) return undefined
    return authData?.ratedMovies.find((movie) => movie.showId === showData.show.id)?.rating
  }, [authData, showData])

  const showMainInfo = useMemo(() => {
    const year = showData?.show.premiered?.slice(0, 4) ?? 'Not specified'
    const country = showData?.show.country ?? 'Not specified'
    const language = showData?.show.language ?? 'Not specified'
    return { year, country, language }
  }, [showData])

  const showRatingColor = useMemo(() => {
    if (!showData?.show.rating) return 'rgba(255,255,255,0.88)'
    if (showData.show.rating < 5) return '#ff6b6b'
    if (showData.show.rating < 8) return '#ffd166'
    return '#7CFC8A'
  }, [showData])

  useEffect(() => {
    setRatingDraft(userRating ?? 1)
  }, [userRating, showData])

  useEffect(() => {
    if (!showData) return
    addRecentlyViewedShow(
      {
        showId: showData.show.id,
        title: showData.show.name,
        img: showData.show.img,
        country: showData.show.country,
      },
      authData?.login,
    )
  }, [showData, authData?.login])

  return (
    <Content style={{ padding: token.paddingLG }}>
      {loading ? (
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
          <Typography.Text type="secondary">Loading show...</Typography.Text>
        </div>
      ) : showData ? (
        <div style={{ display: 'grid', gap: token.marginXL }}>
          <ShowHeroSection
            show={showData.show}
            mainInfo={showMainInfo}
            showRatingColor={showRatingColor}
            ratingDraft={ratingDraft}
            inWatchLater={inWatchLater}
            onGenreClick={(genre) => navigate(`/?genre=${encodeURIComponent(genre)}`)}
            onCountryClick={(country) => navigate(`/?country=${encodeURIComponent(country)}`)}
            onRatingPreviewChange={setRatingDraft}
            onRatingCommit={(nextRating) => {
              setRatingDraft(nextRating)
              if (!isAuthorized) {
                navigate('/login')
                return
              }
              setMovieRating(showData.show.id, showData.show.name, nextRating)
            }}
            onToggleWatchLater={() => {
              if (!isAuthorized) {
                navigate('/login')
                return
              }
              toggleWatchLater(showData.show.id, showData.show.name)
            }}
          />

          <ShowEpisodesSection
            seasonOptions={seasonOptions}
            selectedSeason={selectedSeason}
            onSeasonChange={setSelectedSeason}
            filteredEpisodes={filteredEpisodes}
            allEpisodesCount={showData.show.episodes.length}
          />

          <ShowCreditsSection
            cast={showData.show.cast}
            crew={showData.show.crew}
          />
        </div>
      ) : (
        <Empty
          description={<Typography.Text type="secondary">Show not found</Typography.Text>}
        />
      )}
    </Content>
  )
}
