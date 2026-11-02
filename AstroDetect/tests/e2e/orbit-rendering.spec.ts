import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

async function brightStarPixels(page: Page): Promise<number> {
  const screenshot = await page.locator('.orbit-3d canvas').screenshot();
  return page.evaluate(async encoded => {
    const bytes = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
    const image = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
    const canvas = new OffscreenCanvas(image.width, image.height);
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);
    const data = context.getImageData(0, 0, image.width, image.height).data;
    image.close();
    let count = 0;
    for (let index = 0; index < data.length; index += 4) {
      if (data[index] > 150 && data[index + 1] > 80 && data[index] > data[index + 2] * 1.2) count++;
    }
    return count;
  }, screenshot.toString('base64'));
}

test('la estrella se dibuja y la cámara cambia la imagen sin modificar la medición', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const camera = page.getByRole('button', { name: 'Centrar cámara', exact: true });
  await expect(camera).toBeEnabled();
  await expect.poll(() => brightStarPixels(page)).toBeGreaterThan(100);
  const curve = await page.getByTestId('observed-curve').getAttribute('d');
  const clock = await page.getByTestId('clock').textContent();
  const before = await page.locator('.orbit-3d canvas').screenshot();
  await page.getByRole('button', { name: 'Girar a la izquierda', exact: true }).click();
  await page.getByRole('button', { name: 'Girar a la izquierda', exact: true }).click();
  const after = await page.locator('.orbit-3d canvas').screenshot();
  expect(after.equals(before)).toBe(false);
  await expect.poll(() => brightStarPixels(page)).toBeGreaterThan(100);
  await expect(page.getByTestId('observed-curve')).toHaveAttribute('d', curve!);
  await expect(page.getByTestId('clock')).toHaveText(clock!);
});

test('la escena permanece dibujada al cambiar el tamaño durante la guía pausada', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Centrar cámara', exact: true })).toBeEnabled();
  await expect.poll(() => brightStarPixels(page)).toBeGreaterThan(100);
  await page.getByRole('button', { name: 'Guía', exact: true }).click();
  const dialog = page.getByRole('dialog');
  for (let step = 1; step < 7; step++) await dialog.getByRole('button', { name: 'Siguiente', exact: true }).click();
  await expect(dialog.getByRole('heading', { name: 'Perspectiva libre de la órbita', exact: true })).toBeVisible();
  await page.setViewportSize({ width: 1100, height: 900 });
  await expect.poll(() => brightStarPixels(page)).toBeGreaterThan(100);
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect.poll(() => brightStarPixels(page)).toBeGreaterThan(100);
});

test('un fallo de descarga 3D se distingue de WebGL y permite recargar la escena', async ({ page }) => {
  await page.route('**/assets/orbitScene-*.js', route => route.abort('failed'));
  await page.goto('./');
  await expect(page.getByRole('status').filter({ hasText: 'No se pudo cargar el módulo de la vista 3D' })).toBeVisible();
  await expect(page.getByText('No se pudo iniciar la vista 3D (WebGL).', { exact: false })).toHaveCount(0);
  await expect(page.getByTestId('observed-curve')).toBeVisible();
  await page.unroute('**/assets/orbitScene-*.js');
  await page.getByRole('button', { name: 'Recargar la página', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Centrar cámara', exact: true })).toBeEnabled();
  await expect.poll(() => brightStarPixels(page)).toBeGreaterThan(100);
});

test('un fallo al iniciar WebGL permite reintentar sin perder el experimento', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    let failedCalls = 0;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (args[0] === 'webgl2' && failedCalls++ < 2) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto('./');
  await expect(page.getByRole('status').filter({ hasText: 'No se pudo iniciar la vista 3D (WebGL).' })).toBeVisible();
  await page.getByLabel('Período orbital (días)', { exact: true }).fill('10');
  await page.getByRole('button', { name: 'Ir al primer tránsito', exact: true }).click();
  const curve = await page.getByTestId('observed-curve').getAttribute('d');
  const clock = await page.getByTestId('clock').textContent();
  await page.getByRole('button', { name: 'Reintentar vista 3D', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Centrar cámara', exact: true })).toBeEnabled();
  await expect.poll(() => brightStarPixels(page)).toBeGreaterThan(100);
  await expect(page.getByLabel('Período orbital (días)', { exact: true })).toHaveValue('10');
  await expect(page.getByTestId('observed-curve')).toHaveAttribute('d', curve!);
  await expect(page.getByTestId('clock')).toHaveText(clock!);
});
