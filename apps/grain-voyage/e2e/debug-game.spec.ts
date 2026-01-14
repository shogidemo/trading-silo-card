import { test, expect, Page } from "@playwright/test";

/**
 * デバッグ用テスト - ゲームの進行状態を確認
 */

async function navigateToGamePlay(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /ゲームスタート/i }).click();
  await page.waitForTimeout(800);
  await page.locator("button", { hasText: "紅葉商事" }).click();
  await page.getByRole("button", { name: "決定" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: /フリーモード/i }).click();
  await expect(page).toHaveURL(/\/play/, { timeout: 10000 });
}

test("デバッグ: ゲーム進行確認（30ターン）", async ({ page }) => {
  test.setTimeout(300000); // 5分

  await navigateToGamePlay(page);

  for (let turn = 1; turn <= 30; turn++) {
    console.log(`\n=== ターン ${turn} ===`);

    // スクリーンショット（ターン開始時）
    await page.screenshot({ path: `test-results/debug-turn${turn}-start.png`, fullPage: true });

    // ゲーム結果画面が表示されたか確認
    const resultModal = page.getByText("全需要完了！");
    if (await resultModal.isVisible({ timeout: 500 }).catch(() => false)) {
      console.log("ゲーム結果画面が表示されました！");
      await page.screenshot({ path: `test-results/debug-game-result.png`, fullPage: true });
      break;
    }

    // 荷揚げ入力欄の値を確認
    const unloadingInput = page.locator('input[type="number"]').first();
    const inputValue = await unloadingInput.inputValue().catch(() => "取得失敗");
    console.log(`荷揚げ入力欄の値: ${inputValue}`);

    // 荷揚げ実行ボタンの状態
    const unloadButton = page.getByRole("button", { name: "荷揚げ実行" });
    const unloadEnabled = await unloadButton.isEnabled().catch(() => false);
    console.log(`荷揚げ実行ボタン有効: ${unloadEnabled}`);

    // 荷揚げを実行
    if (unloadEnabled && parseInt(inputValue) > 0) {
      console.log(`荷揚げを実行: ${inputValue}t`);
      await unloadButton.click();
      await page.waitForTimeout(300);
    } else {
      console.log("荷揚げをスキップ");
    }

    // 配送を可能な限り発注
    let deliveryCount = 0;
    for (let attempt = 0; attempt < 5; attempt++) {
      const coastalShipButtons = page.locator("button", { hasText: /内航船/ });
      const buttonCount = await coastalShipButtons.count();

      let ordered = false;
      for (let i = 0; i < buttonCount; i++) {
        const btn = coastalShipButtons.nth(i);
        const btnEnabled = await btn.isEnabled().catch(() => false);

        if (btnEnabled) {
          const btnText = await btn.textContent().catch(() => "取得失敗");
          console.log(`配送発注: ${btnText}`);
          await btn.click();
          await page.waitForTimeout(200);
          deliveryCount++;
          ordered = true;
          break;
        }
      }

      if (!ordered) break;
    }
    console.log(`このターンの配送発注数: ${deliveryCount}`)

    // スクリーンショット（アクション後）
    await page.screenshot({ path: `test-results/debug-turn${turn}-after-action.png`, fullPage: true });

    // ターン終了ボタンをクリック
    const endTurnButton = page.getByRole("button", { name: "ターン終了" });
    const endTurnEnabled = await endTurnButton.isEnabled().catch(() => false);
    console.log(`ターン終了ボタン有効: ${endTurnEnabled}`);

    if (endTurnEnabled) {
      await endTurnButton.click();
      await page.waitForTimeout(500);
    } else {
      console.log("ターン終了ボタンが無効です！");
      await page.screenshot({ path: `test-results/debug-error-turn${turn}.png`, fullPage: true });
      break;
    }
  }

  // 最終スクリーンショット
  await page.screenshot({ path: `test-results/debug-final.png`, fullPage: true });
});
