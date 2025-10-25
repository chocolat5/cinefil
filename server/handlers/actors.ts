import type { Context } from "hono";

import type { Bindings } from "../types/server";
import { validatePersonsArray } from "../utils/validate";
import type { FavoritePerson } from "@/types/types";

export const getFavoriteActorHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    const userId = c.req.param("userId");
    // check userId
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const query = `
      SELECT fa.*, ufa.display_order FROM favorite_actors fa 
      JOIN user_favorite_actors ufa ON fa.actor_id = ufa.actor_id
      WHERE ufa.user_id = ?
      ORDER BY ufa.display_order
    `;
    const result = await c.env.cinefil_db.prepare(query).bind(userId).all();

    // check result
    if (result.results.length === 0) {
      return c.json({ actors: [] }, 200);
    }

    const actorsArray = result.results.map((r) => {
      return {
        id: r.actor_id,
        name: r.name,
        profilePath: r.profile_path,
        displayOrder: r.display_order,
      };
    });

    return c.json({ actors: actorsArray }, 200);
  } catch (error) {
    console.error("Favorite Actors fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const updateFavoriteActorsHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    const { actors, userId } = await c.req.json();
    // check userId
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }
    // validate actors
    const actorsArrayError = validatePersonsArray(actors);
    if (actorsArrayError) {
      return c.json({ error: actorsArrayError }, 400);
    }

    // delete all existing data
    await c.env.cinefil_db
      .prepare(`DELETE FROM user_favorite_actors WHERE user_id = ?`)
      .bind(userId)
      .run();

    // check if actors is empty
    if (actors.length === 0) {
      return c.json({ message: "Favorite Actors updated successfully" }, 201);
    }

    // save all movies data
    const statements = actors
      .map((actor: FavoritePerson, index: number) => {
        // add if actor does not exist in DB
        const insertActor = c.env.cinefil_db
          .prepare(
            `INSERT OR IGNORE INTO favorite_actors (actor_id, name, profile_path) VALUES (?, ?, ?)`
          )
          .bind(actor.id, actor.name, actor.profilePath);

        // link to user
        const linkToUser = c.env.cinefil_db
          .prepare(
            `INSERT INTO user_favorite_actors (user_id, actor_id, display_order) VALUES (?, ?, ?)`
          )
          .bind(userId, actor.id, index + 1);
        return [insertActor, linkToUser];
      })
      .flat();

    await c.env.cinefil_db.batch(statements);
    return c.json({ message: "Favorite Actors updated successfully" }, 201);
  } catch (error) {
    console.error("Favorite Actors fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
