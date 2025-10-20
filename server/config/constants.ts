export const AUTH = {
  LOGIN_CODE_DURATION_MINS: 10,
  MAGIC_LINK_DURATION_MINS: 15,
  SESSION_TOKEN_DURATION_HRS: 24,
} as const;

export function getCookieOptions(isDev: boolean) {
  return {
    httpOnly: true,
    secure: true,
    sameSite: isDev ? "None" : "Lax",
    domain: isDev ? undefined : ".cinefil.me",
  } as const;
}
