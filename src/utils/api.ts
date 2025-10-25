import { PUBLIC_API_BASE_URL, STATUS_CONFIG } from "@/config/constants";
import type {
  ActorsResponse,
  ApiError,
  DirectorsResponse,
  FavoriteGenre,
  FavoriteMovie,
  FavoritePerson,
  GenresResponse,
  HealthResponse,
  LoginResponse,
  MoviesResponse,
  Profile,
  QuoteRequest,
  QuoteResponse,
  RegisterRequest,
  TheaterRequest,
  TheatersResponse,
  VerifyLoginCodeResponse,
} from "@/types/types";

/**
 * Error handling
 */
const createApiError = (statusCode: number): ApiError => {
  const config = STATUS_CONFIG[statusCode as keyof typeof STATUS_CONFIG];
  if (config) {
    return {
      type: config?.type || "http",
      statusCode,
      message: config?.message || "Unknown Error",
      details: "",
      isRetryable: config?.isRetryable || false,
    };
  }

  // default
  return {
    type: "http",
    statusCode,
    message: "Unknown Error",
    details: "",
    isRetryable: statusCode >= 500,
  };
};

// network error
const createNetworkError = (error: unknown): ApiError => {
  if (error instanceof TypeError) {
    // network or fetch faild
    return {
      type: "network",
      statusCode: undefined,
      message: "Connection failed",
      details: error.message || "",
      isRetryable: true,
    };
  }

  // JSON parse error
  if (error instanceof SyntaxError) {
    return {
      type: "parse",
      statusCode: undefined,
      message: "Invalid response format",
      details: error.message || "",
      isRetryable: false,
    };
  }

  return {
    type: "network",
    statusCode: undefined,
    message: "Unknown Error",
    details: error instanceof Error ? error.message : "",
    isRetryable: false,
  };
};

/**
 * common request
 *
 * @param endpoint
 * @param options
 * @returns
 */
const request = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${PUBLIC_API_BASE_URL}${endpoint}`;

  const finalOptions = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include" as RequestCredentials, // send cookie (session token)
    ...options,
  };

  if (
    options.method &&
    ["GET", "HEAD"].includes(options.method.toUpperCase())
  ) {
    delete finalOptions.body;
  }

  try {
    // fetch
    const response = await fetch(url, finalOptions);

    // check error
    if (!response.ok) {
      if (response.status === 401) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 2500);
        return;
      }
      throw createApiError(response.status);
    }

    return response.json();
  } catch (error) {
    const isApiError = (error: unknown): error is ApiError => {
      return typeof error === "object" && error !== null && "type" in error;
    };
    if (isApiError(error)) {
      throw error;
    }
    throw createNetworkError(error);
  }
};

const requestNoAuth = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${PUBLIC_API_BASE_URL}${endpoint}`;

  try {
    // fetch
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include" as RequestCredentials, // send cookie (session token)
      // method, body
      ...options,
    });

    // check error
    if (!response.ok) {
      throw createApiError(response.status);
    }

    return response.json();
  } catch (error) {
    const isApiError = (error: unknown): error is ApiError => {
      return typeof error === "object" && error !== null && "type" in error;
    };
    if (isApiError(error)) {
      throw error;
    }
    throw createNetworkError(error);
  }
};

