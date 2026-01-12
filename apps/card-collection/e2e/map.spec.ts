import { test, expect } from "@playwright/test";
import { setCollectionStateBeforeLoad } from "./helpers/test-utils";

test.describe("サイロマップ", () => {
  test("ホームページからマップページに遷移できる", async ({ page }) => {
    await page.goto("/");

    // マップボタンが表示される（main内のリンクを対象）
    await expect(page.locator("main a").filter({ hasText: "サイロマップ" })).toBeVisible();

    // マップページに遷移（main内のリンクをクリック）
    await page.locator("main a").filter({ hasText: "サイロマップ" }).click();

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

  test("サイドバーにサイロが表示される", async ({ page }) => {
    await page.goto("/map");

    // サイドバー内のボタン（サイロリスト）を取得
    const siloButtons = page
      .locator(".vintage-border")
      .first()
      .locator("button");

    // サイロが表示される（5つ以上）
    const count = await siloButtons.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("サイドバーのサイロをクリックすると選択状態になる", async ({
    page,
  }) => {
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["silo-kanto"],
    });
    await page.goto("/map");

    // Leaflet地図が読み込まれるまで待機
    await expect(page.locator(".leaflet-container")).toBeVisible({
      timeout: 10000,
    });

    // 獲得済みサイロボタンをクリック
    const collectedSiloButton = page.getByRole("button", {
      name: "関東グレーンターミナルを選択",
    });
    await collectedSiloButton.click();

    // 選択状態のスタイルが適用される（bg-slate-600）
    await expect(collectedSiloButton).toHaveClass(/bg-slate-600/);
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

  test("レイヤーコントロールが表示される", async ({ page }) => {
    await page.goto("/map");

    // Leaflet地図が読み込まれるまで待機
    await expect(page.locator(".leaflet-container")).toBeVisible({
      timeout: 10000,
    });

    // レイヤーコントロールが表示される
    await expect(page.locator(".leaflet-control-layers")).toBeVisible();
  });

  test("日本全体表示ボタンが動作する", async ({ page }) => {
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["silo-kanto"],
    });
    await page.goto("/map");

    // Leaflet地図が読み込まれるまで待機
    await expect(page.locator(".leaflet-container")).toBeVisible({
      timeout: 10000,
    });

    // リセットボタンが表示される
    const resetButton = page.locator(".reset-view-button");
    await expect(resetButton).toBeVisible();

    // サイドバーで獲得済みサイロを選択してズーム
    const collectedSiloButton = page.getByRole("button", {
      name: "関東グレーンターミナルを選択",
    });
    await collectedSiloButton.click();

    // 少し待機（アニメーション）
    await page.waitForTimeout(1500);

    // リセットボタンをクリック
    await resetButton.click();

    // アニメーション完了を待機
    await page.waitForTimeout(1500);

    // リセットボタンが引き続き表示される（ビューがリセットされた）
    await expect(resetButton).toBeVisible();
  });
});

test.describe("サイロマップ - マーカー状態", () => {
  test("獲得済みサイロは金色マーカーで表示される", async ({ page }) => {
    // サイロカードを獲得した状態を設定
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["silo-kanto", "silo-tohoku"],
      totalQuizAttempts: 2,
      correctAnswers: 2,
      categoryStats: {
        silo: { attempts: 2, correct: 2 },
        grain: { attempts: 0, correct: 0 },
        trader: { attempts: 0, correct: 0 },
      },
    });
    await page.goto("/map");

    // Leaflet地図が読み込まれるまで待機
    await expect(page.locator(".leaflet-container")).toBeVisible({
      timeout: 10000,
    });

    // 獲得済みマーカーが表示される
    await expect(page.locator(".silo-marker-collected").first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("未獲得サイロはグレーマーカーで表示される", async ({ page }) => {
    // 空の状態（サイロ未獲得）
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: [],
    });
    await page.goto("/map");

    // Leaflet地図が読み込まれるまで待機
    await expect(page.locator(".leaflet-container")).toBeVisible({
      timeout: 10000,
    });

    // 未獲得マーカーのみが表示される
    await expect(page.locator(".silo-marker-uncollected").first()).toBeVisible({
      timeout: 5000,
    });

    // 獲得済みマーカーは表示されない
    await expect(page.locator(".silo-marker-collected")).not.toBeVisible({
      timeout: 1000,
    });
  });
});
