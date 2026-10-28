import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { chromium } from '@playwright/test';
import type { Browser, Page } from '@playwright/test';
import { createServer } from 'vite';
import type { ViteDevServer } from 'vite';
import { mkdir } from 'node:fs/promises';

let server: ViteDevServer;
let browser: Browser;
let page: Page;

beforeAll(async () => {
  server = await createServer({ server: { host: '127.0.0.1', port: 4190, strictPort: true } });
  await server.listen();
  browser = await chromium.launch();
}, 30000);
beforeEach(async () => {
  page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.clock.install({ time: new Date('2026-10-26T12:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-26T12:00:01Z'));
  await page.goto('http://127.0.0.1:4190/AstroDetect/');
  await page.getByRole('button', { name: 'Buscar posibles tránsitos' }).waitFor();
});
afterEach(async () => { await page?.close(); });
afterAll(async () => { await browser?.close(); await server?.close(); });

async function measurements() {
  return Promise.all(['clean-curve', 'observed-curve'].map(id => page.getByTestId(id).getAttribute('d')));
}

test('el laboratorio analiza la serie real y conserva mediciones, reloj y resultados al reproducir', async () => {
  const paths = await measurements();
  const initialTime = await page.getByTestId('clock').textContent();
  expect(await page.getByTestId('detection-results').count()).toBe(0);
  await page.getByRole('button', { name: 'Buscar posibles tránsitos' }).click();
  const results = page.getByTestId('detection-results');
  await expect.poll(() => results.textContent()).toContain('Eventos identificados: 5');
  expect(await results.textContent()).toContain('Período estimado: 5 días');
  await results.getByText('Ver las mediciones de 5 posibles tránsitos', { exact: true }).click();
  expect(await results.getByRole('list', { name: 'Eventos candidatos' }).getByRole('listitem').count()).toBe(5);
  expect(await results.textContent()).toContain('Profundidad medida');
  expect(await results.textContent()).toContain('Duración bajo umbral');
  expect(await results.textContent()).toContain('Una señal candidata no confirma un planeta');
  expect(await page.getByTestId('clock').textContent()).toBe(initialTime);
  expect(await measurements()).toEqual(paths);
  const originalResult = await results.textContent();
  await page.getByRole('button', { name: 'Reproducir', exact: true }).click();
  await page.clock.runFor(400);
  const runningTime = await page.getByTestId('clock').textContent();
  expect(runningTime).not.toBe(initialTime);
  await page.getByRole('button', { name: 'Buscar posibles tránsitos' }).click();
  expect(await page.getByRole('button', { name: 'Pausar', exact: true }).isVisible()).toBe(true);
  expect(await page.getByTestId('clock').textContent()).toBe(runningTime);
  expect(await results.textContent()).toBe(originalResult);
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  await page.clock.runFor(500);
  expect(await results.textContent()).toBe(originalResult);
  expect(await measurements()).toEqual(paths);
  await page.getByRole('button', { name: 'Volver al inicio', exact: true }).click();
  expect(await results.textContent()).toBe(originalResult);
}, 30000);

test('cambios válidos e inválidos retiran resultados antiguos y un caso débil explica la ausencia de evidencia', async () => {
  const search = page.getByRole('button', { name: 'Buscar posibles tránsitos' });
  await search.click();
  expect(await page.getByTestId('detection-results').count()).toBe(1);
  await page.locator('#periodDays').fill('');
  expect(await page.getByTestId('detection-results').count()).toBe(0);
  expect(await search.isDisabled()).toBe(true);
  expect(await page.getByRole('alert').textContent()).toContain('Corrige los campos');
  await page.locator('#periodDays').fill('5');
  expect(await search.isEnabled()).toBe(true);
  expect(await page.getByTestId('detection-results').count()).toBe(0);
  await search.click();
  await page.locator('#planetRadiusEarth').fill('1');
  expect(await page.getByTestId('detection-results').count()).toBe(0);
  await page.locator('#noisePpm').fill('5000');
  await search.click();
  const results = page.getByTestId('detection-results');
  expect(await results.textContent()).toContain('Sin evidencia con los criterios actuales');
  expect(await results.textContent()).toContain('No se pudo estimar un período');
  expect(await results.textContent()).toContain('no demuestra la ausencia');
  await page.getByRole('button', { name: 'Restablecer configuración' }).click();
  expect(await page.getByTestId('detection-results').count()).toBe(0);
  await search.click();
  expect(await results.textContent()).toContain('Eventos identificados: 5');
}, 30000);

test('el análisis funciona por teclado con movimiento reducido y resultados legibles en móvil', async () => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const search = page.getByRole('button', { name: 'Buscar posibles tránsitos' });
  await search.focus();
  expect(await search.evaluate(element => getComputedStyle(element).outlineStyle)).toBe('solid');
  await page.keyboard.press('Enter');
  expect(await page.getByTestId('detection-results').count()).toBe(1);
  expect(await page.getByTestId('clock').textContent()).toContain('0.0000');
  for (const width of [360, 180, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await mkdir('agents/evidence/T401', { recursive: true });
  await page.screenshot({ path: 'agents/evidence/T401/analysis-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 360, height: 800 });
  await page.screenshot({ path: 'agents/evidence/T401/analysis-mobile.png', fullPage: true });
}, 30000);
