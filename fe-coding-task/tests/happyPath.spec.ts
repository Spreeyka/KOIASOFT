/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from "@playwright/test";

test("should be able to input form data, add comment, select favorite and go back to previous screen", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  // Filling inputs
  await page.goto("http://localhost:3000/");
  await page.getByLabel("Type").click();
  await page.getByRole("option", { name: "Total" }).click();
  await page.getByLabel("Year").first().click();
  await page.getByRole("option", { name: "2013" }).click();
  await page.getByLabel("Quarter").first().click();
  await page.getByRole("option", { name: "1" }).click();
  await page.getByLabel("Year").nth(1).click();
  await page.getByRole("option", { name: "2016" }).click();
  await page.getByLabel("Quarter").nth(1).click();
  await page.getByRole("option", { name: "3" }).click();

  await page.getByRole("button", { name: "Show Chart" }).click();

  await expect(page.locator("figcaption")).toContainText('Prices for dwelling type "total"');

  // saving to favorite
  await page.getByRole("button").first().click();

  // adding and editing comments
  await page.getByLabel("add").click();
  await page.locator("#comment").click();
  await page.locator("#comment").fill("Example comment2");
  await page.getByLabel("add").click();
  await page.locator("span").filter({ hasText: "Example comment2" }).locator("div").hover();
  await page.getByLabel("edit comment").click();
  await page.getByRole("list").getByRole("textbox").fill("Example comment5");
  await page.getByLabel("confirm editing").click();

  await expect(page.getByRole("list")).toContainText("Example comment5");

  //checking, if saved stats display properly on previous screen
  await page.goto("http://localhost:3000/");
  await expect(page.getByRole("heading", { name: "Saved charts" })).toBeVisible();
});
