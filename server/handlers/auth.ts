import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { Resend } from "resend";

import { AUTH, getCookieOptions } from "../config/constants";
import { loginEmail } from "../templates/loginEmail";
import type { Bindings } from "../types/server";
import { generateOTP, generateToken } from "../utils/jwt";
import { validateEmail } from "../utils/validate";

/**
 * /login page, to send magic link
 * @param c
 * @returns
 */
export const loginHandler = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    // check env
    if (!c.env.JWT_SECRET || !c.env.RESEND_API_KEY || !c.env.SITE_URL) {
      return c.json({ error: "Server configuration error" }, 500);
    }

    const { email } = await c.req.json();
    // validate email
    const emailError = validateEmail(email);
    if (emailError) {
      return c.json({ error: emailError }, 400);
    }

    // clean up expired login token for this email
    await c.env.cinefil_db
      .prepare(
        `DELETE FROM auth_tokens WHERE email = ? AND token_type = 'login_code' AND expires_at < datetime('now')`
      )
      .bind(email)
      .run();

    // check user exist
    const existingUser = await c.env.cinefil_db
      .prepare(`SELECT user_id FROM users WHERE email = ?`)
      .bind(email)
      .first();
    const { loginCode, expiresAt } = await generateOTP();

    // store 6-digit code as string
    const token = loginCode.toString();

    const tokenType = "login_code";
    if (existingUser) {
      // generate 6-digit code for the existing user
      const userId = existingUser.user_id as string;

      // save on DB
      await c.env.cinefil_db
        .prepare(
          `INSERT INTO auth_tokens (token, token_type, email, user_id, expires_at) VALUES (?, ?, ?, ?, ?)`
        )
        .bind(token, tokenType, email, userId, expiresAt)
        .run();
    } else {
      // generate token for new user (not existing user)
      // save on DB
      await c.env.cinefil_db
        .prepare(
          `INSERT INTO auth_tokens (token, token_type, email, user_id, expires_at) VALUES (?, ?, ?, NULL, ?)`
        )
        .bind(token, tokenType, email, expiresAt)
        .run();
    }

    // send magic link
    const emailHtml = loginEmail.replace(
      "{{LOGIN_CODE}}",
      loginCode.toString()
    );
    const resend = new Resend(c.env.RESEND_API_KEY);

    await resend.emails.send({
      from:
        c.env.NODE_ENV === "development"
          ? "onboarding@resend.dev"
          : "Cinefil <hello@cinefil.me>",
      to: email,
      subject: "Code to log in to cinefil.me",
      html: emailHtml,
    });

    return c.json(
      { success: true, message: "Login code sent to your email" },
      200
    );
  } catch (error) {
    console.error(error);
    // hide error detail for security
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const logoutHandler = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    // get session token from cookie
    const sessionToken = getCookie(c, "session_token");
    if (!sessionToken) {
      return c.json({ authenticated: false }, 401);
    }

    // delete session token from cookie
    deleteCookie(
      c,
      "session_token",
      getCookieOptions(c.env.NODE_ENV === "development")
    );

    // delete session token from DB
    await c.env.cinefil_db
      .prepare(
        `DELETE FROM auth_tokens WHERE token = ? AND token_type = 'session'`
      )
      .bind(sessionToken)
      .run();

    return c.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      200
    );
  } catch (error) {
    console.error(error);
    // delete session token from cookie
    deleteCookie(
      c,
      "session_token",
      getCookieOptions(c.env.NODE_ENV === "development")
    );
    return c.json(
      {
        success: true,
        message: "Logged out",
      },
      200
    );
  }
};

export const verifyLoginCodeHandler = async (
  c: Context<{ Bindings: Bindings }>
) => {
  try {
    // get 6-digit code from body
    const { loginCode } = await c.req.json();
    if (!loginCode) {
      return c.json({ error: "Verification code is required" }, 400);
    }
    if (isNaN(loginCode) || loginCode.toString().length !== 6) {
      return c.json({ error: "Verification code must be 6 digits" }, 400);
    }
    const loginCodeStr = loginCode.toString();

    // check 6-digit code is valid
    const tokenRecord = await c.env.cinefil_db
      .prepare(
        `SELECT email, user_id FROM auth_tokens WHERE token = ? AND token_type = 'login_code' AND expires_at > ?`
      )
      .bind(loginCodeStr, Math.floor(Date.now() / 1000))
      .first();
    if (!tokenRecord) {
      return c.json({ error: "Invalid or expired code" }, 401);
    }

    // delete login token from DB
    await c.env.cinefil_db
      .prepare(
        `DELETE FROM auth_tokens WHERE token = ? AND token_type = 'login_code'`
      )
      .bind(loginCodeStr)
      .run();

    const userId = tokenRecord.user_id as string;
    const email = tokenRecord.email;

    const cookieOptions = getCookieOptions(c.env.NODE_ENV === "development");

    // generate session token for existing user
    let sessionToken = undefined;
    if (userId) {
      // delete old session token
      await c.env.cinefil_db
        .prepare(
          `DELETE FROM auth_tokens WHERE email = ? AND token_type = 'session'`
        )
        .bind(email)
        .run();

      sessionToken = await generateToken(
        userId,
        c.env.JWT_SECRET,
        "session",
        24 * 60 // 24時間（分単位）
      );

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

      // save session token on cookie
      setCookie(c, "session_token", sessionToken.generatedToken, {
        ...cookieOptions,
        maxAge: AUTH.SESSION_TOKEN_DURATION_HRS * 60 * 60, // 24時間（秒単位）
      });
    } else {
      setCookie(c, "temp_login_auth", "verified", {
        ...cookieOptions,
        maxAge: AUTH.MAGIC_LINK_DURATION_MINS * 60, // 15分（短時間）
      });
    }

    return c.json({
      valid: true,
      sessionToken: sessionToken?.generatedToken,
      userId: userId,
      email: email,
      needsRegistration: !tokenRecord.user_id,
    });
  } catch (error) {
    console.error(error);
    return c.json({ valid: false, error: "Invalid token" }, 401);
  }
};
