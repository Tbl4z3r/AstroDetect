import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

async function sharedTime(page: Page) {
  return page.getByRole('img', { name: 'Vista del tránsito desde el observador', exact: false }).getAttribute('data-time-days');
}

for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test(`reproducción explícita, pausa y reinicio con preferencia ${reducedMotion}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.setViewportSize({ width: reducedMotion === 'reduce' ? 360 : 1280, height: 900 });
    await page.goto('./');
    await expect(page.getByRole('button', { name: 'Centrar cámara', exact: true })).toBeEnabled();
    await page.clock.install({ time: new Date('2026-11-02T12:00:00Z') });
    await page.clock.pauseAt(new Date('2026-11-02T12:00:01Z'));
    const play = page.getByRole('button', { name: 'Reproducir', exact: true });
    await expect(play).toBeEnabled();
    await page.clock.runFor(500);
    expect(await sharedTime(page)).toBe('0');
    await page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true }).click();
    const curve = await page.getByTestId('observed-curve').getAttribute('d');
    const results = await page.getByTestId('detection-results').textContent();
    const canvas = page.locator('.orbit-3d canvas');
    const initialFrame = await canvas.screenshot();
    await play.press('Enter');
    await page.clock.runFor(1000);
    const runningTime = await sharedTime(page);
    expect(Number(runningTime)).toBeGreaterThan(0);
    await expect(page.getByRole('img', { name: 'Curva de brillo simulada', exact: false })).toHaveAttribute('data-time-days', runningTime!);
    expect((await canvas.screenshot()).equals(initialFrame)).toBe(false);
    await page.getByRole('button', { name: 'Pausar', exact: true }).click();
    const pausedTime = await sharedTime(page);
    await page.clock.runFor(500);
    expect(await sharedTime(page)).toBe(pausedTime);
    await play.click();
    await page.clock.runFor(500);
    expect(Number(await sharedTime(page))).toBeGreaterThan(Number(pausedTime));
    await page.getByLabel('Tiempo simulado (días)', { exact: true }).press('End');
    expect(await sharedTime(page)).toBe('25');
    await play.click();
    await page.clock.runFor(100);
    expect(Number(await sharedTime(page))).toBeGreaterThan(0);
    expect(Number(await sharedTime(page))).toBeLessThan(1);
    await page.getByRole('button', { name: 'Volver al inicio', exact: true }).click();
    await page.clock.runFor(500);
    expect(await sharedTime(page)).toBe('0');
    await expect(play).toBeVisible();
    await expect(page.getByTestId('observed-curve')).toHaveAttribute('d', curve!);
    await expect(page.getByTestId('detection-results')).toHaveText(results!);
    await expect(page.locator('#seed')).toHaveValue('42');
  });
}

test('cambiar la preferencia y abrir la guía pausa sin impedir una nueva reproducción', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('./');
  await page.clock.install({ time: new Date('2026-11-02T12:00:00Z') });
  await page.clock.pauseAt(new Date('2026-11-02T12:00:01Z'));
  const play = page.getByRole('button', { name: 'Reproducir', exact: true });
  await play.click();
  await page.clock.runFor(500);
  expect(Number(await sharedTime(page))).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(play).toBeEnabled();
  const stopped = await sharedTime(page);
  await page.clock.runFor(500);
  expect(await sharedTime(page)).toBe(stopped);
  await play.click();
  await page.clock.runFor(500);
  expect(Number(await sharedTime(page))).toBeGreaterThan(Number(stopped));
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  const paused = await sharedTime(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.runFor(500);
  expect(await sharedTime(page)).toBe(paused);
  await play.click();
  await page.clock.runFor(500);
  await page.getByRole('button', { name: 'Guía', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const guidedTime = await sharedTime(page);
  await page.clock.runFor(500);
  expect(await sharedTime(page)).toBe(guidedTime);
  await page.getByRole('button', { name: 'Cerrar guía', exact: true }).click();
  await page.clock.runFor(500);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(play).toBeVisible();
  expect(await sharedTime(page)).toBe(guidedTime);
  await play.click();
  await page.clock.runFor(500);
  expect(Number(await sharedTime(page))).toBeGreaterThan(Number(guidedTime));
});
