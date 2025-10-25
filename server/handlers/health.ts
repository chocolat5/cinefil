import type { Context } from "hono";

import type { Bindings } from "../types/server";

export const healthHandler = (c: Context<{ Bindings: Bindings }>) => {
  return c.json(
    {
      status: "ok",
      message: "API is running",
    },
    200
  );
};
