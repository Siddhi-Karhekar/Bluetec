import { expect, test } from "@playwright/test";

const pages = [
  ["/", "puppies in Dubai"],
  ["/puppies", "Available puppies"],
  ["/gone-home", "Gone home"],
  ["/happy-families", "Happy families"],
  ["/how-it-works", "How it works"],
  ["/faq", "Questions & answers"],
  ["/contact", "Get in touch with us"],
  ["/puppies/maltipoo-max-male", "Max"],
] as const;

for (const [path, heading] of pages) {
  test(`${path} renders without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    expect(errors).toEqual([]);
  });
}

test("puppy filters update the list and the URL", async ({ page }) => {
  await page.goto("/puppies");
  await expect(page.getByText("15 puppies looking for a home")).toBeVisible();
  await page.getByRole("button", { name: "Korean Teacup" }).click();
  await expect(page).toHaveURL(/collection=korean-teacup/);
  await expect(page.getByText("5 puppies match")).toBeVisible();
  await page.getByRole("button", { name: "Boys" }).click();
  await expect(page.getByText("1 puppy match")).toBeVisible();
  await page.getByRole("button", { name: "Cavapoo" }).click();
  await expect(page.getByText("No puppies match just now.")).toBeVisible();
});

test("FAQ search filters and notes unfold", async ({ page }) => {
  await page.goto("/faq");
  await page.getByRole("searchbox").fill("korea");
  await expect(page.getByText("2 notes match")).toBeVisible();
  const first = page.locator(".tp-note__q button").first();
  await first.click();
  await expect(first).toHaveAttribute("aria-expanded", "true");
});

test("contact letter validates, then posts", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Post my letter" }).click();
  await expect(page.locator(".tp-letterform__alert")).toContainText("Please tell us your name");
  await page.getByLabel("Your name (required)").fill("Siddhi");
  await page.getByLabel(/Phone or WhatsApp/).fill("+971 50 123 4567");
  await page.getByRole("button", { name: "Post my letter" }).click();
  await expect(page.getByText("Your letter is in the mailbox!")).toBeVisible({ timeout: 8000 });
});

test("puppy gallery opens a full-screen viewer", async ({ page }) => {
  await page.goto("/puppies/maltipoo-female-2");
  await page.getByRole("button", { name: /full screen/ }).click();
  await expect(page.getByRole("dialog", { name: /photos/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: /photos/ })).toBeHidden();
});

test("enquiry API rejects invalid input", async ({ request }) => {
  const bad = await request.post("/api/enquiry", { data: { name: "A", phone: "x" } });
  expect(bad.status()).toBe(422);
  const ok = await request.post("/api/enquiry", { data: { name: "Siddhi", phone: "+971501234567" } });
  expect((await ok.json()).ok).toBe(true);
});

test("unknown pages show the lost-puppy page", async ({ page }) => {
  const res = await page.goto("/puppies/not-a-real-pup");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Lost puppy" })).toBeVisible();
});
