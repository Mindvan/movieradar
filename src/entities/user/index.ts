export type { AuthData, MovieListItem, RatedMovie } from './model/auth'
export { AUTH_STORAGE_KEY, readAuthData } from './lib/authStorage'
export { addRecentlyViewedShow, readRecentlyViewedShows, type RecentlyViewedShow } from './lib/recentlyViewed'
