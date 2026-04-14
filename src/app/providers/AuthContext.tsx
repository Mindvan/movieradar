import { createContext } from 'react'
import type { AuthData } from '../../entities/user'

export type AuthContextType = {
  authData: AuthData | null
  isAuthorized: boolean
  login: (login: string) => void
  logout: () => void
  toggleWatchLater: (showId: number, title: string) => void
  setMovieRating: (showId: number, title: string, rating: number) => void
}

export const AuthContext = createContext<AuthContextType>({
  authData: null,
  isAuthorized: false,
  login: () => {},
  logout: () => {},
  toggleWatchLater: () => {},
  setMovieRating: () => {},
})
