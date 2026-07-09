import { defineConfig, devices } from '@playwright/test';
import { baseConfig } from './playwright.base.config';

// Registrar novos projetos aqui
const TEST_PROJECTS = ['example'];

const BROWSERS = [
  { name: 'chromium', device: devices['Desktop Chrome'] },
  { name: 'firefox', device: devices['Desktop Firefox'] },
  { name: 'webkit', device: devices['Desktop Safari'] },
];

export default defineConfig({
  ...baseConfig,
  projects: TEST_PROJECTS.flatMap((project) =>
    BROWSERS.map(({ name, device }) => ({
      name: `${project}:${name}`,
      testDir: `./projects/${project}/tests`,
      use: { ...device },
    }))
  ),
});
