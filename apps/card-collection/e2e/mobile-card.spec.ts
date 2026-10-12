import { test, expect, Locator } from "@playwright/test";
import { STORAGE_KEY, goToQuiz, selectCategory, answerQuizCorrectly, setCollectionStateBeforeLoad, getCollectionState } from "./helpers/test-utils";

async function verifyFlip(card: Locator) {
  const front = card.getByTestId("card-front"), back = card.getByTestId("card-back");
  const source = card.getByTestId("card-image-attribution");
  await expect(front).toHaveAttribute("aria-hidden", "false");
  await expect(source).toHaveCount(1);
  await expect(source).toHaveCSS("backface-visibility", "hidden");
  await card.tap();
  await expect(back).toHaveAttribute("aria-hidden", "false");
  await expect(source).toHaveCount(0);
  await expect(back).toHaveCSS("backface-visibility", "hidden");
  await expect(back.locator(":scope > div")).toHaveCSS("background-color", "rgb(42, 37, 32)");
  await expect(back.getByText("所在地", { exact: true })).toBeVisible();
  await expect.poll(() => card.locator(".preserve-3d").evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m11)).toBeCloseTo(-1, 4);
  await card.tap();
  await expect(front).toHaveAttribute("aria-hidden", "false");
  await expect(source).toHaveCount(1);
  await card.tap();
  await card.tap();
  await expect(front).toHaveAttribute("aria-hidden", "false");
  await expect(source).toHaveCount(1);
  await expect.poll(() => card.locator(".preserve-3d").evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m11)).toBeCloseTo(1, 4);
}

test.beforeEach(async ({ page }) => { await page.setViewportSize({ width: 390, height: 844 }); });

test("390幅で通常カードの出典が裏面へ透過せず、連続タップ後も表面に戻る", async ({ page }) => {
  await setCollectionStateBeforeLoad(page, { collectedCardIds: ["silo-tohoku"] });
  await page.goto("/collection");
  const card = page.locator("#card-silo-tohoku").getByRole("button", { name: /^東北グレーンターミナルカード、/ });
  await verifyFlip(card);
  await page.screenshot({ path: "/Users/shosato/Documents/Codex/2026-10-12/task-2/qa-mobile-card-front.png" });
  expect((await getCollectionState(page))?.collectedCardIds).toEqual(["silo-tohoku"]);
});

test("390幅のNEW取得カードでも表裏の出典と文字が正常に表示される", async ({ page }) => {
  await page.addInitScript(key => localStorage.removeItem(key), STORAGE_KEY);
  await goToQuiz(page);
  await selectCategory(page, "silo");
  await answerQuizCorrectly(page);
  await page.getByRole("button", { name: /カードを見る/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("NEW!", { exact: true })).toBeVisible();
  const card = dialog.getByRole("button", { name: /カード。.*Enterキー/ });
  await verifyFlip(card);
  await card.tap();
  await expect(card.getByTestId("card-image-attribution")).toHaveCount(0);
  await expect.poll(() => card.locator(".preserve-3d").evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m11)).toBeCloseTo(-1, 4);
  await page.screenshot({ path: "/Users/shosato/Documents/Codex/2026-10-12/task-2/qa-mobile-new-card-back.png" });
  await card.tap();
  await expect(card.getByTestId("card-image-attribution")).toHaveCount(1);
  await card.getByTestId("card-image-attribution").locator("a").focus();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  expect((await getCollectionState(page))?.collectedCardIds.length).toBeGreaterThan(0);
});
