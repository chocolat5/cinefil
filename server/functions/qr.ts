import type { Context } from "hono";
import qrcode from "qrcode-generator";

import type { Bindings } from "../types/server";

export const getQrCodeHandler = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const userId = c.req.param("userId");
    // check userId
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    // check cache
    const cache = await c.env.cinefil_db
      .prepare(`SELECT qr_image FROM qr_codes WHERE user_id = ?`)
      .bind(userId)
      .first();

    if (cache) {
      const uint8Array = new Uint8Array(cache.qr_image as ArrayBuffer);
      const buffer = uint8Array.buffer.slice(
        uint8Array.byteOffset,
        uint8Array.byteOffset + uint8Array.byteLength
      );
      return new Response(buffer as ArrayBuffer, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=31536000",
        },
      });
    } else {
      const url = `${c.env.SITE_URL}/${userId}`;

      // generate qr code
      const qr = qrcode(0, "M");
      qr.addData(url);
      qr.make();

      // return svg
      const svgStr = qr.createSvgTag({ cellSize: 5, margin: 4 });
      // svg → buffer (UTF-8 encode)
      const encoder = new TextEncoder();
      const buffer = encoder.encode(svgStr).buffer;

      // save on D1
      await c.env.cinefil_db
        .prepare(`INSERT INTO qr_codes (user_id, qr_image) VALUES (?, ?)`)
        .bind(userId, buffer)
        .run();

      return new Response(buffer, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=31536000",
        },
      });
    }
  } catch (error) {
    console.error("Generate QR Code error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
