import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";
import type { Context } from "hono";

import type { Bindings } from "../types/server";
import { OgImage, OgImageFallBack } from "./og-image";

export const getOgImageHandler = async (c: Context<{ Bindings: Bindings }>) => {
  const fontData = await fetch(
    new URL(`${c.env.SITE_URL}/fonts/RobotoMono-SemiBold.ttf`, import.meta.url)
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
        <OgImageFallBack styles={{ ...baseStyle, ...errorStyle }} />,
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
        <OgImageFallBack styles={{ ...baseStyle, ...errorStyle }} />,
        imageOptions
      );
    }

    const ImageTemplate = await (async () => {
      const { avatar, display_name } = result;
      return (
        <OgImage
          baseStyle={baseStyle}
          avatar={avatar as string}
          displayName={display_name as string}
          siteUrl={c.env.SITE_URL}
        />
      );
    })();

    return new ImageResponse(ImageTemplate, imageOptions);
  } catch (error) {
    console.error("Og Image fetch error:", error);
    return new ImageResponse(
      <OgImageFallBack styles={{ ...baseStyle, ...errorStyle }} />,
      imageOptions
    );
  }
};
