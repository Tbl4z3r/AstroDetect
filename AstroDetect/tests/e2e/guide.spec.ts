import { test, expect } from '@playwright/test';

test('la guía recorre los elementos, mantiene el experimento y devuelve el foco', async ({ page }) => {
  await page.goto('./');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Ir al primer tránsito', exact: true }).click();
  await page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true }).click();
  const curve = await page.getByTestId('observed-curve').getAttribute('d');
  const clock = await page.getByTestId('clock').textContent();
  const guide = page.getByRole('button', { name: 'Guía', exact: true });
  await guide.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Radio de la estrella', exact: true })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Atrás', exact: true })).toBeDisabled();
  await expect(dialog.getByRole('button', { name: 'Cerrar guía', exact: true })).toBeFocused();
  await dialog.getByRole('button', { name: 'Siguiente', exact: true }).click();
  await expect(dialog.getByRole('heading', { name: 'Radio del planeta', exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: 'Atrás', exact: true }).click();
  await expect(dialog.getByRole('heading', { name: 'Radio de la estrella', exact: true })).toBeVisible();
  for (let index = 1; index < 12; index++) {
    await dialog.getByRole('button', { name: 'Siguiente', exact: true }).click();
    await expect(dialog.locator('.tour-progress')).toContainText(`Paso ${index + 1} de 12`);
  }
  await dialog.getByRole('button', { name: 'Terminar', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(guide).toBeFocused();
  await expect(page.getByTestId('clock')).toHaveText(clock!);
  await expect(page.getByTestId('observed-curve')).toHaveAttribute('d', curve!);
  await expect(page.getByTestId('detection-results')).toContainText('Eventos identificados: 5');
});

test('en móvil la guía contiene el foco, cabe en la pantalla y restaura la vista previa al salir', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.getByRole('button', { name: 'Entender', exact: false }).click();
  const guide = page.getByRole('button', { name: 'Guía', exact: true });
  await guide.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Radio de la estrella', exact: true })).toBeVisible();
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  }
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press('Shift+Tab');
    expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  }
  for (let index = 0; index < 12; index++) {
    const bounds = await dialog.locator('.tour-caption').boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(640);
    if (index < 11) await dialog.getByRole('button', { name: 'Siguiente', exact: true }).click();
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(guide).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Leer lo que cuenta una estrella', exact: true })).toBeVisible();
  await guide.click();
  await expect(page.getByRole('dialog').locator('.tour-progress')).toContainText('Paso 1 de 12');
  await page.getByRole('button', { name: 'Cerrar guía', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
