import { type Locator, type Page } from "@playwright/test";

export class ProductsPage {
  readonly page: Page;
  readonly sortDropdown: Locator;
  readonly prices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortDropdown = page.getByTestId("product-sort-container");
    this.prices = page.locator(".inventory_item_price");
  }

  // Select a sort option by its visible label, e.g. "Price (low to high)"
  async sortBy(label: string) {
    await this.sortDropdown.selectOption({ label });
  }

  // Collect every price on the page and parse it as a number
  // Example: "$29.99" -> 29.99
  async getPrices(): Promise<number[]> {
    const priceTexts = await this.prices.allTextContents();
    return priceTexts.map((text) => Number(text.replace("$", "")));
  }
}
