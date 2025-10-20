import type { Context, Next } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";

import { getCookieOptions } from "../config/constants";
import type { Bindings, Variables } from "../types/server";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
  next: Next
) => {
  try {
    // get session token from cookie
    const sessionToken = getCookie(c, "session_token");
    if (!sessionToken) {
      return c.json({ error: "Authentication required" }, 401);
    }

    // check JWT token
    const { valid, payload } = await verifyToken(
      sessionToken,
      c.env.JWT_SECRET
    );
    if (!valid || !payload) {
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    // check token type
    if (payload.type !== "session") {
      return c.json({ error: "Invalid token type" }, 401);
    }

    // check userID
    const userId = payload.userId;
    if (!userId) {
      return c.json({ error: "Invalid token payload" }, 401);
    }

    // check token existing in DB
    const tokenExists = await c.env.cinefil_db
      .prepare(
        `SELECT user_id FROM auth_tokens WHERE token = ? AND token_type = 'session' AND expires_at > ?`
      )
      .bind(sessionToken, Math.floor(Date.now() / 1000))
      .first();
    if (!tokenExists) {
      // delete no-exist or expired token
      deleteCookie(
        c,
        "session_token",
        getCookieOptions(c.env.NODE_ENV === "development")
      );
      return c.json({ authenticated: false }, 401);
    }

    // check userId in param
    const currentUserId = c.req.param("userId");
    if (currentUserId !== userId) {
      return c.json(
        { error: "Access denied: You can only access your own data" },
        403
      );
    }

    // save user in context
    c.set("userId", userId);

    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return c.json({ error: "Authentication failed" }, 401);
  }
};
