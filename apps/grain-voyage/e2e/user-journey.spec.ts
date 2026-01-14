import { test, expect, Page } from "@playwright/test";

/**
 * ユーザー体験E2Eテスト
 *
 * 機能テストではなく、ユーザーストーリーの観点からゲームをプレイし、
 * ユーザー体験に問題がないかを検証する。
 */

// ヘルパー: タイトル画面からゲーム開始までの共通フロー
async function navigateToGamePlay(page: Page) {
  await page.goto("/");

  // タイトル画面
  await expect(page.getByRole("heading", { name: /穀物ディスパッチャー/i })).toBeVisible();
  await page.getByRole("button", { name: /ゲームスタート/i }).click();

  // 商社選択画面
  await page.waitForTimeout(800); // アニメーション待機
  await expect(page.getByRole("heading", { name: /所属商社を選択/i })).toBeVisible({ timeout: 5000 });
  await page.locator("button", { hasText: "紅葉商事" }).click();
  await page.getByRole("button", { name: "決定" }).click();

  // モード選択画面
  await page.waitForTimeout(500);
  await expect(page.getByRole("heading", { name: /ゲームモードを選択/i })).toBeVisible({ timeout: 5000 });
  await page.getByRole("button", { name: /フリーモード/i }).click();

  // プレイ画面への遷移確認
  await expect(page).toHaveURL(/\/play/, { timeout: 10000 });
  await expect(page.getByRole("heading", { name: /穀物ディスパッチャー/i })).toBeVisible({ timeout: 10000 });
}

// ヘルパー: 荷揚げを実行
async function performUnloading(page: Page, amount: number) {
  const unloadingInput = page.locator('input[type="number"]').first();
  await unloadingInput.fill(amount.toString());
  await page.getByRole("button", { name: "荷揚げ実行" }).click();
}

// ヘルパー: 配送を発注（内航船）
async function orderCoastalShipDelivery(page: Page) {
  // 配送計画パネル内の内航船ボタンをクリック
  const deliveryButton = page.locator("button", { hasText: /内航船.*5,000t/ }).first();
  if (await deliveryButton.isEnabled()) {
    await deliveryButton.click();
  }
}

// ヘルパー: ターン終了
async function endTurn(page: Page) {
  await page.getByRole("button", { name: "ターン終了" }).click();
}

