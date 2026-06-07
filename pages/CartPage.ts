import { type Locator, type Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByTestId("checkout");
    this.cartItems = page.locator(".cart_item");
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
