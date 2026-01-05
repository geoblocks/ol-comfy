import { defineConfig } from 'vite';

const examples = ['simple', 'single-entry-point', 'draw', 'draw-shape', 'layer', 'view'];

export default defineConfig({
  server: {
    port: 5173,
    open: '/ol-comfy/examples/index.html',
  },
  base: '/ol-comfy/', // to deploy on gh-pages, specify the right base.
  build: {
    outDir: 'demo',
    minify: false, // More understandable examples, this doesn't affect npm package (done only by ts).
    rollupOptions: {
      input: {
        index: 'examples/index.html',
        ...examples.reduce(
          (obj, val) => ({
            ...obj,
            [`examples/${val}/index.html`]: `examples/${val}/index.html`,
          }),
          {},
        ),
      },
    },
  },
});
