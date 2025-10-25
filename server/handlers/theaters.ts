import type { Context } from "hono";

import type { Bindings } from "../types/server";

export const getFavoriteTheaterHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    const userId = c.req.param("userId");
    // check userId
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const result = await c.env.cinefil_db
      .prepare(`SELECT theaters FROM user_favorite_theaters WHERE user_id = ?`)
      .bind(userId)
      .first();

    // check result
    if (!result || !result.theaters) {
      return c.json({ theaters: [] }, 200);
    }
    const theaters = JSON.parse(result.theaters as string);

    return c.json({ theaters: theaters }, 200);
  } catch (error) {
    console.error("Favorite Theater fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const updateFavoriteTheaterHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    const { theaters, userId } = await c.req.json();
    // check userId
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const query = `INSERT INTO user_favorite_theaters (theaters, user_id) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET theaters = excluded.theaters`;

    await c.env.cinefil_db
      .prepare(query)
      .bind(JSON.stringify(theaters), userId)
      .run();

    return c.json({ message: "Favorite Theater added successfully" }, 201);
  } catch (error) {
    console.error("Favorite Theater fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
