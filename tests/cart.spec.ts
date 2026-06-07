import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { users } from "../test-data/users";

// ===================== CART BEHAVIOR =====================
// As a shopper, I want my cart to update correctly
// when I add or remove products.
// Automation: uses page objects, semantic locators, no hard waits.

const BACKPACK = "sauce-labs-backpack";
const BIKE_LIGHT = "sauce-labs-bike-light";
const BOLT_TSHIRT = "sauce-labs-bolt-t-shirt";

test.describe("Cart behavior", () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page, "Should be logged in on the inventory page").toHaveURL(/inventory/);
  });

  // AC 1: cart badge shows the correct count after adding a product
  test("cart badge shows 1 after adding a product", async () => {
    await inventoryPage.addToCart(BACKPACK);

    await expect(
      inventoryPage.cartBadge,
      "Cart badge should show 1 after adding one product"
    ).toHaveText("1");
  });

  // AC 2: cart page shows the name of the selected product
  test("cart page shows the selected product name", async ({ page }) => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.goToCart();
    await expect(page, "Should be on the cart page").toHaveURL(/cart/);

    const cartPage = new CartPage(page);
    await expect(cartPage.cartItems, "Cart should contain one item").toHaveCount(1);
    await expect(
      cartPage.cartItems.getByText("Sauce Labs Backpack"),
      "Cart should show the selected product name"
    ).toBeVisible();
  });

  // AC 3: removing a product updates the cart (badge disappears / decrements)
  test("removing a product updates the cart", async () => {
    // Removing the only product hides the badge
    await inventoryPage.addToCart(BACKPACK);
    await expect(inventoryPage.cartBadge).toHaveText("1");

    await inventoryPage.removeFromCart(BACKPACK);
    await expect(
      inventoryPage.cartBadge,
      "Cart badge should disappear after removing the only product"
    ).toBeHidden();

    // With two products, removing one decrements the badge
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.addToCart(BIKE_LIGHT);
    await expect(inventoryPage.cartBadge).toHaveText("2");

    await inventoryPage.removeFromCart(BACKPACK);
    await expect(
      inventoryPage.cartBadge,
      "Cart badge should decrement to 1 after removing one of two products"
    ).toHaveText("1");
  });

  // AC 4: adding multiple products shows the correct badge count
  test("adding multiple products shows the correct badge count", async () => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.addToCart(BIKE_LIGHT);
    await inventoryPage.addToCart(BOLT_TSHIRT);

    await expect(
      inventoryPage.cartBadge,
      "Cart badge should show 3 after adding three products"
    ).toHaveText("3");
  });
});
