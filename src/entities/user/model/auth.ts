export type RatedMovie = {
  title: string
  rating: number
}

export type AuthData = {
  login: string
  ratedMovies: RatedMovie[]
  watchLater: string[]
}
