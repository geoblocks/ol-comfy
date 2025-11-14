import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    exclude: [...configDefaults.exclude],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
    },
  },
});
