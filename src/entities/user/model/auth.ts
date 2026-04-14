export type MovieListItem = {
  showId: number
  title: string
}

export type RatedMovie = MovieListItem & {
  rating: number
}

export type AuthData = {
  login: string
  ratedMovies: RatedMovie[]
  watchLater: MovieListItem[]
}
