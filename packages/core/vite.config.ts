import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*'],
      exclude: ['**/*.spec.ts']
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'TabmateCore',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm.' : ''}js`
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    }
  }
});
