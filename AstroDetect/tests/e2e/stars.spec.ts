import { test, expect } from '@playwright/test';

const profiles = [
  { id: 'red-dwarf', name: 'Enana roja', mass: 0.3, radius: 0.3, color: '#ff9066' },
  { id: 'orange-dwarf', name: 'Enana naranja', mass: 0.7, radius: 0.7, color: '#ffb875' },
  { id: 'sunlike', name: 'Similar al Sol', mass: 1, radius: 1, color: '#ffd27a' },
  { id: 'hot-star', name: 'Más caliente', mass: 1.3, radius: 1.4, color: '#fff1dc' },
];

test('los cuatro modelos conectan masa radio Kepler curva y apariencia conservando el experimento', async ({ page }) => {
  await page.goto('./');
  await page.getByLabel('Radio del planeta (radios terrestres)', { exact: true }).fill('1');
  await page.getByLabel('Ruido de medición (ppm)', { exact: true }).fill('0');
  await page.getByLabel('Semilla del ruido (entero sin unidad)', { exact: true }).fill('123');
  for (const profile of profiles) {
    await page.getByLabel('Modelo de estrella', { exact: true }).selectOption(profile.id);
    await expect(page.getByLabel('Radio de la estrella (radios solares)', { exact: true })).toHaveValue(String(profile.radius));
    await expect(page.getByLabel('Masa de la estrella (masas solares)', { exact: true })).toHaveValue(String(profile.mass));
    await expect(page.getByLabel('Radio del planeta (radios terrestres)', { exact: true })).toHaveValue('1');
    await expect(page.getByLabel('Semilla del ruido (entero sin unidad)', { exact: true })).toHaveValue('123');
    const depth = (6378100 / (profile.radius * 695700000)) ** 2;
    const orbit = Math.cbrt(1.3271244e20 * profile.mass * (5 * 86400) ** 2 / (4 * Math.PI ** 2));
    const reference = page.locator('.model-reference');
    await expect(reference).toContainText(profile.name);
    await expect(reference).toContainText(`${(depth * 1e6).toLocaleString('es-CL', { maximumFractionDigits: 2 })} ppm`);
    await expect(reference).toContainText(`${(orbit / 1e9).toLocaleString('es-CL', { maximumFractionDigits: 2 })} millones de km`);
    await expect(page.locator('#transit-star stop').nth(1)).toHaveAttribute('stop-color', profile.color);
    await expect(page.getByRole('button', { name: 'Centrar cámara', exact: true })).toBeEnabled();
    await page.getByRole('button', { name: 'Ir al primer tránsito', exact: true }).click();
    await page.getByText('Ver los datos de este experimento', { exact: true }).click();
    await page.getByRole('button', { name: 'Ver la muestra más cercana al cursor', exact: true }).click();
    const first = page.getByRole('table').locator('tbody tr').first();
    await expect(first).toContainText((1 - depth).toLocaleString('es-CL', { minimumFractionDigits: 8, maximumFractionDigits: 8 }));
    await page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true }).click();
    await expect(page.getByTestId('detection-results')).toContainText('Eventos identificados: 5');
    await page.getByRole('button', { name: 'Entender', exact: false }).click();
    await expect(page.locator('.scenario-summary')).toContainText(`Masa estelar: ${String(profile.mass).replace('.', ',')} M☉`);
    await page.getByRole('button', { name: 'Observar', exact: false }).click();
  }
});

test('masa libre se propaga a Kepler e invalida detección sin alterar profundidad central', async ({ page }) => {
  await page.goto('./');
  const mass = page.getByLabel('Masa de la estrella (masas solares)', { exact: true });
  await mass.fill('0.2');
  await expect(page.getByLabel('Modelo de estrella', { exact: true })).toHaveValue('custom');
  await page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true }).click();
  await expect(page.getByTestId('detection-results')).toBeVisible();
  await mass.fill('1.6');
  await expect(page.getByTestId('detection-results')).toHaveCount(0);
  await expect(page.getByTestId('clock')).toContainText('0.0000');
  const reference = page.locator('.model-reference');
  await expect(reference).toContainText('8.405,02 ppm');
  await expect(reference).toContainText('1,6 M☉');
  await page.getByRole('button', { name: 'Entender', exact: false }).click();
  const kepler = page.getByRole('heading', { name: 'La tercera ley de Kepler', exact: true }).locator('..');
  const substitution = (await kepler.textContent())!.match(/μ = ([\d,E+.-]+) × ([\d,E+.-]+) ≈ ([\d,E+.-]+)/);
  expect(substitution).not.toBeNull();
  const [constant, acceptedMass, product] = substitution!.slice(1).map(value => Number(value.replace(',', '.')));
  expect(constant).toBe(1.3271244e20);
  expect(acceptedMass).toBe(1.6);
  expect(Math.abs(product / (constant * acceptedMass) - 1)).toBeLessThan(1e-15);
  await page.getByRole('button', { name: 'Observar', exact: false }).click();
  await mass.fill('');
  await expect(mass).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('alert')).toBeVisible();
  await page.getByLabel('Modelo de estrella', { exact: true }).selectOption('sunlike');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(mass).toHaveValue('1');
  await expect(page.getByTestId('series-summary')).toContainText('5001 muestras completas');
});

test('las estrellas compactas se explican aparte y el muestreo insuficiente se declara', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('./');
  await page.getByRole('button', { name: 'Ajustar sistema', exact: true }).click();
  await expect(page.getByLabel('Modelo de estrella', { exact: true }).getByRole('option')).toHaveCount(5);
  await page.getByLabel('Masa de la estrella (masas solares)', { exact: true }).fill('1.6');
  await page.getByLabel('Radio de la estrella (radios solares)', { exact: true }).fill('0.2');
  await page.getByLabel('Período orbital (días)', { exact: true }).fill('30');
  await page.getByLabel('Radio del planeta (radios terrestres)', { exact: true }).fill('1');
  await expect(page.locator('.model-reference')).toContainText('Resolución temporal limitada');
  await page.getByRole('button', { name: 'Entender', exact: false }).click();
  await page.getByText('Gigantes, enanas blancas y estrellas de neutrones', { exact: true }).click();
  await expect(page.locator('#view-guide')).toContainText('un método distinto de medir tránsitos');
  await expect(page.locator('#view-guide')).toContainText('mín[1, (Rₚ/R★)²]');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Experimentar', exact: false }).click();
  await page.getByRole('button', { name: 'Una Tierra frente a la enana roja', exact: true }).click();
  await page.getByRole('button', { name: 'Ajustar sistema', exact: true }).click();
  await expect(page.getByLabel('Modelo de estrella', { exact: true })).toHaveValue('red-dwarf');
  await expect(page.getByLabel('Radio del planeta (radios terrestres)', { exact: true })).toHaveValue('1');
});
