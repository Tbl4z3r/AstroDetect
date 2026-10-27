import { afterAll, beforeAll, expect, test } from 'vitest';
import { chromium } from '@playwright/test';
import type { Browser, Page } from '@playwright/test';
import { createServer } from 'vite';
import type { ViteDevServer } from 'vite';
import { mkdir } from 'node:fs/promises';

let server: ViteDevServer;
let browser: Browser;
let page: Page;
beforeAll(async () => {
  server = await createServer({ server: { host: '127.0.0.1', port: 4188, strictPort: true } });
  await server.listen();
  browser = await chromium.launch();
  page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.clock.install();
}, 30000);
afterAll(async () => { await browser?.close(); await server?.close(); });

async function curvePaths() {
  return Promise.all(['clean-curve', 'observed-curve'].map(id => page.getByTestId(id).getAttribute('d')));
}
async function setTime(value: string) {
  await page.locator('#simulation-time').evaluate((element, next) => {
    const input = element as HTMLInputElement;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, next);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

test('un reloj conecta motor, planeta y cursor sin regenerar ruido durante reproducción', async () => {
  await page.goto('http://127.0.0.1:4188/AstroDetect/');
  await page.getByRole('slider', { name: 'Tiempo simulado (días)' }).waitFor();
  const initialPaths = await curvePaths();
  expect(initialPaths.every(path => path!.split('L').length === 5001)).toBe(true);
  expect(await page.getByTestId('clock').textContent()).toContain('0.0000');
  await page.getByRole('button', { name: 'Reproducir', exact: true }).click();
  await page.clock.runFor(1000);
  const animation = page.getByRole('img', { name: 'Vista del tránsito desde el observador' });
  const curve = page.getByRole('img', { name: 'Curva de brillo simulada' });
  const times = await page.locator('svg[data-time-days]').evaluateAll(elements => elements.map(el => el.getAttribute('data-time-days')));
  expect(Number(times[0])).toBeGreaterThan(0);
  expect(times[1]).toBe(times[0]);
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  const paused = await animation.getAttribute('data-time-days');
  await page.clock.runFor(1000);
  expect(await animation.getAttribute('data-time-days')).toBe(paused);
  expect(await curvePaths()).toEqual(initialPaths);
  expect(await page.locator('#seed').inputValue()).toBe('42');
  await setTime('2.5');
  expect(await animation.getAttribute('data-time-days')).toBe('2.5');
  expect(await curve.getAttribute('data-time-days')).toBe('2.5');
  expect(await page.getByTestId('planet').getAttribute('cx')).toBe('240');
  expect(Number(await page.getByTestId('planet').getAttribute('r')) / Number(await page.getByTestId('star').getAttribute('r'))).toBeCloseTo(0.09167888457668535, 10);
  expect(Number(await page.getByTestId('time-cursor').getAttribute('x1'))).toBeCloseTo(165.5);
  await page.getByRole('button', { name: 'Volver al inicio', exact: true }).click();
  expect(await animation.getAttribute('data-time-days')).toBe('0');
  expect(await curvePaths()).toEqual(initialPaths);
  await page.locator('#noisePpm').fill('0');
  const cleanPaths = await curvePaths();
  expect(cleanPaths[0]).toBe(cleanPaths[1]);
  await page.locator('#noisePpm').fill('500');
  expect(await curvePaths()).toEqual(initialPaths);
  await page.locator('#seed').fill('0');
  expect((await curvePaths())[1]).not.toBe(initialPaths[1]);
  await page.locator('#seed').fill('42');
  expect(await curvePaths()).toEqual(initialPaths);
  await page.getByRole('button', { name: 'Reproducir', exact: true }).click();
  await page.clock.runFor(200);
  await page.locator('#periodDays').fill('10');
  expect(await page.getByTestId('series-summary').textContent()).toContain('50 días');
  expect(await animation.getAttribute('data-time-days')).toBe('0');
  expect(await page.getByRole('button', { name: 'Reproducir', exact: true }).isVisible()).toBe(true);
  await page.locator('#periodDays').fill('');
  expect(await page.getByRole('alert').textContent()).toContain('Corrige');
  expect(await animation.count()).toBe(0);
  expect(await page.getByTestId('observed-curve').count()).toBe(0);
  await page.locator('#periodDays').fill('5');
  expect(await curvePaths()).toEqual(initialPaths);
}, 30000);

test('teclado, movimiento reducido, extremos y pantalla móvil', async () => {
  await page.goto('http://127.0.0.1:4188/AstroDetect/');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const play = page.getByRole('button', { name: 'Reproducir', exact: true });
  await expect.poll(() => play.isEnabled()).toBe(false);
  const slider = page.getByRole('slider', { name: 'Tiempo simulado (días)' });
  await slider.focus();
  await slider.press('Home');
  await slider.press('ArrowRight');
  expect(await page.getByTestId('clock').textContent()).toContain('0.0050');
  expect(await slider.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
  await slider.press('End');
  expect(await page.getByTestId('clock').textContent()).toContain('25.0000');
  await page.getByRole('button', { name: 'Volver al inicio', exact: true }).focus();
  await page.keyboard.press('Enter');
  expect(await page.getByTestId('clock').textContent()).toContain('0.0000');
  await page.getByRole('button', { name: 'Avanzar una muestra' }).click();
  expect(await page.getByTestId('clock').textContent()).toContain('0.0050');
  for (const [field, value] of [['starRadiusSolar', '0.5'], ['planetRadiusEarth', '20'], ['periodDays', '1'], ['noisePpm', '5000'], ['seed', '4294967295']]) {
    await page.locator(`#${field}`).fill(value);
  }
  expect((await curvePaths()).some(path => /NaN|Infinity/.test(path!))).toBe(false);
  for (const [field, value] of [['starRadiusSolar', '2'], ['planetRadiusEarth', '1'], ['periodDays', '30'], ['noisePpm', '0'], ['seed', '0']]) {
    await page.locator(`#${field}`).fill(value);
  }
  expect((await curvePaths()).some(path => /NaN|Infinity/.test(path!))).toBe(false);
  await page.getByRole('button', { name: 'Restablecer configuración' }).click();
  await setTime('2.5');
  await mkdir('agents/evidence/T401', { recursive: true });
  await page.screenshot({ path: 'agents/evidence/T401/synchronized-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 360, height: 800 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'agents/evidence/T401/synchronized-mobile.png', fullPage: true });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(() => play.isEnabled()).toBe(true);
  expect(await page.getByTestId('clock').textContent()).toContain('2.5000');
  await slider.press('End');
  await play.click();
  await page.clock.runFor(100);
  expect(Number(await page.getByRole('img', { name: 'Curva de brillo simulada' }).getAttribute('data-time-days'))).toBeLessThan(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => play.isEnabled()).toBe(false);
  const stopped = await page.getByTestId('clock').textContent();
  await page.clock.runFor(1000);
  expect(await page.getByTestId('clock').textContent()).toBe(stopped);
}, 30000);
