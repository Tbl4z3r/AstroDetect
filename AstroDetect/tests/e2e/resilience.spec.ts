import { test, expect } from '@playwright/test';

test('los deslizadores conservan los valores numéricos válidos sin redondearlos', async ({ page }) => {
  await page.goto('./');
  for (const [id, value] of [['starRadiusSolar', '1.234'], ['planetRadiusEarth', '10.1234'], ['periodDays', '5.1234'], ['noisePpm', '25.5']]) {
    const number = page.locator(`#${id}`);
    const slider = page.locator(`#${id}`).locator('..').getByRole('slider');
    await number.fill(value);
    await expect(number).toHaveAttribute('aria-invalid', 'false');
    await expect(slider).toHaveValue(value);
    await slider.press('ArrowRight');
    const updated = await slider.inputValue();
    expect(Number(updated)).toBeGreaterThan(Number(value));
    await expect(number).toHaveValue(updated);
    await expect(page.getByTestId('series-summary')).toContainText('5001 muestras completas');
  }
});

test('la pérdida temporal de WebGL se comunica y permite recuperar la vista sin perder datos', async ({ page }) => {
  await page.goto('./');
  const camera = page.getByRole('button', { name: 'Centrar cámara', exact: true });
  await expect(camera).toBeEnabled();
  await page.getByRole('button', { name: 'Ir al primer tránsito', exact: true }).click();
  const clock = await page.getByTestId('clock').textContent();
  const curve = await page.getByTestId('observed-curve').getAttribute('d');
  const canvas = page.locator('.orbit-3d canvas');
  const supported = await canvas.evaluate(element => {
    const context = (element as HTMLCanvasElement).getContext('webgl2');
    const extension = context?.getExtension('WEBGL_lose_context');
    if (!extension) return false;
    element.addEventListener('qa-restore-webgl', () => extension.restoreContext(), { once: true });
    extension.loseContext();
    return true;
  });
  expect(supported).toBe(true);
  await expect(page.getByRole('status').filter({ hasText: 'Se interrumpió temporalmente la vista 3D' })).toBeVisible();
  await expect(camera).toBeDisabled();
  await expect(page.getByTestId('clock')).toHaveText(clock!);
  await expect(page.getByTestId('observed-curve')).toHaveAttribute('d', curve!);
  await page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true }).click();
  await expect(page.getByTestId('detection-results')).toContainText('Eventos identificados: 5');
  await canvas.evaluate(element => element.dispatchEvent(new Event('qa-restore-webgl')));
  await expect(camera).toBeEnabled();
  await expect(page.getByText('Se interrumpió temporalmente la vista 3D', { exact: false })).toHaveCount(0);
  await expect(canvas).toBeVisible();
  await expect(page.getByTestId('clock')).toHaveText(clock!);
  await expect(page.getByTestId('observed-curve')).toHaveAttribute('d', curve!);
});

test('las recuperaciones repetidas liberan los contextos gráficos anteriores', async ({ page }) => {
  const warnings: string[] = [];
  page.on('console', message => { if (/too many active webgl contexts/i.test(message.text())) warnings.push(message.text()); });
  await page.goto('./');
  const mass = page.getByLabel('Masa de la estrella (masas solares)', { exact: true });
  const camera = page.getByRole('button', { name: 'Centrar cámara', exact: true });
  await expect(camera).toBeEnabled();
  for (let index = 0; index < 24; index++) {
    await mass.fill('');
    await expect(page.getByRole('alert')).toBeVisible();
    await mass.fill('1');
    await expect(camera).toBeEnabled();
  }
  await page.getByRole('button', { name: 'Buscar posibles tránsitos', exact: true }).click();
  await expect(page.getByTestId('detection-results')).toContainText('Eventos identificados: 5');
  expect(warnings).toEqual([]);
});
