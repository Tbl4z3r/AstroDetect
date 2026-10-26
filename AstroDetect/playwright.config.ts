import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './tests/e2e', use: { baseURL: 'http://127.0.0.1:4173/AstroDetect/' }, webServer: { command: 'npm run preview -- --port 4173 --strictPort', url: 'http://127.0.0.1:4173/AstroDetect/', reuseExistingServer: false }, projects: [{ name: 'chromium', use: { browserName: 'chromium' } }] });
