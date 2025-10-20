import cloudflare from "@astrojs/cloudflare";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://cinefil.me/",
  baseUrl: "./",
  output: "server",
  adapter: cloudflare(),
  integrations: [react(), partytown()],
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    build: {
      cssCodeSplit: false,
    },
  },
});
