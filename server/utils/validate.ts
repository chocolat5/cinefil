export interface ValidateError {
  [key: string]: string;
}

const systemReservedId = [
  "login",
  "register",
  "admin",
  "terms-and-policy",
  "edit",
  "about",
  "contact",
  "api",
  "assets",
  "_astro",
  "_image",
  "404",
  "favicon.ico",
  "images",
  "cinefil",
];

export const validateUserId = (userId: unknown): string | null => {
  if (!userId || typeof userId !== "string") {
    return "Invalid userId";
  }

  if (systemReservedId.includes(userId)) {
    return "Username not available";
  }

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(userId) || userId.startsWith("_")) {
    // 3-20 characters, alphanumeric + underscore
    return "Invalid userId format";
  }

  return null;
};

export const validateDisplayName = (name: unknown): string | null => {
  if (!name || typeof name !== "string") {
    return "Invalid displayName";
  }
  // check length
  if (name.length < 3 || name.length > 25) {
    return "Display name is too short or too long. It should be 3 to 25 letters.";
  }

  return null;
};

export const validateEmail = (email: unknown): string | null => {
  if (!email || typeof email !== "string") {
    return "Invalid email";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email format";
  }

  return null;
};

export const validateBio = (bio: string): string | null => {
  if (bio && (typeof bio !== "string" || bio.length > 150)) {
    return "Bio must be 150 characters or less.";
  }

  return null;
};

export const validateUrl = (url: string): string | null => {
  if (!url) return null;

  const urlPattern = /^https?:\/\/.+\..+/;
  if (!urlPattern.test(url)) {
    return "Please enter a valid URL (e.g., https://example.com)";
  }

  return null;
};

export const validateMoviesArray = (movies: unknown): string | null => {
  if (!Array.isArray(movies)) {
    return "Movies must be an array";
  }
  if (movies.length > 6) {
    return "Maximum 6 movies allowed";
  }
  for (const movie of movies) {
    if (
      !movie.id ||
      !movie.title ||
      typeof movie.id !== "number" ||
      typeof movie.title !== "string"
    ) {
      return "Invalid movie data";
    }
  }

  return null;
};

export const validatePersonsArray = (persons: unknown): string | null => {
  if (!Array.isArray(persons)) {
    return "Data must be an array";
  }
  if (persons.length > 3) {
    return "Maximum 3 items allowed";
  }
  for (const person of persons) {
    if (
      !person.id ||
      !person.name ||
      typeof person.id !== "number" ||
      typeof person.name !== "string"
    ) {
      return "Invalid data";
    }
  }

  return null;
};

export const validateGenresArray = (genres: unknown): string | null => {
  if (!Array.isArray(genres)) {
    return "Data must be an array";
  }
  if (genres.length > 3) {
    return "Maximum 3 items allowed";
  }

  return null;
};

export const validateQuote = (quote: string): string | null => {
  if (quote && (typeof quote !== "string" || quote.length > 250)) {
    return "Quote must be 250 characters or less.";
  }

  return null;
};

export const validateQuoteTitle = (title: unknown): string | null => {
  if (!title || typeof title !== "string") {
    return "Invalid movie title";
  }
  // check length
  if (title.length < 2 || title.length > 40) {
    return "Movie title is too short or too long. It should be 2 to 40 letters.";
  }

  return null;
};
