import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Enable global test APIs like describe, it, etc.
    globals: true,
    // Environment to run tests in
    environment: "jsdom",
    // File patterns for test files
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    // Exclude node_modules and other non-test directories
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
    ],
    // Configure TypeScript for tests
    typecheck: {
      enabled: true,
      tsconfig: "./tsconfig.json",
    },
    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "json-summary"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/*.d.ts",
        "docs/**",
        "*.config.{js,cjs,mjs,ts,mts,cts}",
      ],
    },
  },
});
