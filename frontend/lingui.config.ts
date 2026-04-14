import { defineConfig } from "@lingui/cli"

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "ar"],
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
})
