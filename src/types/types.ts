export type EditMode =
  | "none"
  | "profile"
  | "theaters"
  | "movies"
  | "directors"
  | "actors"
  | "genres"
  | "quote";

export type PersonType = "directors" | "actors";

/**
 * User Data
 */
export interface Profile {
  displayName: string;
  bio?: string;
  avatar?: string;
  socialLinks: { [key: string]: string };
}

export interface Film {
  id: number;
  title: string;
  originalTitle: string;
  posterPath: string;
  genre: number[];
  overview: string;
  vote_average: number;
}

export interface FavoriteMovie {
  id: number;
  posterPath: string;
  title: string;
  displayOrder?: number;
  year: string;
}
export interface FavoritePerson {
  id: number;
  profilePath: string;
  name: string;
  displayOrder?: number;
}

export interface FavoriteGenre {
  id: number;
  name?: string;
}
export interface FavoriteQuote {
  text: string;
  title?: string;
}

/**
 * Site Data
 */
export interface SiteMeta {
  title?: string;
  noindex?: boolean;
  description?: string;
  ogImage?: string;
  className?: string;
}

/**
 * API
 */
export interface ApiError {
  type: "network" | "http" | "parse" | "auth" | "validation";
  statusCode?: number;
  message: string;
  details?: string;
  isRetryable: boolean;
}

export interface HealthResponse {
  status: string;
}

export interface RegisterRequest {
  userId: string;
  displayName: string;
  email: string;
  sessionToken: string;
  success: number;
}

export interface LoginRequest {
  email: string;
}

export interface LoginResponse {
  success: number;
  message: string;
}

export interface VerifyLoginCodeResponse {
  valid: boolean;
  sessionToken?: string;
  userId?: string;
  email?: string;
  needsRegistration?: boolean;
  error?: string;
}

export interface CurrentUser {
  userId: string;
  email: string;
  displayName: string;
}

export type MovieRequest = FavoriteMovie;
export type DirectorRequest = FavoritePerson;
export type ActorRequest = FavoritePerson;
export type GenreRequest = FavoriteGenre;
export type TheaterRequest = string[];
export type QuoteRequest = FavoriteQuote;

export interface OrderRequest {
  ids: number[];
}

export interface MoviesResponse {
  movies: FavoriteMovie[];
}
export interface DirectorsResponse {
  directors: FavoritePerson[];
}
export interface ActorsResponse {
  actors: FavoritePerson[];
}

export interface GenresResponse {
  genres: FavoriteGenre[];
}

export interface TheatersResponse {
  theaters: string[];
}

export interface QuoteResponse {
  quote: FavoriteQuote;
}

/**
 * AUTH
 */
export interface Session {
  token: string;
  userId?: string;
  email: string | undefined;
  needsRegistration?: boolean;
}

export type ToastTypeProps = "success" | "info" | "error";

interface ToastType {
  message: string;
  type: ToastTypeProps;
  isVisible: boolean;
}

export interface StoreInterface {
  editMode: EditMode;
  handleEditMode: (newEditMode: EditMode) => void;
  logout: () => Promise<void>;
  toast: ToastType;
  showToast: (message: string, type: ToastTypeProps) => void;
  closeToast: () => void;
}
