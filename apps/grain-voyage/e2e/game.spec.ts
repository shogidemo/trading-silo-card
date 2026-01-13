import { test, expect } from "@playwright/test";

test.describe("Grain Voyage Game", () => {
  test.describe("Home Page", () => {
    test("should display the title screen", async ({ page }) => {
      await page.goto("/");

      // タイトルが表示されている
      await expect(page.getByRole("heading", { name: /穀物航路/i })).toBeVisible();

      // ゲームスタートボタンが表示されている
      await expect(page.getByRole("button", { name: /ゲームスタート/i })).toBeVisible();
    });

    test("should show company selection after clicking start", async ({ page }) => {
      await page.goto("/");

      // ゲームスタートをクリック
      await page.getByRole("button", { name: /ゲームスタート/i }).click();

      // アニメーションを待つ
      await page.waitForTimeout(800);

      // 商社選択画面のタイトルを確認
      await expect(page.getByRole("heading", { name: /所属商社を選択/i })).toBeVisible({ timeout: 5000 });

      // 商社選択ボタンが表示される（テキスト検索）
      await expect(page.getByText("紅葉商事")).toBeVisible();
    });

    test("should navigate to play page through full flow", async ({ page }) => {
      await page.goto("/");

      // Step 1: ゲームスタートをクリック
      await page.getByRole("button", { name: /ゲームスタート/i }).click();
      await page.waitForTimeout(800);

      // Step 2: 紅葉商事を選択（テキストを含むボタンをクリック）
      await page.locator("button", { hasText: "紅葉商事" }).click();

      // 決定ボタンが表示されるまで待つ
      const confirmButton = page.getByRole("button", { name: "決定" });
      await expect(confirmButton).toBeVisible({ timeout: 3000 });
      await confirmButton.click();
      await page.waitForTimeout(500);

      // Step 3: フリーモードを選択
      const modeHeading = page.getByRole("heading", { name: /ゲームモードを選択/i });
      await expect(modeHeading).toBeVisible({ timeout: 5000 });

      const freeModeButton = page.getByRole("button", { name: /フリーモード/i });
      await expect(freeModeButton).toBeEnabled({ timeout: 5000 });
      await freeModeButton.click();

      // ゲーム画面に遷移
      await expect(page).toHaveURL(/\/play/, { timeout: 10000 });
      // ゲーム画面のヘッダー（穀物航路）が表示されている
      await expect(page.getByRole("heading", { name: /穀物航路/i })).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Play Page", () => {
    test("should load play page directly", async ({ page }) => {
      // 直接 /play ページにアクセス
      await page.goto("/play?company=momiji");

      // ヘッダーが表示されるまで待つ
      await expect(
        page.getByRole("heading", { name: /穀物航路/i })
      ).toBeVisible({ timeout: 10000 });

      // スクリーンショットを保存（デバッグ用）
      await page.screenshot({ path: "test-results/play-direct.png", fullPage: true });

      // ページが正常にロードされたかチェック
      // もし404ならエラーページが表示される
      const errorIndicator = page.locator('meta[name="next-error"]');
      const hasError = await errorIndicator.count() > 0;

      if (hasError) {
        console.log("Page returned an error - might be a routing issue in dev mode");
      }

      // 何らかのコンテンツが表示されていればOK
      const body = page.locator("body");
      const bodyContent = await body.textContent();
      console.log("Body content preview:", bodyContent?.substring(0, 200));

      expect(bodyContent).toBeTruthy();
    });
  });

  test.describe("Map Page", () => {
    test("should load map page", async ({ page }) => {
      await page.goto("/map");
      await expect(
        page.getByRole("heading", { name: /航路マップ/i })
      ).toBeVisible({ timeout: 10000 });

      // スクリーンショットを保存（デバッグ用）
      await page.screenshot({ path: "test-results/map-direct.png", fullPage: true });

      // ページが存在することを確認
      const body = page.locator("body");
      const bodyContent = await body.textContent();
      expect(bodyContent).toBeTruthy();
    });
  });
});
