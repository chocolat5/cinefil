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

export const validateUserId = (userId: string): string | null => {
  if (!userId) {
    return "User ID is required";
  }

  if (systemReservedId.includes(userId)) {
    return "Username not available";
  }

  // 3-20 characters, alphanumeric + underscore
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(userId)) {
    return "User ID must be 3-20 characters (letters, numbers, _)";
  }

  // Cannot start with underscore
  if (userId.startsWith("_")) {
    return "User ID cannot start with underscore";
  }

  return null;
};

export const validateDisplayName = (name: string): string => {
  // check length
  if (name.length < 3 || name.length > 25) {
    return "Display name is too short or too long. It should be 3 to 25 letters.";
  }

  // check spam
  if (/(.)\1{5,}/.test(name)) {
    return "Some characters or text patterns are not allowed as display name.";
  }

  // check HTML tags
  if (/<[^>]*>/g.test(name)) {
    return "Some characters or text patterns are not allowed as display name.";
  }

  // check script
  if (/javascript:|data:|vbscript:/i.test(name)) {
    return "Some characters or text patterns are not allowed as display name.";
  }

  // no break line
  if (/\n|\r/.test(name)) {
    return "Some characters or text patterns are not allowed as display name.";
  }

  // check URL
  if (/https?:\/\/|www\./i.test(name)) {
    return "URLs are not allowed as display name.";
  }

  // check Email
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(name)) {
    return "Email addresses are not allowed as display name.";
  }

  return "";
};

export const validateBio = (bio: string): string => {
  // check length
  if (bio.length > 150) {
    return "Bio is too long. Maximum 150 characters allowed.";
  }

  // check spam
  if (/(.)\1{5,}/.test(bio)) {
    return "Some characters or text patterns are not allowed in bio.";
  }

  // check HTML tags
  if (/<[^>]*>/g.test(bio)) {
    return "Some characters or text patterns are not allowed in bio.";
  }

  // check script
  if (/javascript:|data:|vbscript:/i.test(bio)) {
    return "Some characters or text patterns are not allowed in bio.";
  }

  // check URL
  if (/https?:\/\/|www\./i.test(bio)) {
    return "URLs are not allowed in bio.";
  }

  // check Email
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(bio)) {
    return "Email addresses are not allowed in bio.";
  }

  return "";
};

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email format";
  }
  return null;
};

export const validateTheaterName = (name: string): string | null => {
  if (name.trim().length < 1 || name.trim().length > 50) {
    return "Theater name should be 1 to 50 characters.";
  }

  // check spam
  if (/(.)\1{5,}/.test(name)) {
    return "Some characters or text patterns are not allowed in theater name.";
  }

  // check HTML tags
  if (/<[^>]*>/g.test(name)) {
    return "Some characters or text patterns are not allowed in theater name.";
  }

  // check script
  if (/javascript:|data:|vbscript:/i.test(name)) {
    return "Some characters or text patterns are not allowed in theater name.";
  }

  // check URL
  if (/https?:\/\/|www\./i.test(name)) {
    return "URLs are not allowed in theater name.";
  }

  // check Email
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(name)) {
    return "Email addresses are not allowed in theater name.";
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

export const validateSocialAccountId = (id: string): string | null => {
  if (!id) return null;

  if (!/^[a-zA-Z0-9_-]{1,30}$/.test(id)) {
    return "Social media account ID must be 1 - 30 characters (letters, numbers, _, -)";
  }

  return null;
};

export const validateQuote = (quote: string): string => {
  // check length
  if (quote.length > 250) {
    return "Quote is too long. Maximum 250 characters allowed.";
  }

  // check spam
  if (/(.)\1{5,}/.test(quote)) {
    return "Some characters or text patterns are not allowed in quote.";
  }

  // check HTML tags
  if (/<[^>]*>/g.test(quote)) {
    return "Some characters or text patterns are not allowed in quote.";
  }

  // check script
  if (/javascript:|data:|vbscript:/i.test(quote)) {
    return "Some characters or text patterns are not allowed in quote.";
  }

  // check URL
  if (/https?:\/\/|www\./i.test(quote)) {
    return "URLs are not allowed in quote.";
  }

  // check Email
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(quote)) {
    return "Email addresses are not allowed in quote.";
  }

  return "";
};

export const validateQuoteTitle = (title: string): string => {
  // check length
  if (title.length < 2 || title.length > 40) {
    return "Movie title is too short or too long. It should be 2 to 40 letters.";
  }

  // check spam
  if (/(.)\1{5,}/.test(title)) {
    return "Some characters or text patterns are not allowed as movie title.";
  }

  // check HTML tags
  if (/<[^>]*>/g.test(title)) {
    return "Some characters or text patterns are not allowed as movie title.";
  }

  // check script
  if (/javascript:|data:|vbscript:/i.test(title)) {
    return "Some characters or text patterns are not allowed as movie title.";
  }

  // no break line
  if (/\n|\r/.test(title)) {
    return "Some characters or text patterns are not allowed as movie title.";
  }

  // check URL
  if (/https?:\/\/|www\./i.test(title)) {
    return "URLs are not allowed as movie title.";
  }

  // check Email
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(title)) {
    return "Email addresses are not allowed as movie title.";
  }

  return "";
};
