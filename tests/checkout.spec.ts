import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { users } from "../test-data/users";

// ===================== CHECKOUT FLOW =====================
// As a shopper, I want to complete a purchase successfully.
// Automation: uses page objects, semantic locators, no hard waits, test.step.

const BACKPACK = "sauce-labs-backpack";
const PRODUCT_NAME = "Sauce Labs Backpack";

test.describe("Checkout flow", () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await test.step("Log in as the standard user", async () => {
      await loginPage.open();
      await loginPage.login(users.standard.username, users.standard.password);
    });

    await test.step("Add a product and open the cart", async () => {
      await inventoryPage.addToCart(BACKPACK);
      await inventoryPage.goToCart();
    });

    await test.step("Start checkout", async () => {
      await cartPage.checkout();
      await expect(page, "Should be on the checkout information step").toHaveURL(
        /checkout-step-one/
      );
    });
  });

  // AC 1: user can enter first name, last name, and postal code
  test("user can enter customer information and continue", async ({ page }) => {
    await test.step("Fill in customer information", async () => {
      await checkoutPage.fillInformation("Krystsina", "Baranava", "12345");
    });

    await test.step("Move to the overview step", async () => {
      await expect(page, "Continuing should move to the overview step").toHaveURL(
        /checkout-step-two/
      );
    });
  });

  // AC 2: overview page shows the selected product
  test("overview page shows the selected product", async ({ page }) => {
    await test.step("Fill in customer information and continue", async () => {
      await checkoutPage.fillInformation("Krystsina", "Baranava", "12345");
      await expect(page).toHaveURL(/checkout-step-two/);
    });

    await test.step("Verify the selected product is listed", async () => {
      await expect(
        page.getByText(PRODUCT_NAME),
        "Overview should list the selected product"
      ).toBeVisible();
    });
  });

  // AC 3 & 4: finish completes the order and shows the success message
  test("finishing the order shows the success message", async () => {
    await test.step("Fill in customer information and continue", async () => {
      await checkoutPage.fillInformation("Krystsina", "Baranava", "12345");
    });

    await test.step("Finish the order", async () => {
      await checkoutPage.finish();
    });

    await test.step("Verify the success message", async () => {
      await expect(
        checkoutPage.completeHeader,
        "Success message should appear after completing checkout"
      ).toHaveText("Thank you for your order!");
    });
  });
});
