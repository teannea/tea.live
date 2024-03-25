import { defineConfig } from "astro/config"
import UnoCSS from "unocss/astro"
import react from "@astrojs/react"
import toml from "./toml.ts"

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    UnoCSS({
      injectReset: true,
    }),
    toml(),
  ],
})
