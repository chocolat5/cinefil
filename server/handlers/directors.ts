import type { Context } from "hono";

import type { Bindings } from "../types/server";
import { validatePersonsArray } from "../utils/validate";
import type { FavoritePerson } from "@/types/types";

export const getFavoriteDirectorHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    const userId = c.req.param("userId");
    // check userId
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const query = `
      SELECT fd.*, ufd.display_order FROM favorite_directors fd 
      JOIN user_favorite_directors ufd ON fd.director_id = ufd.director_id
      WHERE ufd.user_id = ?
      ORDER BY ufd.display_order
    `;
    const result = await c.env.cinefil_db.prepare(query).bind(userId).all();

    // check result
    if (result.results.length === 0) {
      return c.json({ directors: [] }, 200);
    }

    const directorsArray = result.results.map((r) => {
      return {
        id: r.director_id,
        name: r.name,
        profilePath: r.profile_path,
        displayOrder: r.display_order,
      };
    });
    return c.json({ directors: directorsArray }, 200);
  } catch (error) {
    console.error("Favorite Directors fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const updateFavoriteDirectorsHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    const { directors, userId } = await c.req.json();
    // check userId
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }
    // validate directors
    const directorsArrayError = validatePersonsArray(directors);
    if (directorsArrayError) {
      return c.json({ error: directorsArrayError }, 400);
    }

    // delete all existing data
    await c.env.cinefil_db
      .prepare(`DELETE FROM user_favorite_directors WHERE user_id = ?`)
      .bind(userId)
      .run();

    // check if directors is empty
    if (directors.length === 0) {
      return c.json(
        { message: "Favorite Directors updated successfully" },
        201
      );
    }

    // save all movies data
    const statements = directors
      .map((director: FavoritePerson, index: number) => {
        // add if director does not exist in DB
        const insertDirector = c.env.cinefil_db
          .prepare(
            `INSERT OR IGNORE INTO favorite_directors (director_id, name, profile_path) VALUES (?, ?, ?)`
          )
          .bind(director.id, director.name, director.profilePath);

        // link to user
        const linkToUser = c.env.cinefil_db
          .prepare(
            `INSERT INTO user_favorite_directors (user_id, director_id, display_order) VALUES (?, ?, ?)`
          )
          .bind(userId, director.id, index + 1);
        return [insertDirector, linkToUser];
      })
      .flat();

    await c.env.cinefil_db.batch(statements);
    return c.json({ message: "Favorite Directors updated successfully" }, 201);
  } catch (error) {
    console.error("Favorite Directors fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
