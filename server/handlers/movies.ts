import type { Context } from "hono";

import type { Bindings } from "../types/server";
import { validateMoviesArray } from "../utils/validate";
import type { FavoriteMovie } from "@/types/types";

export const getFavoriteMovieHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    const userId = c.req.param("userId");
    // check userId
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const query = `
      SELECT fm.*, ufm.display_order FROM favorite_movies fm 
      JOIN user_favorite_movies ufm ON fm.movie_id = ufm.movie_id
      WHERE ufm.user_id = ?
      ORDER BY ufm.display_order
    `;
    const result = await c.env.cinefil_db.prepare(query).bind(userId).all();

    // check result
    if (result.results.length === 0) {
      return c.json({ movies: [] }, 200);
    }

    const moviesArray = result.results.map((r) => {
      return {
        id: r.movie_id,
        title: r.title,
        posterPath: r.poster_path,
        displayOrder: r.display_order,
        year: r.year ? String(Math.floor(Number(r.year))) : undefined,
      };
    });
    return c.json({ movies: moviesArray }, 200);
  } catch (error) {
    console.error("Favorite Movies fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const addFavoriteMovieHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    // movie: { id, title, posterPath }
    const { movie, userId, displayOrder } = await c.req.json();
    // check userId
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const queryFM = `INSERT OR IGNORE INTO favorite_movies (movie_id, title, poster_path, year) VALUES (?, ?, ?, ?)`;
    const queryUFM = `INSERT INTO user_favorite_movies (user_id, movie_id, display_order) VALUES (?, ?, ?)`;

    await c.env.cinefil_db
      .prepare(queryFM)
      .bind(movie.id, movie.title, movie.posterPath, movie.year)
      .run();

    await c.env.cinefil_db
      .prepare(queryUFM)
      .bind(userId, movie.id, displayOrder)
      .run();
    return c.json({ message: "Favorite Movies added successfully" }, 201);
  } catch (error) {
    console.error("Favorite Movies fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const updateFavoriteMoviesHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    const { movies, userId } = await c.req.json();
    // check userId
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }
    // validate directors
    const moviesArrayError = validateMoviesArray(movies);
    if (moviesArrayError) {
      return c.json({ error: moviesArrayError }, 400);
    }

    // delete all existing data
    await c.env.cinefil_db
      .prepare(`DELETE FROM user_favorite_movies WHERE user_id = ?`)
      .bind(userId)
      .run();

    // check if movies is empty
    if (movies.length === 0) {
      return c.json({ message: "Favorite Movies updated successfully" }, 201);
    }

    // save all movies data
    const statements = movies
      .map((movie: FavoriteMovie, index: number) => {
        // add if movie does not exist in DB
        const insertMovie = c.env.cinefil_db
          .prepare(
            `INSERT OR IGNORE INTO favorite_movies (movie_id, title, poster_path, year) VALUES (?, ?, ?, ?)`
          )
          .bind(movie.id, movie.title, movie.posterPath, movie.year);

        // link to user
        const linkToUser = c.env.cinefil_db
          .prepare(
            `INSERT INTO user_favorite_movies (user_id, movie_id, display_order) VALUES (?, ?, ?)`
          )
          .bind(userId, movie.id, index + 1);
        return [insertMovie, linkToUser];
      })
      .flat();

    await c.env.cinefil_db.batch(statements);
    return c.json({ message: "Favorite Movies updated successfully" }, 201);
  } catch (error) {
    console.error("Favorite Movies fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
