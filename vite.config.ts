import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: '/ol-comfy/examples/index.html',
  },
  base: "/ol-comfy/", // to deploy on gh-pages, specify the right base.
  build: {
    outDir: "demo",
    rollupOptions: {
      input: {
        index: 'examples/index.html',
        draw: 'examples/draw/draw.html',
        draw_shape: 'examples/draw_shape/draw_shape.html',
        layer: 'examples/layer/layer.html',
        multimap: 'examples/multi-map/multi-map.html',
      },
    },
  },
});
