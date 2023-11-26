/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from "@playwright/test";

test("should display error, when one of inputs was not filled", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Fill inputs except for one
  await page.getByLabel("Type").click();
  await page.getByRole("option", { name: "Row houses" }).click();
  await page.getByLabel("Year").first().click();
  await page.getByRole("option", { name: "2015" }).click();
  await page.getByLabel("Quarter").first().click();
  await page.getByRole("option", { name: "2" }).click();
  await page.getByLabel("Year").nth(1).click();
  await page.getByRole("option", { name: "2018" }).click();
  await page.getByRole("button", { name: "Show Chart" }).click();

  await expect(page.getByRole("paragraph")).toContainText("Error: Please fill all form inputs.");
});
