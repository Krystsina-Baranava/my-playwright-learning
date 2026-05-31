import { test, expect } from '@playwright/test';

// ===================== WEEK 4 (refactored) =====================

test.describe('SauceDemo', () => {

  // --- Login error tests (no beforeEach needed) ---

  test('Wrong password shows error message', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(
      page.locator('[data-test="error"]'),
      'Error message should appear for wrong credentials'
    ).toBeVisible();
  });

  test('Empty login shows validation error', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(
      page.locator('[data-test="error"]'),
      'Error should appear when submitting empty form'
    ).toBeVisible();
  });

  // --- Tests that require an authenticated user ---

  test.describe('Logged in user', () => {

    // Runs before every test in this block — handles login once
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByPlaceholder('Username').fill('standard_user');
      await page.getByPlaceholder('Password').fill('secret_sauce');
      await page.getByRole('button', { name: 'Login' }).click();
    });

    test('Login redirects to inventory', async ({ page }) => {
      await expect(page, 'Should redirect to inventory page').toHaveURL(/inventory/);
    });

    test('Cart badge shows 1 after adding product', async ({ page }) => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

      await expect(
        page.locator('[data-test="shopping-cart-badge"]'),
        'Cart badge should show 1 after adding a product'
      ).toHaveText('1');
    });

    test('Cart badge disappears after removing product', async ({ page }) => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

      await expect(
        page.locator('[data-test="shopping-cart-badge"]'),
        'Cart badge should not be visible after removing product'
      ).not.toBeVisible();
    });

    test('Rapid add and remove does not break cart', async ({ page }) => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

      await expect(
        page.locator('[data-test="shopping-cart-badge"]'),
        'Cart should be empty after add/remove cycles'
      ).not.toBeVisible();
    });

    test('Multiple products - add 3, remove 1', async ({ page }) => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
      await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

      await expect(
        page.locator('[data-test="shopping-cart-badge"]'),
        'Cart badge should show 3 after adding 3 products'
      ).toHaveText('3');

      await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();

      await expect(
        page.locator('[data-test="shopping-cart-badge"]'),
        'Cart badge should show 2 after removing 1 product'
      ).toHaveText('2');
    });

    test('Sorting changes product order', async ({ page }) => {
      const firstProduct = page.locator('[data-test="inventory-item-name"]').first();
      await expect(firstProduct, 'First product should be Backpack by default').toHaveText('Sauce Labs Backpack');

      await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

      await expect(firstProduct, 'First product should be Onesie after sorting by price low to high').toHaveText('Sauce Labs Onesie');
    });

    test('Cart persists after refresh', async ({ page }) => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await expect(
        page.locator('[data-test="shopping-cart-badge"]'),
        'Cart badge should show 1 after adding product'
      ).toHaveText('1');

      await page.reload();

      await expect(
        page.locator('[data-test="shopping-cart-badge"]'),
        'Cart badge should persist after page refresh'
      ).toHaveText('1');
    });
  });
});
