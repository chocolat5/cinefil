import type { Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";

import { AUTH, getCookieOptions } from "../config/constants";
import type { Bindings } from "../types/server";
import { generateToken } from "../utils/jwt";
import {
  validateBio,
  validateDisplayName,
  validateEmail,
  validateUrl,
  validateUserId,
} from "../utils/validate";

export const checkUserIdAvailabilityHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    const { userId } = await c.req.json();
    if (!userId) {
      return c.json({ error: "User ID required" }, 400);
    }

    const result = await c.env.cinefil_db
      .prepare(`SELECT user_id FROM users WHERE user_id = ?`)
      .bind(userId)
      .first();

    // check userId exist
    if (result) {
      return c.json(false, 200);
    }

    return c.json(true, 200);
  } catch (error) {
    console.error("Fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const getProfileHandler = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const userId = c.req.param("userId");
    // check userId
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const result = await c.env.cinefil_db
      .prepare(`SELECT * FROM profiles WHERE user_id = ?`)
      .bind(userId)
      .first();

    // check data exist
    if (!result) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(
      {
        displayName: result.display_name,
        bio: result.bio,
        avatar: result.avatar,
        socialLinks: result.social_links
          ? JSON.parse(result.social_links as string)
          : {},
      },
      200
    );
  } catch (error) {
    console.error("Profile fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const registerHandler = async (c: Context<{ Bindings: Bindings }>) => {
  const cookieOptions = getCookieOptions(c.env.NODE_ENV === "development");

  // handling whole error
  try {
    const { displayName, userId, email } = await c.req.json();
    // validate userId
    const userIdError = validateUserId(userId);
    if (userIdError) {
      return c.json({ error: userIdError }, 400);
    }
    // validate email
    const emailError = validateEmail(email);
    if (emailError) {
      return c.json({ error: emailError }, 400);
    }
    // validate displayName
    const displayNameError = validateDisplayName(displayName);
    if (displayNameError) {
      return c.json({ error: displayNameError }, 400);
    }

    // save on users table
    await c.env.cinefil_db
      .prepare(`INSERT OR IGNORE INTO users (user_id, email) VALUES (?, ?)`)
      .bind(userId, email)
      .run();

    // save on profiles table
    await c.env.cinefil_db
      .prepare(
        `INSERT OR IGNORE INTO profiles (user_id, display_name) VALUES (?, ?)`
      )
      .bind(userId, displayName)
      .run();

    // generate sessionToken
    const sessionToken = await generateToken(
      userId,
      c.env.JWT_SECRET,
      "session",
      24 * 60 // 24時間（分単位）
    );

    // save session token on cookie
    setCookie(c, "session_token", sessionToken.generatedToken, {
      ...cookieOptions,
      maxAge: AUTH.SESSION_TOKEN_DURATION_HRS * 60 * 60, // 24時間（秒単位）
    });

    deleteCookie(c, "temp_login_auth", cookieOptions);

    // save session token on auth_tokens table
    await c.env.cinefil_db
      .prepare(
        `INSERT INTO auth_tokens (token, token_type, email, user_id, expires_at) VALUES (?, ?, ?, ?, ?)`
      )
      .bind(
        sessionToken.generatedToken,
        "session",
        email,
        userId,
        sessionToken.expiresAt
      )
      .run();

    return c.json(
      {
        success: true,
        userId,
        message: "Registered successfully",
      },
      201
    );
  } catch (error) {
    console.error("Registeration fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const createProfileHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    const { profile, userId } = await c.req.json();
    // validate userId
    const userIdError = validateUserId(userId);
    if (userIdError) {
      return c.json({ error: userIdError }, 400);
    }
    // validate displayName
    const displayNameError = validateDisplayName(profile.displayName);
    if (displayNameError) {
      return c.json({ error: displayNameError }, 400);
    }

    const result = await c.env.cinefil_db
      .prepare(
        `UPDATE profiles SET display_name =?, bio =?, avatar =?, social_links = ? WHERE user_id = ?`
      )
      .bind(
        profile.displayName,
        profile.bio || null,
        profile.avatar || null,
        JSON.stringify(profile.socialLinks || {}),
        userId
      )
      .run();

    // check if profile is in DB
    if (result.meta.changes === 0) {
      return c.json({ error: "Profile not found" }, 404);
    }

    return c.json(
      { success: true, message: "Profile created successfully" },
      201
    );
  } catch (error) {
    console.error("Profile fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const updateProfileHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    const { profile, userId } = await c.req.json();
    // validate userId
    const userIdError = validateUserId(userId);
    if (userIdError) {
      return c.json({ error: userIdError }, 400);
    }
    if (!profile || typeof profile !== "object") {
      return c.json({ error: "Profile data is required" }, 400);
    }
    // validate displayName
    const displayNameError = validateDisplayName(profile.displayName);
    if (displayNameError) {
      return c.json({ error: displayNameError }, 400);
    }
    // validate bio
    const bioError = validateBio(profile.bio);
    if (bioError) {
      return c.json({ error: bioError }, 400);
    }
    // validate website Url
    const websiteUrlError = validateUrl(profile.socialLinks?.website);
    if (websiteUrlError) {
      return c.json({ error: websiteUrlError }, 400);
    }

    const query = `UPDATE profiles SET display_name = ?, bio = ?, avatar = ?, social_links = ? WHERE user_id = ?`;
    await c.env.cinefil_db
      .prepare(query)
      .bind(
        profile.displayName,
        profile.bio,
        profile.avatar,
        JSON.stringify(profile.socialLinks),
        userId
      )
      .run();
    return c.json({ message: "Profile updated successfully" }, 201);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
