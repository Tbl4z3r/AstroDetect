import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cpus, platform, release } from 'node:os';

test.describe.configure({ mode: 'serial', timeout: 30_000 });

test('configurar, reproducir, pausar, agregar ruido y detectar conserva una serie reproducible', async ({ page, context }) => {
  await page.goto('./');
  await page.getByLabel('Período orbital (días)', { exact: true }).fill('2');
  await page.getByLabel('Radio del planeta (radios terrestres)', { exact: true }).fill('10');
  await page.getByLabel('Ruido de medición (ppm)', { exact: true }).fill('0');
  await expect(page.getByTestId('series-summary')).toContainText('5001 muestras completas');
  const clean = await page.getByTestId('clean-curve').getAttribute('d');
  await expect(page.getByTestId('observed-curve')).toHaveAttribute('d', clean!);
  const initialClock = await page.getByTestId('clock').textContent();
  await page.getByRole('button', { name: 'Reproducir', exact: true }).click();
  await expect.poll(() => page.getByTestId('clock').textContent()).not.toBe(initialClock);
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  const pausedClock = await page.getByTestId('clock').textContent();
  await expect(page.getByRole('button', { name: 'Reproducir', exact: true })).toBeVisible();
  await expect(page.getByTestId('clock')).toHaveText(pausedClock!);
  await page.waitForLoadState('networkidle');
  const calculationRequests: string[] = [];
  page.on('request', request => calculationRequests.push(request.url()));
  await context.setOffline(true);
  await page.getByLabel('Ruido de medición (ppm)', { exact: true }).fill('500');
  const firstNoise = await page.getByTestId('observed-curve').getAttribute('d');
  await expect(page.getByTestId('observed-curve')).not.toHaveAttribute('d', clean!);
  await page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true }).click();
  await expect(page.getByTestId('detection-results')).toBeVisible();
  await expect(page.getByTestId('detection-results')).toContainText('Señal compatible con un posible tránsito');
  await expect(page.getByTestId('detection-results')).toContainText('Período estimado:');
  await expect(page.getByTestId('detection-results')).toContainText('no confirma un planeta');
  await page.getByLabel('Semilla del ruido (entero sin unidad)', { exact: true }).fill('43');
  await expect(page.getByTestId('detection-results')).toHaveCount(0);
  await expect(page.getByTestId('observed-curve')).not.toHaveAttribute('d', firstNoise!);
  await page.getByLabel('Semilla del ruido (entero sin unidad)', { exact: true }).fill('42');
  await expect(page.getByTestId('observed-curve')).toHaveAttribute('d', firstNoise!);
  await page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true }).click();
  await expect(page.getByTestId('detection-results')).toBeVisible();
  await page.getByLabel('Radio de la estrella (radios solares)', { exact: true }).fill('0');
  await expect(page.getByTestId('detection-results')).toHaveCount(0);
  await expect(page.getByRole('alert')).toContainText('Corrige los campos indicados');
  await expect(page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Restablecer configuración', exact: true }).click();
  await expect(page.getByTestId('series-summary')).toContainText('5001 muestras completas');
  await expect(page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true })).toBeEnabled();
  expect(calculationRequests).toEqual([]);
});

test('móvil de 360px permite teclado, errores y avance manual con movimiento reducido', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Reproducir', exact: true })).toBeDisabled();
  await expect(page.getByText('Movimiento reducido activo:', { exact: false })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Ir a la configuración', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  const star = page.getByLabel('Radio de la estrella (radios solares)', { exact: true });
  await expect(star).toBeFocused();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type('0');
  await expect(star).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('alert')).toBeVisible();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type('1');
  await expect(star).toHaveAttribute('aria-invalid', 'false');
  await expect(page.getByRole('alert')).toHaveCount(0);
  for (let index = 0; index < 7; index++) await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Avanzar una muestra', exact: true })).toBeFocused();
  const startClock = await page.getByTestId('clock').textContent();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('clock')).not.toHaveText(startClock!);
  await expect(page.getByRole('img', { name: 'Vista del tránsito desde el observador' })).toHaveAttribute('data-time-days', '0.005');
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Tiempo simulado (días)', { exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('detection-results')).toBeVisible();
  const widths = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
  await page.screenshot({ path: 'agents/evidence/T402/mobile-360.png', fullPage: true });
});

test('diez contextos independientes cargan e interactúan concurrentemente con volumen acotado', async ({ browser, baseURL }) => {
  const started = Date.now();
  const contexts = await Promise.all(Array.from({ length: 10 }, () => browser.newContext({ viewport: { width: 1280, height: 900 } })));
  const sessions: { index: number; seed: number; durationMs: number; errors: string[] }[] = [];
  try {
    await Promise.all(contexts.map(async (context, index) => {
      const sessionStarted = Date.now();
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('requestfailed', request => errors.push(request.url()));
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      await page.goto(baseURL!);
      const seed = 100 + index;
      await page.getByLabel('Semilla del ruido (entero sin unidad)', { exact: true }).fill(String(seed));
      await page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true }).click();
      await expect(page.getByTestId('detection-results')).toBeVisible();
      await expect(page.getByTestId('series-summary')).toContainText('5001 muestras completas');
      await expect(page.getByLabel('Semilla del ruido (entero sin unidad)', { exact: true })).toHaveValue(String(seed));
      expect(errors).toEqual([]);
      sessions.push({ index, seed, durationMs: Date.now() - sessionStarted, errors });
    }));
    const environment = {
      source: 'local preview; not a public GitHub Pages capacity test',
      date: new Date().toISOString(),
      browser: browser.version(),
      node: process.version,
      operatingSystem: `${platform()} ${release()}`,
      processor: cpus()[0]?.model ?? 'unavailable',
      logicalProcessors: cpus().length,
      concurrentContexts: contexts.length,
      viewport: { width: 1280, height: 900 },
      totalDurationMs: Date.now() - started,
      sessions: sessions.sort((a, b) => a.index - b.index),
    };
    await mkdir('agents/evidence/T402', { recursive: true });
    await writeFile(join('agents/evidence/T402', 'ten-contexts.json'), `${JSON.stringify(environment, null, 2)}\n`);
  } finally {
    await Promise.all(contexts.map(context => context.close()));
  }
});
