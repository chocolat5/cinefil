export const PUBLIC_API_BASE_URL =
  import.meta.env.PUBLIC_API_BASE_URL || "http://localhost:8787";

export const FAVORITES_MAP = {
  movies: {
    title: "My Favorite Films",
  },
  directors: {
    title: "Favorite Directors",
    itemsKey: "favDirectors",
    department: "Directing",
    name: "director",
  },
  actors: {
    title: "Favorite Actors",
    itemsKey: "favActors",
    department: "Acting",
    name: "actor",
  },
  genres: {
    title: "My Top 3 Genres",
  },
  theaters: {
    title: "My Top 3 Theaters",
  },
  quote: {
    title: "Favorite Quote",
  },
} as const;

// http status error
export const STATUS_CONFIG = {
  400: {
    type: "http",
    message: "Bad Request",
    isRetryable: false,
  },
  401: {
    type: "auth",
    message: "Authentication required",
    isRetryable: false,
  },
  403: {
    type: "auth",
    message: "Forbidden",
    isRetryable: false,
  },
  404: {
    type: "http",
    message: "Page Not Found",
    isRetryable: false,
  },
  500: {
    type: "http",
    message: "Internal Server Error",
    isRetryable: true,
  },
  503: {
    type: "http",
    message: "Service Unavailable",
    isRetryable: true,
  },
} as const;

export const AUTH = {
  LOGIN_CODE_DURATION_MINS: 10,
  MAGIC_LINK_DURATION_MINS: 15,
  SESSION_TOKEN_DURATION_HRS: 24,
} as const;
