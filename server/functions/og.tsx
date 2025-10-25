import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";
import type { Context } from "hono";

import type { Bindings } from "../types/server";

export const getOgImageHandler = async (c: Context<{ Bindings: Bindings }>) => {
  const fontData = await fetch(
    new URL(
      `${c.env.SITE_URL}/fonts/RobotoMono-SemiBold.woff2`,
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  const baseStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: "#fbfbfb",
    color: "#326cfe",
    fontFamily: "Roboto Mono",
  };
  const errorStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 56,
  };

  const imageOptions = {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "RobotoMono",
        data: fontData,
        style: "normal",
        weight: 500,
      },
    ],
  };

  try {
    const userId = c.req.query("userId");
    // check userId
    if (!userId) {
      return new ImageResponse(
        (
          <div style={{ ...baseStyle, ...errorStyle }}>
            cinefill - your cinema profile
          </div>
        ),
        imageOptions
      );
    }

    const result = await c.env.cinefil_db
      .prepare(`SELECT avatar, display_name FROM profiles WHERE user_id = ?`)
      .bind(userId)
      .first();

    // check data exist
    if (!result) {
      return new ImageResponse(
        (
          <div style={{ ...baseStyle, ...errorStyle }}>
            cinefill - your cinema profile
          </div>
        ),
        imageOptions
      );
    }

    const ImageTemplate = await (async () => {
      const { avatar, display_name } = result;
      return (
        <div
          style={{
            ...baseStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              overflow: "hidden",
              width: 150,
              height: 150,
              backgroundColor: "#326cfe",
              color: "#fbfbfb",
            }}
          >
            {avatar ? (
              <img
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  width: "100%",
                  height: "100%",
                }}
                src={avatar as string}
                width="80"
                height="80"
                alt={display_name as string}
              />
            ) : (
              <span
                style={{
                  color: "#fff",
                  fontSize: 64,
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                {(display_name as string).substring(0, 1)}
              </span>
            )}
          </div>
          <div
            style={{
              marginTop: 16,
              textAlign: "center",
              fontSize: 40,
            }}
          >
            {display_name as string}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 4,
              textAlign: "center",
              fontSize: 24,
            }}
          >
            <img
              src={`${c.env.SITE_URL}/images/logo.svg`}
              width="24"
              height="24"
              alt="cinefil logo"
            />
            cinefil.me
          </div>
        </div>
      );
    })();

    return new ImageResponse(ImageTemplate, imageOptions);
  } catch (error) {
    console.error("Og Image fetch error:", error);
    return new ImageResponse(
      (
        <div style={{ ...baseStyle, ...errorStyle }}>
          cinefill - your cinema profile
        </div>
      ),
      imageOptions
    );
  }
};
