import type { Context } from "hono";

import type { Bindings } from "../types/server";
import { validateQuote } from "../utils/validate";

export const getFavoriteQuoteHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    const userId = c.req.param("userId");
    // check userId
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const result = await c.env.cinefil_db
      .prepare(`SELECT text, title FROM user_favorite_quote WHERE user_id = ?`)
      .bind(userId)
      .all();

    // check result
    if (!result || !result.results) {
      return c.json({ quote: { text: "", title: "" } }, 200);
    }
    const quote = result.results[0];

    if (!quote) {
      return c.json({ quote: { text: "", title: "" } }, 200);
    }

    return c.json(
      { quote: { text: quote.text || "", title: quote.title || "" } },
      200
    );
  } catch (error) {
    console.error("Favorite Quote fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const updateFavoriteQuoteHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    const { quote, userId } = await c.req.json();
    // check userId
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    if (!quote || typeof quote !== "object") {
      return c.json({ error: "Quote data is required" }, 400);
    }

    if (!quote.text) {
      return c.json({ error: "Quote data is required" }, 400);
    }

    // validate
    const textError = validateQuote(quote.text);
    if (textError) {
      return c.json({ error: textError }, 400);
    }

    if (quote.title) {
      const titleError = validateQuote(quote.title);
      if (titleError) {
        return c.json({ error: titleError }, 400);
      }
    }

    const query = `INSERT INTO user_favorite_quote (text, title, user_id) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET text = excluded.text, title = excluded.title`;

    await c.env.cinefil_db
      .prepare(query)
      .bind(quote.text || null, quote.title || null, userId)
      .run();

    return c.json({ message: "Favorite Quote added successfully" }, 201);
  } catch (error) {
    console.error("Favorite Quote fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
