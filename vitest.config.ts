/// <reference types="vitest/config" />
// Unit tests (`pnpm test`). getViteConfig loads astro.config.mjs, so `import.meta.env.SITE`,
// `BASE_URL` and the `@src/*` alias resolve in tests the same way they do in the build.
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["src/**/*.test.ts", "worker/**/*.test.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts", "worker/**/*.ts"],
      exclude: ["**/*.test.ts", "**/*.d.ts"],
      reporter: ["text", "html", "lcov", "json-summary"],
      reportsDirectory: "coverage",
    },
  },
});
