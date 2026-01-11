import { test, expect } from "@playwright/test";
import {
  clearLocalStorage,
  setCollectionStateBeforeLoad,
} from "./helpers/test-utils";

test.describe("FlipCard機能", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearLocalStorage(page);
    await page.reload();
  });

  test("獲得済みカードをクリックでフリップできる", async ({ page }) => {
    // addInitScript を使ってページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["grain-wheat"],
    });
    await page.goto("/collection");

    // 穀物フィルターを選択
    await page.locator("button").filter({ hasText: "穀物" }).click();
    await page.waitForTimeout(500);

    // 獲得済みカード（role="button"でtabIndex=0のカード）をクリック
    const collectedCards = page.locator('[role="button"][tabindex="0"]');
    await expect(collectedCards.first()).toBeVisible({ timeout: 5000 });
    await collectedCards.first().click();

    // フリップ後、裏面データが表示される
    await page.waitForTimeout(800);
    await expect(page.locator("text=主要産地").first()).toBeVisible({ timeout: 3000 });
  });

  test("Enterキーでフリップできる", async ({ page }) => {
    // addInitScript を使ってページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["grain-wheat"],
    });
    await page.goto("/collection");
    await page.locator("button").filter({ hasText: "穀物" }).click();
    await page.waitForTimeout(500);

    // 獲得済みカードにフォーカス
    const collectedCards = page.locator('[role="button"][tabindex="0"]');
    await expect(collectedCards.first()).toBeVisible({ timeout: 5000 });
    await collectedCards.first().focus();

    // Enterキーでフリップ
    await page.keyboard.press("Enter");

    // 裏面データが表示される
    await page.waitForTimeout(800);
    await expect(page.locator("text=主要産地").first()).toBeVisible({ timeout: 3000 });
  });

  test("Spaceキーでフリップできる", async ({ page }) => {
    // addInitScript を使ってページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["grain-wheat"],
    });
    await page.goto("/collection");
    await page.locator("button").filter({ hasText: "穀物" }).click();
    await page.waitForTimeout(500);

    // 獲得済みカードにフォーカス
    const collectedCards = page.locator('[role="button"][tabindex="0"]');
    await expect(collectedCards.first()).toBeVisible({ timeout: 5000 });
    await collectedCards.first().focus();

    // Spaceキーでフリップ
    await page.keyboard.press("Space");

    // 裏面データが表示される
    await page.waitForTimeout(800);
    await expect(page.locator("text=主要産地").first()).toBeVisible({ timeout: 3000 });
  });

  test("未獲得カードはクイズに遷移する", async ({ page }) => {
    // 空の状態（カード未獲得）
    await page.goto("/collection");

    // 穀物フィルターを選択
    await page.locator("button").filter({ hasText: "穀物" }).click();
    await page.waitForTimeout(500);

    // 未獲得カードをクリック（クイズ遷移）
    const uncollectedCard = page
      .getByRole("link", { name: /クイズに挑戦する/ })
      .first();
    await expect(uncollectedCard).toBeVisible({ timeout: 5000 });
    await uncollectedCard.click();

    // クイズページに遷移し、問題が表示される
    await expect(page).toHaveURL(/\/quiz\?cardId=/);
    await expect(
      page.getByRole("heading", { level: 3 }).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test("フリップ後に裏面データが表示される", async ({ page }) => {
    // addInitScript を使ってページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["grain-wheat"],
    });
    await page.goto("/collection");

    await page.locator("button").filter({ hasText: "穀物" }).click();
    await page.waitForTimeout(500);

    // カードをクリックしてフリップ
    const collectedCards = page.locator('[role="button"][tabindex="0"]');
    await expect(collectedCards.first()).toBeVisible({ timeout: 5000 });
    await collectedCards.first().click();

    // 裏面データが表示される（穀物カードの場合）
    await page.waitForTimeout(800);
    await expect(page.locator("text=主要産地").first()).toBeVisible({ timeout: 3000 });
    await expect(page.locator("text=主な用途").first()).toBeVisible();
  });

  test("再度クリックで表面に戻る", async ({ page }) => {
    // addInitScript を使ってページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["grain-wheat"],
    });
    await page.goto("/collection");
    await page.locator("button").filter({ hasText: "穀物" }).click();
    await page.waitForTimeout(500);

    // カードをクリックしてフリップ
    const collectedCards = page.locator('[role="button"][tabindex="0"]');
    await expect(collectedCards.first()).toBeVisible({ timeout: 5000 });
    await collectedCards.first().click();

    // 裏面データが表示される
    await page.waitForTimeout(800);
    await expect(page.locator("text=主要産地").first()).toBeVisible({ timeout: 3000 });

    // 再度クリック
    await collectedCards.first().click();

    // 表面に戻る（カード名が表示されている）
    await page.waitForTimeout(800);
    await expect(page.locator("text=小麦").first()).toBeVisible({ timeout: 3000 });
  });
});
