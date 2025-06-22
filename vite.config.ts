import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: true,
    lib: {
      entry: "src/tabmate.ts",
      name: "tabmate",
      formats: ["es", "umd"],
      fileName: (format) => `tabmate.${format}.js`,
    },
  },
  plugins: [
    dts({
      entryRoot: "src",
      outDir: "dist",
      copyDtsFiles: true,
      exclude: ["**/*.spec.ts", "**/utils/*.ts"],
    }),
  ],
});