const apiClientNoAuth = {
  get: <T = unknown>(endpoint: string): Promise<T> => {
    return requestNoAuth(endpoint, { method: "GET" });
  },
  post: <T = unknown>(endpoint: string, data: unknown): Promise<T> => {
    return requestNoAuth(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

const apiClient = {
  get: <T = unknown>(endpoint: string): Promise<T> => {
    return request(endpoint, { method: "GET" });
  },
  // create
  post: <T = unknown>(endpoint: string, data?: unknown): Promise<T> => {
    return request(endpoint, { method: "POST", body: JSON.stringify(data) });
  },
  // update
  put: <T = unknown>(endpoint: string, data: unknown): Promise<T> => {
    return request(endpoint, { method: "PUT", body: JSON.stringify(data) });
  },
  delete: <T = unknown>(endpoint: string, data: unknown): Promise<T> => {
    return request(endpoint, { method: "DELETE", body: JSON.stringify(data) });
  },
};

/**
 * API functions
 * @returns
 */
export const getHealthApi = async (): Promise<HealthResponse> => {
  return await apiClient.get<HealthResponse>(`/api/health`);
};

export const checkUserIdApi = async (userId: string): Promise<boolean> => {
  return await apiClient.post<boolean>(`/api/users/check`, { userId });
};

/**
 *
 * register
 *
 */
export const registerApi = async (
  userId: string,
  displayName: string,
  email: string
): Promise<RegisterRequest> => {
  return await apiClientNoAuth.post<RegisterRequest>(`/api/auth/register`, {
    userId,
    displayName,
    email,
  });
};

export const createProfileApi = async (
  userId: string,
  profileData: Partial<Profile>
): Promise<{ profile: Profile; success: number }> => {
  return await apiClientNoAuth.post<{ profile: Profile; success: number }>(
    `/api/users/${userId}/profile`,
    {
      profile: profileData,
      userId,
    }
  );
};

/**
 *
 * login
 *
 */
export const loginApi = async (email: string): Promise<LoginResponse> => {
  return await apiClientNoAuth.post<LoginResponse>(`/api/auth/login`, {
    email,
  });
};

export const logoutApi = async (): Promise<LoginResponse> => {
  return await apiClient.post<LoginResponse>(`/api/auth/logout`);
};

export const verifyLoginCodeApi = async (
  loginCode: number
): Promise<VerifyLoginCodeResponse> => {
  return await apiClient.post<VerifyLoginCodeResponse>(`/api/auth/verify`, {
    loginCode,
  });
};

/**
 *
 * profile
 *
 */
// use in astro server side
export const getProfileApi = async (userId: string): Promise<Profile> => {
  return await apiClient.get<Profile>(`/api/users/${userId}/profile`);
};

export const getProfileApiSSR = async (userId: string): Promise<Profile> => {
  return await apiClientNoAuth.get<Profile>(`/api/users/${userId}/profile`);
};

export const updateProfileApi = async (
  userId: string,
  profileData: Partial<Profile>
): Promise<{ message: string }> => {
  return await apiClient.put<{ message: string }>(
    `/api/users/${userId}/profile`,
    {
      profile: profileData,
      userId,
    }
  );
};

/**
 * favorite movies
 */
export const getFavoriteMoviesApi = async (
  userId: string
): Promise<MoviesResponse> => {
  return await apiClient.get<MoviesResponse>(`/api/users/${userId}/movies`);
};

export const getFavoriteMoviesApiSSR = async (
  userId: string
): Promise<MoviesResponse> => {
  return await apiClientNoAuth.get<MoviesResponse>(
    `/api/users/${userId}/movies`
  );
};

export const updateFavoriteMoviesApi = async (
  userId: string,
  movies: FavoriteMovie[]
): Promise<{ message: string }> => {
  return await apiClient.put<{ message: string }>(
    `/api/users/${userId}/movies`,
    {
      userId,
      movies,
    }
  );
};

/**
 * favorite directors
 */
export const getFavoriteDirectorsApi = async (
  userId: string
): Promise<DirectorsResponse> => {
  return await apiClient.get<DirectorsResponse>(
    `/api/users/${userId}/directors`
  );
};

export const getFavoriteDirectorsApiSSR = async (
  userId: string
): Promise<DirectorsResponse> => {
  return await apiClientNoAuth.get<DirectorsResponse>(
    `/api/users/${userId}/directors`
  );
};

export const updateFavoriteDirecrosApi = async (
  userId: string,
  directors: FavoritePerson[]
): Promise<{ message: string }> => {
  return await apiClient.put<{ message: string }>(
    `/api/users/${userId}/directors`,
    { userId, directors }
  );
};

/**
 * favorite actors
 */
export const getFavoriteActorsApi = async (
  userId: string
): Promise<ActorsResponse> => {
  return await apiClient.get<ActorsResponse>(`/api/users/${userId}/actors`);
};

export const getFavoriteActorsApiSSR = async (
  userId: string
): Promise<ActorsResponse> => {
  return await apiClientNoAuth.get<ActorsResponse>(
    `/api/users/${userId}/actors`
  );
};

export const updateFavoriteActorsApi = async (
  userId: string,
  actors: FavoritePerson[]
): Promise<{ message: string }> => {
  return await apiClient.put<{ message: string }>(
    `/api/users/${userId}/actors`,
    {
      userId,
      actors,
    }
  );
};

/**
 * favorite genres
 */
export const getFavoriteGenresApi = async (
  userId: string
): Promise<GenresResponse> => {
  return await apiClient.get<GenresResponse>(`/api/users/${userId}/genres`);
};

export const getFavoriteGenresApiSSR = async (
  userId: string
): Promise<GenresResponse> => {
  return await apiClientNoAuth.get<GenresResponse>(
    `/api/users/${userId}/genres`
  );
};

export const updateFavoriteGenresApi = async (
  userId: string,
  genreData: FavoriteGenre[]
): Promise<{ message: string }> => {
  return await apiClient.put<{ message: string }>(
    `/api/users/${userId}/genres`,
    {
      userId,
      genres: genreData,
    }
  );
};

/**
 * favorite theaters
 */
export const getFavoriteTheatersApi = async (
  userId: string
): Promise<TheatersResponse> => {
  return await apiClient.get<TheatersResponse>(`/api/users/${userId}/theaters`);
};

export const getFavoriteTheatersApiSSR = async (
  userId: string
): Promise<TheatersResponse> => {
  return await apiClientNoAuth.get<TheatersResponse>(
    `/api/users/${userId}/theaters`
  );
};

export const updateFavoriteTheaterApi = async (
  userId: string,
  theaterData: TheaterRequest
): Promise<{ message: string }> => {
  return await apiClient.post<{ message: string }>(
    `/api/users/${userId}/theaters`,
    {
      userId,
      theaters: theaterData,
    }
  );
};

/**
 * favorite quote
 */
export const getFavoriteQuoteApi = async (
  userId: string
): Promise<QuoteResponse> => {
  return await apiClient.get<QuoteResponse>(`/api/users/${userId}/quote`);
};

export const getFavoriteQuoteApiSSR = async (
  userId: string
): Promise<QuoteResponse> => {
  return await apiClientNoAuth.get<QuoteResponse>(`/api/users/${userId}/quote`);
};

export const updateFavoriteQuoteApi = async (
  userId: string,
  quoteData: QuoteRequest
): Promise<{ message: string }> => {
  return await apiClient.post<{ message: string }>(
    `/api/users/${userId}/quote`,
    {
      userId,
      quote: quoteData,
    }
  );
};