test.describe("ユーザージャーニー: ゲーム開始〜完了", () => {
  test("ストーリー1: タイトルからゲーム開始まで", async ({ page }) => {
    /**
     * 新規ユーザーとして、ゲームを起動してプレイ画面に到達したい
     *
     * 検証: 各画面遷移が正しく行われ、最終的にプレイ画面が表示される
     */
    await navigateToGamePlay(page);

    // プレイ画面の主要要素が表示されていることを確認
    await expect(page.getByText(/1\/20/)).toBeVisible(); // ターン表示
    await expect(page.getByText("滞船料 ¥0")).toBeVisible(); // ヘッダー要素
    await expect(page.getByText(/スコア ¥/)).toBeVisible(); // ヘッダー要素

    // 船の状態パネルが表示されている
    await expect(page.getByText("船の状態")).toBeVisible();
    // 入港先として鹿島港が表示されている（サイドバー内に複数表示されるため.first()）
    await expect(page.locator("aside").getByText("鹿島港").first()).toBeVisible();

    // 需要一覧が表示されている
    await expect(page.getByText("需要一覧")).toBeVisible();

    // 荷揚げパネルが表示されている
    await expect(page.getByText("荷揚げ").first()).toBeVisible();

    // ターン終了ボタンが表示されている
    await expect(page.getByRole("button", { name: "ターン終了" })).toBeVisible();
  });

  test("ストーリー2: 荷揚げと配送の基本操作", async ({ page }) => {
    /**
     * ディスパッチャーとして、船から穀物を荷揚げし、需要先へ配送したい
     *
     * 検証:
     * - 荷揚げ実行後、サイロ在庫が増加する
     * - 配送ボタンクリック後、「進行中の配送」が表示される
     * - ターン終了後、ターン数が更新される
     */
    await navigateToGamePlay(page);

    // ターン1の状態を確認
    await expect(page.getByText(/1\/20/)).toBeVisible();

    // 荷揚げパネルの初期状態を確認
    await expect(page.getByText("残積載量").first()).toBeVisible();
    // 船の初期積載量 (50,000 / 50,000t 形式)
    await expect(page.getByText(/50,000\s*\/\s*50,000t/)).toBeVisible();

    // サイロ状態パネルが表示されている
    await expect(page.getByText("サイロ状態")).toBeVisible();

    // 荷揚げを実行（15,000t = 鹿島港の1ターン荷役能力上限）
    await performUnloading(page, 15000);

    // 荷揚げ後、船の残積載量が減少していることを確認 (35,000 / 50,000t)
    await expect(page.getByText(/35,000\s*\/\s*50,000t/)).toBeVisible({ timeout: 5000 });

    // サイロ在庫が増加していることを確認 (15,000 / 80,000t)
    await expect(page.getByText(/15,000\s*\/\s*80,000t/)).toBeVisible();

    // 配送を発注（需要に対して内航船で配送）
    await orderCoastalShipDelivery(page);

    // 「進行中の配送」が表示されることを確認
    await expect(page.getByText("進行中の配送")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/残り\s*3T/)).toBeVisible(); // 内航船は3ターン

    // ターン終了
    await endTurn(page);

    // ターン2に進んだことを確認
    await expect(page.getByText(/2\/20/)).toBeVisible({ timeout: 5000 });
  });

  test("ストーリー3: ゲームを最後までプレイして結果を確認", async ({ page }) => {
    test.setTimeout(180000); // 3分のタイムアウト

    /**
     * 全ての需要を満たしてゲームを完了し、結果を確認したい
     *
     * 戦略:
     * - 効率的に荷揚げと配送を繰り返す
     * - 可能な限り多くの配送を同時に発注
     * - 全需要が充足されるまでプレイ
     *
     * 検証: ゲーム結果画面が表示され、スコアとランクが確認できる
     *
     * 注: このテストは長尺のため、検証は最小限にとどめる
     */
    await navigateToGamePlay(page);

    // 最大25ターンまでプレイ（需要D5がターン10で出現するため余裕を持たせる）
    for (let turn = 1; turn <= 25; turn++) {
      // ゲーム結果画面が表示されたらループを抜ける
      const resultModal = page.getByText("全需要完了！");
      if (await resultModal.isVisible({ timeout: 500 }).catch(() => false)) {
        break;
      }

      // 荷揚げ可能な場合は実行
      const unloadButton = page.getByRole("button", { name: "荷揚げ実行" });
      if (await unloadButton.isEnabled().catch(() => false)) {
        const unloadingInput = page.locator('input[type="number"]').first();
        const currentValue = await unloadingInput.inputValue().catch(() => "0");
        if (parseInt(currentValue) > 0) {
          await unloadButton.click();
          await page.waitForTimeout(200);
        }
      }

      // 配送可能な場合は複数発注（在庫がある限り発注し続ける）
      for (let i = 0; i < 5; i++) {
        const coastalShipButtons = page.locator("button", { hasText: /内航船/ });
        const count = await coastalShipButtons.count();
        let ordered = false;

        for (let j = 0; j < count; j++) {
          const btn = coastalShipButtons.nth(j);
          if (await btn.isEnabled().catch(() => false)) {
            await btn.click();
            await page.waitForTimeout(200);
            ordered = true;
            break;
          }
        }

        if (!ordered) break;
      }

      // ターン終了
      await endTurn(page);
      await page.waitForTimeout(300);
    }

    // ゲーム結果画面が表示されていることを確認
    await expect(page.getByText("全需要完了！")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("配送オペレーション終了")).toBeVisible();

    // ランクが表示されている（S/A/B/C/Dのいずれか）
    const rankText = page.locator("text=/^[SABCD]$/");
    await expect(rankText).toBeVisible();

    // 最終スコアが表示されている
    await expect(page.getByText("最終スコア")).toBeVisible();

    // スコア内訳が表示されている
    await expect(page.getByText("配送報酬")).toBeVisible();
    await expect(page.locator("aside").getByText("滞船料")).toBeVisible();
    await expect(page.getByText("配送コスト")).toBeVisible();

    // ナビゲーションボタンが表示されている
    await expect(page.getByRole("link", { name: "タイトルへ" })).toBeVisible();
    await expect(page.getByRole("button", { name: "もう一度プレイ" })).toBeVisible();

    // スクリーンショットを保存（デバッグ用）
    await page.screenshot({ path: "test-results/game-result.png", fullPage: true });
  });

  test("ストーリー3補足: もう一度プレイでゲームをリスタートできる", async ({ page }) => {
    test.setTimeout(200000); // 3分20秒のタイムアウト

    /**
     * ゲーム結果画面から「もう一度プレイ」をクリックして再プレイできることを確認
     */
    await navigateToGamePlay(page);

    // ゲームを完了するまでプレイ
    for (let turn = 1; turn <= 25; turn++) {
      const resultModal = page.getByText("全需要完了！");
      if (await resultModal.isVisible({ timeout: 300 }).catch(() => false)) {
        break;
      }

      // 荷揚げを実行
      const unloadButton = page.getByRole("button", { name: "荷揚げ実行" });
      if (await unloadButton.isEnabled().catch(() => false)) {
        const unloadingInput = page.locator('input[type="number"]').first();
        const currentValue = await unloadingInput.inputValue().catch(() => "0");
        if (parseInt(currentValue) > 0) {
          await unloadButton.click();
          await page.waitForTimeout(200);
        }
      }

      // 配送を複数発注
      for (let i = 0; i < 5; i++) {
        const coastalShipButtons = page.locator("button", { hasText: /内航船/ });
        const count = await coastalShipButtons.count();
        let ordered = false;

        for (let j = 0; j < count; j++) {
          const btn = coastalShipButtons.nth(j);
          if (await btn.isEnabled().catch(() => false)) {
            await btn.click();
            await page.waitForTimeout(200);
            ordered = true;
            break;
          }
        }

        if (!ordered) break;
      }

      await endTurn(page);
      await page.waitForTimeout(300);
    }

    // 結果画面が表示されていることを確認
    await expect(page.getByText("全需要完了！")).toBeVisible({ timeout: 10000 });

    // 「もう一度プレイ」をクリック
    await page.getByRole("button", { name: "もう一度プレイ" }).click();

    // ゲームがリセットされてターン1に戻ることを確認
    await expect(page.getByText(/1\/20/)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("全需要完了！")).not.toBeVisible();
  });
});
