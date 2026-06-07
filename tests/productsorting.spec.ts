import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";
import { users } from "../test-data/users";

// ===================== PRODUCT SORTING =====================
// As a shopper, I want to sort products by price
// so I can find the cheapest one.
// Automation: uses page objects, semantic locators, no hard waits.

test.describe("Product sorting", () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page, "Should be logged in on the inventory page").toHaveURL(/inventory/);
  });

  // AC 1: user can select "Price (low to high)"
  test('user can select "Price (low to high)"', async () => {
    await productsPage.sortBy("Price (low to high)");

    await expect(
      productsPage.sortDropdown,
      'Sort dropdown should show "Price (low to high)" as selected'
    ).toHaveValue("lohi");
  });

  // AC 2: product prices are displayed in ascending order
  test("prices are displayed in ascending order after sorting", async () => {
    await productsPage.sortBy("Price (low to high)");

    // Re-read prices until the page settles (web-first: auto-retries on re-render)
    await expect
      .poll(
        async () => {
          const prices = await productsPage.getPrices();
          const sorted = [...prices].sort((a, b) => a - b);
          // true only when the page order already matches ascending order
          return JSON.stringify(prices) === JSON.stringify(sorted);
        },
        { message: "Prices on the page should be sorted from low to high" }
      )
      .toBe(true);
  });
});
