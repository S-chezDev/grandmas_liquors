import { test, expect } from '@playwright/test';

test('landing page loads and exposes login UI', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText(/Grandma's Liqueurs/i).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Iniciar Sesión/i }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Registrarse/i }).first()).toBeVisible();
});
