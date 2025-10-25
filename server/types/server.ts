import { D1Database } from "@cloudflare/workers-types";

export type Bindings = {
  RESEND_API_KEY: string;
  JWT_SECRET: string;
  cinefil_db: D1Database;
  SITE_URL: string;
  NODE_ENV: string;
};

export interface Variables {
  userId: string;
}

export type TokenType = "login_code" | "session";

export interface CinefilJWTPayload {
  userId?: string;
  email?: string;
  type: TokenType;
  exp: number;
  iat: number;
}
