import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: { NODE_ENV: 'test' },
    setupFiles: ['./tests/setup.js'],
    // One test file after another, so they don't mix up the same test database
    fileParallelism: false,
  },
});
