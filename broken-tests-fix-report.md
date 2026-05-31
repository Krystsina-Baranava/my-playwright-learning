# Broken Tests Fix Report

## Test #1: login should redirect to inventory

**Root cause:** Wrong placeholder text — `"User Name"` (with space) instead of `"Username"` (no space)

**Fix:** Changed `getByPlaceholder("User Name")` to `getByPlaceholder("Username")`

**How I verified:** Ran `npx playwright test tests/broken-tests.spec.ts --headed` — test passes ✅

---

## Test #2: error message on wrong password

**Root cause:** Two issues:
1. `getByTestId("error")` looks for `data-testid`, but the site uses `data-test`
2. Expected text was incomplete — missing "Epic sadface:" prefix and full ending

**Fix:** Changed to `page.locator('[data-test="error"]')` and updated text to `"Epic sadface: Username and password do not match any user in this service"`

**How I verified:** Ran `npx playwright test tests/broken-tests.spec.ts --headed` — test passes ✅

---

## Test #3: cart badge appears after adding product

**Root cause:** Missing `await` before `.click()` — Playwright checked the cart badge before the click finished, so the product was not added yet

**Fix:** Added `await` before `page.locator("[data-test=\"add-to-cart-sauce-labs-backpack\"]").click()`

**How I verified:** Ran `npx playwright test tests/broken-tests.spec.ts --headed` — test passes ✅
