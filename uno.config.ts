import { defineConfig, presetUno, presetIcons } from "unocss"

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  rules: [
    ["timestamp-portion", { "flex-basis": "18%" }],
    ["description-portion", { "flex-basis": "82%" }],
  ],
})
