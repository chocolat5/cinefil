import crypto from "crypto";
import { sign, verify } from "hono/jwt";

import { AUTH } from "../config/constants";
import type { CinefilJWTPayload, TokenType } from "../types/server";

export async function generateToken(
  identifier: string,
  secret: string,
  tokenType: TokenType,
  exp: number,
  isEmail: boolean = false
): Promise<{ generatedToken: string; expiresAt: number }> {
  const payload = {
    ...(isEmail ? { email: identifier } : { userId: identifier }),
    type: tokenType,
    exp: Math.floor(Date.now() / 1000) + 60 * exp,
    iat: Math.floor(Date.now() / 1000),
  };
  const token = await sign(payload, secret);
  return { generatedToken: token, expiresAt: payload.exp };
}

export async function verifyToken(
  token: string,
  secret: string
): Promise<{ valid: boolean; payload?: CinefilJWTPayload; error?: unknown }> {
  try {
    const payload = await verify(token, secret);
    return { valid: true, payload: payload as unknown as CinefilJWTPayload };
  } catch (error) {
    return { valid: false, error };
  }
}

export async function generateOTP(): Promise<{
  loginCode: number;
  expiresAt: number;
}> {
  const expiresAt =
    Math.floor(Date.now() / 1000) + 60 * AUTH.LOGIN_CODE_DURATION_MINS;
  return {
    loginCode: crypto.randomInt(100000, 999999),
    expiresAt,
  };
}
