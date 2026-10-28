import { test, expect } from '@playwright/test';

test('las vistas conservan los datos y cargan experimentos usando el motor del laboratorio', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true }).click();
  const paths = await page.getByTestId('observed-curve').getAttribute('d');
  await page.getByRole('button', { name: 'Entender', exact: false }).click();
  await expect(page.getByRole('heading', { name: 'Leer lo que cuenta una estrella' })).toBeVisible();
  await page.getByRole('button', { name: 'Observar', exact: false }).click();
  await expect(page.getByTestId('observed-curve')).toHaveAttribute('d', paths!);
  await expect(page.getByTestId('detection-results')).toContainText('Eventos identificados: 5');
  await page.getByRole('button', { name: 'Ir al primer tránsito', exact: true }).click();
  await expect(page.getByTestId('clock')).toContainText('2.5000');
  await page.getByRole('button', { name: '¿Qué significa flujo normalizado?', exact: true }).click();
  await expect(page.locator('#view-guide')).toBeFocused();
  await page.getByRole('button', { name: 'Experimentar', exact: false }).click();
  await page.getByRole('button', { name: 'Período de 10 días', exact: true }).click();
  await expect(page.locator('#view-laboratory')).toBeFocused();
  await expect(page.getByTestId('clock')).toContainText('0.0000');
  await expect(page.getByTestId('series-summary')).toContainText('50 días');
  await expect(page.getByTestId('detection-results')).toHaveCount(0);
  await expect(page.getByLabel('Período orbital (días)', { exact: true })).toHaveValue('10');
  await page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true }).click();
  await expect(page.getByTestId('detection-results')).toContainText('Período estimado: 10 días');
});

test('en móvil el panel se abre por teclado y las comparaciones de ruido retiran resultados anteriores', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('./');
  const star = page.getByLabel('Radio de la estrella (radios solares)', { exact: true });
  await expect(star).not.toBeVisible();
  const toggle = page.getByRole('button', { name: 'Ajustar sistema', exact: true });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(star).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cerrar parámetros', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await page.getByLabel('Radio del planeta (radios terrestres)', { exact: true }).fill('1');
  await expect(page.getByText('Planeta ampliado ×4,4 para hacerlo visible.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Experimentar', exact: false }).click();
  await page.getByRole('button', { name: 'Ruido de 5.000 ppm', exact: true }).click();
  await expect(star).not.toBeVisible();
  await page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true }).click();
  await expect(page.getByTestId('detection-results')).toContainText('Sin evidencia con los criterios actuales');
  for (const width of [320, 360, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
