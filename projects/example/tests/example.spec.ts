import { test, expect } from '@fixtures/base.fixture';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page, faker }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await page.waitForURL('**/intro');
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(/intro/);

  // valida que faker está disponível via fixture compartilhada
  expect(faker.person.fullName()).toBeTruthy();
});
