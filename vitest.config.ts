import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// tsconfigPaths() makes Vitest resolve the `@`-aliases straight from
// tsconfig.json `paths`, so the alias map lives in exactly one place.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["src/**/*.test.ts"],
  },
});
