import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      include: ["src/**/*"],
      exclude: ["**/*.spec.ts"],
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "TabmateVue",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "esm." : ""}js`,
    },
    rollupOptions: {
      external: ["vue", "@tabmate/core"],
      output: {
        globals: {
          vue: "Vue",
          "@tabmate/core": "TabmateCore",
        },
      },
    },
  },
});
