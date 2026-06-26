import { test, expect } from '@playwright/test';

test('landing navigation allows access to login and products section', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /Iniciar Sesión/i }).first().click();
  await expect(page.getByRole('heading', { name: /Bienvenido/i }).first()).toBeVisible();

  await page.goto('/');
  await page.locator('text=Productos').first().scrollIntoViewIfNeeded();
  await expect(page.locator('#productos')).toBeVisible();
  await expect(page.getByText(/Productos Destacados/i)).toBeVisible();
});
