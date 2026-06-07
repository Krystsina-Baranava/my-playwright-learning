import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { users, wrongPassword } from "../test-data/users";

test.describe("Login", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  // AC 1: standard_user can log in and sees the inventory page
  test("standard user can log in", async ({ page }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
    await expect(
      page.locator(".inventory_list"),
      "Inventory list should be visible after login"
    ).toBeVisible();
  });

  // AC 2: locked_out_user cannot log in and sees the lockout error
  test("locked user sees error message", async ({ page }) => {
    await loginPage.login(users.locked.username, users.locked.password);
    await expect(page).not.toHaveURL(/inventory/);
    await expect(loginPage.errorMessage).toContainText(
      "Sorry, this user has been locked out."
    );
  });

  // AC 3: wrong password shows an error message
  test("wrong password shows an error message", async ({ page }) => {
    await loginPage.login(users.standard.username, wrongPassword);
    await expect(page).not.toHaveURL(/inventory/);
    await expect(loginPage.errorMessage).toContainText(
      "Username and password do not match any user in this service"
    );
  });

  // AC 4: empty username shows a validation error
  test("empty username shows a validation error", async () => {
    // Leave the username empty, fill only the password
    await loginPage.passwordInput.fill(users.standard.password);
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toContainText("Username is required");
  });
});
