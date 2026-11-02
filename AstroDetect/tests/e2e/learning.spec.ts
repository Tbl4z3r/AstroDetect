import { test, expect } from '@playwright/test';

test('las mediciones internas permiten localizar muestras sin regenerar la curva ni la detección', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Ir al primer tránsito', exact: true }).click();
  await page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true }).click();
  const curve = await page.getByTestId('observed-curve').getAttribute('d');
  await page.getByText('Ver los datos de este experimento', { exact: true }).click();
  const table = page.getByRole('table', { name: 'Mediciones del escenario actual · flujos sin unidad' });
  await expect(table.locator('tbody tr')).toHaveCount(20);
  await page.getByRole('button', { name: 'Ver la muestra más cercana al cursor', exact: true }).click();
  await expect(page.getByText('Página 26 de 251', { exact: false })).toBeVisible();
  const sample = table.locator('tbody tr').first();
  await expect(sample).toContainText('2,500000');
  await expect(sample).toContainText('0,99159498');
  await page.getByRole('button', { name: 'Ir a la muestra 502', exact: true }).click();
  await expect(page.getByTestId('clock')).toContainText('2.5050');
  await expect(page.getByTestId('observed-curve')).toHaveAttribute('d', curve!);
  await expect(page.getByTestId('detection-results')).toContainText('Eventos identificados: 5');
  await page.getByRole('button', { name: 'Página siguiente de datos', exact: true }).click();
  await expect(page.getByText('Página 27 de 251', { exact: false })).toBeVisible();
  await page.getByLabel('Período orbital (días)', { exact: true }).fill('10');
  await expect(page.getByRole('table')).not.toBeVisible();
  await page.getByText('Ver los datos de este experimento', { exact: true }).click();
  await expect(page.getByText('Página 1 de 251', { exact: false })).toBeVisible();
  await expect(page.getByTestId('series-summary')).toContainText('50 días');
});

test('la pantalla mantiene el tema espacial y el acceso a datos en móvil sin desbordar la página', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('./');
  await expect(page.locator('header')).not.toContainText('Simulación educativa');
  await expect(page.locator('header')).not.toContainText('Cuaderno orbital');
  await expect(page.getByRole('heading', { name: 'Del movimiento a la evidencia', exact: true })).toBeVisible();
  expect(await page.locator('body').evaluate(element => getComputedStyle(element).backgroundImage)).toContain('radial-gradient');
  await page.getByText('Ver los datos de este experimento', { exact: true }).click();
  const viewport = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth }));
  expect(viewport.document).toBeLessThanOrEqual(viewport.width);
  const region = page.getByRole('region', { name: 'Mediciones de tiempo y flujo' });
  await expect(region).toHaveAttribute('tabindex', '0');
  await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(20);
});

test('Entender usa los parámetros y resultados vigentes y retira cálculos cuando hay entradas inválidas', async ({ page }) => {
  await page.goto('./');
  await page.getByLabel('Período orbital (días)', { exact: true }).fill('10');
  await page.getByLabel('Radio del planeta (radios terrestres)', { exact: true }).fill('5');
  await page.getByLabel('Ruido de medición (ppm)', { exact: true }).fill('0');
  await page.getByRole('button', { name: 'Entender', exact: false }).click();
  const guide = page.locator('#view-guide');
  await expect(guide.getByRole('heading', { name: 'La tercera ley de Kepler', exact: true }).locator('..')).toContainText('864.000 s');
  await expect(guide.getByRole('heading', { name: 'De los radios a la profundidad', exact: true }).locator('..')).toContainText('2.101,25 ppm');
  await expect(guide).toContainText('Masa estelar: 1 M☉, fija.');
  await page.getByRole('button', { name: 'Observar', exact: false }).click();
  await page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true }).click();
  await page.getByRole('button', { name: 'Entender', exact: false }).click();
  await guide.getByText('Los números de tu búsqueda', { exact: true }).click();
  await expect(guide).toContainText('Período estimado: 10 días');
  await page.getByRole('button', { name: 'Observar', exact: false }).click();
  await page.getByLabel('Radio de la estrella (radios solares)', { exact: true }).fill('0');
  await page.getByRole('button', { name: 'Entender', exact: false }).click();
  await expect(guide).toContainText('Corrige la configuración en Observar');
  await expect(guide).not.toContainText('864.000');
  await expect(guide).not.toContainText('Tu escenario:');
});
