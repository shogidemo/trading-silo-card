import { test, expect } from "@playwright/test";

test.describe("サイロマップ", () => {
  test("ホームページからマップページに遷移できる", async ({ page }) => {
    await page.goto("/");

    // マップボタンが表示される
    await expect(page.locator("text=サイロマップ")).toBeVisible();

    // マップページに遷移
    await page.click("text=サイロマップ");

    // マップページのヘッダーが表示される
    await expect(
      page.locator("h2").filter({ hasText: "サイロマップ" })
    ).toBeVisible();
  });

  test("マップページが正しく表示される", async ({ page }) => {
    await page.goto("/map");

    // ヘッダーが表示される
    await expect(
      page.locator("h2").filter({ hasText: "サイロマップ" })
    ).toBeVisible();
    await expect(
      page.locator("text=日本全国のサイロの位置を確認しましょう")
    ).toBeVisible();

    // 戻るリンクが表示される
    await expect(page.locator("text=ホームに戻る")).toBeVisible();

    // サイドバーのサイロ一覧が表示される
    await expect(
      page.locator("h3").filter({ hasText: "サイロ一覧" })
    ).toBeVisible();

    // 凡例が表示される
    await expect(page.locator("text=獲得済みサイロ")).toBeVisible();
    await expect(page.locator("text=未獲得サイロ")).toBeVisible();
  });

  test("地図コンテナが表示される", async ({ page }) => {
    await page.goto("/map");

    // Leaflet地図コンテナが表示されるまで待機
    await expect(page.locator(".leaflet-container")).toBeVisible({
      timeout: 10000,
    });

    // OpenStreetMap帰属表示が表示される
    await expect(page.locator("text=OpenStreetMap")).toBeVisible();
  });

  test("サイドバーにサイロが5つ表示される", async ({ page }) => {
    await page.goto("/map");

    // サイドバー内のボタン（サイロリスト）を取得
    const siloButtons = page
      .locator(".vintage-border")
      .first()
      .locator("button");

    // 5つのサイロが表示される
    await expect(siloButtons).toHaveCount(5);
  });

  test("サイドバーのサイロをクリックすると選択状態になる", async ({
    page,
  }) => {
    await page.goto("/map");

    // Leaflet地図が読み込まれるまで待機
    await expect(page.locator(".leaflet-container")).toBeVisible({
      timeout: 10000,
    });

    // 最初のサイロボタンをクリック
    const firstSiloButton = page
      .locator(".vintage-border")
      .first()
      .locator("button")
      .first();
    await firstSiloButton.click();

    // 選択状態のスタイルが適用される（bg-slate-600）
    await expect(firstSiloButton).toHaveClass(/bg-slate-600/);
  });

  test("戻るリンクでホームページに戻れる", async ({ page }) => {
    await page.goto("/map");

    // 戻るリンクをクリック
    await page.click("text=ホームに戻る");

    // ホームページに戻る
    await expect(page.locator("h2").first()).toContainText("穀物の世界を");
  });

  test("マーカーが地図上に表示される", async ({ page }) => {
    await page.goto("/map");

    // Leaflet地図が読み込まれるまで待機
    await expect(page.locator(".leaflet-container")).toBeVisible({
      timeout: 10000,
    });

    // マーカーが表示される（未収集状態なので?マーク）
    await expect(page.locator(".silo-marker-uncollected").first()).toBeVisible({
      timeout: 5000,
    });
  });
});
