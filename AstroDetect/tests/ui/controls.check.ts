import { afterAll, beforeAll, expect, test } from 'vitest';
import { chromium } from '@playwright/test';
import type { Browser, Page } from '@playwright/test';
import { createServer } from 'vite';
import type { ViteDevServer } from 'vite';

let server: ViteDevServer;
let browser: Browser;
let page: Page;
beforeAll(async () => {
  server = await createServer({ server: { host: '127.0.0.1', port: 4187, strictPort: true } });
  await server.listen();
  browser = await chromium.launch();
  page = await browser.newPage({ viewport: { width: 360, height: 800 } });
}, 30000);
afterAll(async () => {
  await browser?.close();
  await server?.close();
});

test('valida campos, límites inclusivos y semilla entera sin corregir entradas', async () => {
  await page.goto('http://127.0.0.1:4187/AstroDetect/');
  await page.getByRole('button', { name: 'Ajustar sistema', exact: true }).click();
  const cases = [
    ['Radio de la estrella (radios solares)', '1', '0.5', '2', '0.49', '2.01'],
    ['Radio del planeta (radios terrestres)', '10', '1', '20', '0', '21'],
    ['Período orbital (días)', '5', '1', '30', '0', '31'],
    ['Ruido de medición (ppm)', '500', '0', '5000', '-1', '5001'],
    ['Semilla del ruido (entero sin unidad)', '42', '0', '4294967295', '-1', '4294967296'],
  ];
  for (const [label, initial, min, max, below, above] of cases) {
    const input = page.getByRole('spinbutton', { name: label, exact: true });
    expect(await input.inputValue()).toBe(initial);
    for (const value of [min, max]) {
      await input.fill(value);
      expect(await input.getAttribute('aria-invalid')).toBe('false');
    }
    for (const value of [below, above, '']) {
      await input.fill(value);
      expect(await input.inputValue()).toBe(value);
      expect(await input.getAttribute('aria-invalid')).toBe('true');
      const errorId = (await input.getAttribute('aria-describedby'))!.split(' ')[1];
      expect(await page.locator(`[id="${errorId}"]`).textContent()).toMatch(/Introduce/);
    }
    await input.fill(initial);
  }
  const seed = page.getByRole('spinbutton', { name: /Semilla del ruido/ });
  await seed.fill('1.5');
  expect(await seed.getAttribute('aria-invalid')).toBe('true');
  expect(await page.locator('#seed-error').textContent()).toContain('entera');
  await seed.fill('1e309');
  expect(await seed.getAttribute('aria-invalid')).toBe('true');
}, 30000);

test('teclado, foco visible, restablecimiento y disposición estrecha', async () => {
  await page.close();
  page = await browser.newPage({ viewport: { width: 360, height: 800 } });
  await page.goto('http://127.0.0.1:4187/AstroDetect/');
  await page.getByRole('heading', { name: 'AstroDetect', exact: true }).waitFor();
  await page.keyboard.press('Tab');
  expect(await page.getByRole('link', { name: 'Ir a la configuración' }).evaluate(el => el === document.activeElement)).toBe(true);
  await page.keyboard.press('Enter');
  expect(await page.locator('#configuracion').evaluate(el => el === document.activeElement)).toBe(true);
  for (const id of ['starRadiusSolar', 'planetRadiusEarth', 'periodDays', 'noisePpm', 'seed']) {
    await page.keyboard.press('Tab');
    expect(await page.locator(`#${id}`).evaluate(el => el === document.activeElement)).toBe(true);
    expect(await page.locator(`#${id}`).evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
    if (id !== 'seed') {
      await page.keyboard.press('Tab');
      expect(await page.locator(`#${id}`).locator('..').getByRole('slider').evaluate(el => el === document.activeElement)).toBe(true);
    }
  }
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type('0');
  expect(await page.locator('#seed').inputValue()).toBe('0');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  expect(await page.locator('#seed').inputValue()).toBe('42');
  expect(await page.locator('p[role="status"]').textContent()).toContain('restablecida');
  for (const width of [360, 180, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), { message: String(width) }).toBe(true);
  }
  expect(await page.getByRole('button', { name: 'Observar', exact: false }).getAttribute('aria-pressed')).toBe('true');
  expect(await page.getByRole('heading', { name: 'Una órbita, dos miradas' }).isVisible()).toBe(true);
  expect(await page.getByText(/No hay resultados de detección/).isVisible()).toBe(true);
}, 30000);
