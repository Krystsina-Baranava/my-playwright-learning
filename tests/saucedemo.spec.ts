import { test, expect } from '@playwright/test';

// Verify that a specific product name is visible on the inventory page
test('find product by name', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.locator('[data-test="item-1-title-link"]')).toBeVisible();
});

// Practice list handling: count products, click by index, click by text filter
test('List handling - count, nth, filter', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Verify all 6 products are displayed
  const products = page.locator('.inventory_item');
  await expect(products, 'Should have 6 products').toHaveCount(6);

  // Click 2nd product by index and go back
  await products.nth(1).locator('.inventory_item_name').click();
  await page.goBack();

  // Find product by text and add it to cart
  await products.filter({ hasText: 'Sauce Labs Backpack' }).locator('[data-test*="add-to-cart"]').click();
  await expect(page.locator('.shopping_cart_badge'), 'Cart badge should show 1').toHaveText('1');
});

// Main Week 3 test suite
test.describe('SauceDemo', () => {

  // Task 1: Verify successful login redirects user to inventory page
  test('Login redirects to inventory', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page, 'Should redirect to inventory page').toHaveURL(/inventory/);
  });

  // Scenario 1: Locked-out user cannot log in and sees the exact error
  test.only('Locked-out user sees lockout error', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('locked_out_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(
      page.locator('[data-test="error"]'),
      'Locked-out user should see the lockout error message'
    ).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });

  // Task 2: Verify wrong password displays an error message
  test('Wrong password shows error message', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(
      page.locator('[data-test="error"]'),
      'Error message should appear for wrong credentials'
    ).toBeVisible();
  });

  // Task 3: Verify cart badge updates to 1 when a product is added
  test('Cart badge shows 1 after adding product', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart badge should show 1 after adding a product'
    ).toHaveText('1');
  });

  // Task 4: Verify cart badge disappears when product is removed
  test('Cart badge disappears after removing product', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart badge should not be visible after removing product'
    ).not.toBeVisible();
  });

  // Task 5: Verify empty login form shows validation error
  test('Empty login shows validation error', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(
      page.locator('[data-test="error"]'),
      'Error should appear when submitting empty form'
    ).toBeVisible();
  });

  // Task 7: Edge case - rapid add/remove clicks
  test('Rapid add and remove does not break cart', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    // Rapidly add and remove the same product
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    // Cart should be empty after equal add/remove cycles
    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart should be empty after add/remove cycles'
    ).not.toBeVisible();
  });


  // Bonus 1: Add 3 products, verify badge shows 3, remove one, verify badge shows 2
  test('Multiple products - add 3, remove 1', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart badge should show 3 after adding 3 products'
    ).toHaveText('3');

    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();

    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart badge should show 2 after removing 1 product'
    ).toHaveText('2');
  });

  // Bonus 2: Change sort order and verify first product changes
  test('Sorting changes product order', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    // Default sort - first product is Sauce Labs Backpack
    const firstProduct = page.locator('.inventory_item_name').first();
    await expect(firstProduct, 'First product should be Backpack by default').toHaveText('Sauce Labs Backpack');

    // Change to Price (low to high)
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

    // First product should change to Sauce Labs Onesie ($7.99)
    await expect(firstProduct, 'First product should be Onesie after sorting by price low to high').toHaveText('Sauce Labs Onesie');
  });

  // Bonus 3: Cart keeps item after page refresh
  test('Cart persists after refresh', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Refresh the page
    await page.reload();

    // Cart should still show 1
    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart badge should persist after page refresh'
    ).toHaveText('1');
  });

});