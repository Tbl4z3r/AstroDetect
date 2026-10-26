import { test, expect } from '@playwright/test';
test('arranca desde la subruta y carga recursos sin errores', async ({ page }) => {
  const failures: string[] = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('requestfailed', request => failures.push(request.url()));
  page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'AstroDetect' })).toBeVisible();
  await expect(page.getByText('Simulación educativa')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('main')).toBeVisible();
  expect(failures).toEqual([]);
});
