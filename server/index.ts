import { Hono } from "hono";
import { cors } from "hono/cors";

import { getOgImageHandler } from "./functions/og";
import { getQrCodeHandler } from "./functions/qr";
import * as actorsHandler from "./handlers/actors";
import * as authHandler from "./handlers/auth";
import * as directorsHandler from "./handlers/directors";
import * as genresHandler from "./handlers/genres";
import { healthHandler } from "./handlers/health";
import * as moviesHandler from "./handlers/movies";
import * as quoteHandler from "./handlers/quote";
import * as theatersHandler from "./handlers/theaters";
import * as usersHandler from "./handlers/users";
import { authMiddleware } from "./middleware/auth";
import type { Bindings } from "./types/server";

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "/*",
  cors({
    origin: (origin) => {
      const allowedOrigins = [
        process.env.SITE_URL || "https://cinefil.me",
        "https://dev.cinefil.me",
        "http://localhost:4321",
      ];
      if (origin && origin.endsWith(".cinefil.pages.dev")) {
        return origin;
      }
      return allowedOrigins.includes(origin || "") ? origin : allowedOrigins[0];
    },
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
    exposeHeaders: ["Set-Cookie"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.get("/", (c) => c.text("Hello Cinefil!"));

app.get("/api/health", healthHandler);

/**
 * login
 */
// login request, send magic link
app.post("/api/auth/login", authHandler.loginHandler);

app.post("/api/auth/logout", authHandler.logoutHandler);

// verify 6-digit code for login
app.post("/api/auth/verify", authHandler.verifyLoginCodeHandler);

/**
 * register
 */
app.post("/api/users/check", usersHandler.checkUserIdAvailabilityHandler);

app.post("/api/auth/register", usersHandler.registerHandler);

app.post("/api/users/:userId/profile", usersHandler.createProfileHandler);

/**
 * profile
 */
app.get("/api/users/:userId/profile", usersHandler.getProfileHandler);

app.put(
  "/api/users/:userId/profile",
  authMiddleware,
  usersHandler.updateProfileHandler
);

/**
 * og image
 */
app.get("/api/og-image", getOgImageHandler);

/**
 * qr image
 */
app.get("/api/users/:userId/qr-code", authMiddleware, getQrCodeHandler);

/**
 * favorite movies
 */
app.get("/api/users/:userId/movies", moviesHandler.getFavoriteMovieHandler);

app.put(
  "/api/users/:userId/movies",
  authMiddleware,
  moviesHandler.updateFavoriteMoviesHandler
);

/**
 * favorite directors
 */
app.get(
  "/api/users/:userId/directors",
  directorsHandler.getFavoriteDirectorHandler
);

app.put(
  "/api/users/:userId/directors",
  authMiddleware,
  directorsHandler.updateFavoriteDirectorsHandler
);

/**
 * favorite actors
 */
app.get("/api/users/:userId/actors", actorsHandler.getFavoriteActorHandler);

app.put(
  "/api/users/:userId/actors",
  authMiddleware,
  actorsHandler.updateFavoriteActorsHandler
);

/**
 * favorite genres
 */
app.get("/api/users/:userId/genres", genresHandler.getFavoriteGenreHandler);

app.put(
  "/api/users/:userId/genres",
  authMiddleware,
  genresHandler.updateFavoriteGenresHandler
);

/**
 * favorite theaters
 */
app.get(
  "/api/users/:userId/theaters",
  theatersHandler.getFavoriteTheaterHandler
);

app.post(
  "/api/users/:userId/theaters",
  authMiddleware,
  theatersHandler.updateFavoriteTheaterHandler
);

/**
 * favorite quote
 */
app.get("/api/users/:userId/quote", quoteHandler.getFavoriteQuoteHandler);

app.post(
  "/api/users/:userId/quote",
  authMiddleware,
  quoteHandler.updateFavoriteQuoteHandler
);

export default app;
