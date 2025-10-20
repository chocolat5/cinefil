import type { Context } from "hono";

import type { Bindings } from "../types/server";
import { validateGenresArray } from "../utils/validate";
import type { FavoriteGenre } from "@/types/types";

export const getFavoriteGenreHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    const userId = c.req.param("userId");
    // check userId
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const result = await c.env.cinefil_db
      .prepare(`SELECT * FROM user_favorite_genres WHERE user_id = ?`)
      .bind(userId)
      .all();

    // check result
    if (result.results.length === 0) {
      return c.json({ genres: [] }, 200);
    }

    const genresArray = result.results.map((r) => {
      return { id: r.genre_id };
    });
    return c.json({ genres: genresArray }, 200);
  } catch (error) {
    console.error("Top 3 Genres fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const updateFavoriteGenresHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    const { genres, userId } = await c.req.json();
    // check userId
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }
    // validate genres
    const genresArrayError = validateGenresArray(genres);
    if (genresArrayError) {
      return c.json({ error: genresArrayError }, 400);
    }

    // delete all existing data
    await c.env.cinefil_db
      .prepare(`DELETE FROM user_favorite_genres WHERE user_id = ?`)
      .bind(userId)
      .run();

    if (genres.length === 0) {
      return c.json({ message: "Top 3 Genres updated sucessfully" }, 201);
    }

    // save all movies data
    const statements = genres
      .map((genre: FavoriteGenre) => {
        // link to user
        const linkToUser = c.env.cinefil_db
          .prepare(
            `INSERT INTO user_favorite_genres (user_id, genre_id) VALUES (?, ?)`
          )
          .bind(userId, genre.id);
        return [linkToUser];
      })
      .flat();

    await c.env.cinefil_db.batch(statements);
    return c.json({ message: "Top 3 Genres updated sucessfully" }, 200);
  } catch (error) {
    console.error("Top 3 Genres fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
