import { expect, test } from "@playwright/test";

async function signIn(page, email = "lead@casewatch.test") {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Alert queue" })).toBeVisible();
}

test("signs in and shows the alert queue", async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole("link", { name: "Layering" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Structuring" })).toBeVisible();
});

test("opens an alert, streams the assessment, and clears it as lead", async ({ page }) => {
  await signIn(page);
  await page.getByRole("link", { name: "Layering" }).click();

  // generative assessment streams in one card per factor, then a verdict
  await expect(page.getByTestId("factor-card")).toHaveCount(2);
  await expect(page.getByTestId("verdict")).toContainText("escalate");

  // transaction timeline rendered
  await expect(page.getByText("Transactions (2)")).toBeVisible();

  await page.getByLabel("Note").fill("reviewed, benign");
  await page.getByRole("button", { name: "Clear" }).click();
  await expect(page.getByText("Saved.")).toBeVisible();
});

test("analyst cannot clear or escalate", async ({ page }) => {
  await signIn(page, "analyst@casewatch.test");
  await page.getByRole("link", { name: "Layering" }).click();

  await expect(page.getByRole("button", { name: "Clear" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Escalate" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Assign" })).toBeEnabled();
});

test("redirects unauthenticated users to login", async ({ page }) => {
  await page.goto("/alerts");
  await expect(page).toHaveURL(/\/login$/);
});
