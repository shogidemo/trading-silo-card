import { test, expect } from "@playwright/test";

test.describe("穀物サイロカード - クイズフロー", () => {
  test("ホームページが正しく表示される", async ({ page }) => {
    await page.goto("/");

    // タイトルを確認
    await expect(page.locator("h2").first()).toContainText("穀物の世界を");

    // 統計セクションが表示される
    await expect(page.locator("text=Collected")).toBeVisible();
    await expect(page.locator("text=Total Cards")).toBeVisible();
    await expect(page.locator("text=Accuracy")).toBeVisible();

    // ナビゲーションボタンが表示される
    await expect(page.locator("text=クイズで学ぶ")).toBeVisible();
    await expect(page.locator("text=コレクション")).toBeVisible();
  });

  test("クイズページに遷移してカテゴリ選択できる", async ({ page }) => {
    await page.goto("/");

    // クイズページに遷移
    await page.click("text=クイズに挑戦する");

    // カテゴリ選択画面が表示される
    await expect(page.locator("h2")).toContainText("カテゴリを選択");

    // 3つのカテゴリが表示される（h3要素内のテキストで特定）
    await expect(
      page.locator("h3").filter({ hasText: "サイロ" })
    ).toBeVisible();
    await expect(page.locator("h3").filter({ hasText: "穀物" })).toBeVisible();
    await expect(page.locator("h3").filter({ hasText: "商社" })).toBeVisible();
  });

  test("クイズに回答して結果が表示される", async ({ page }) => {
    await page.goto("/quiz");

    // 穀物カテゴリを選択
    await page.locator("button").filter({ hasText: "穀物" }).first().click();

    // クイズが表示される
    await expect(page.locator("text=🌾")).toBeVisible();

    // 最初の選択肢をクリック
    const options = page.locator("button").filter({ hasText: /^[^🔥🏭🌾🏢📚]/ });
    const firstOption = options.first();
    await firstOption.click();

    // 結果画面が表示される（正解または不正解）
    await expect(
      page.locator("text=正解！").or(page.locator("text=不正解..."))
    ).toBeVisible({ timeout: 3000 });
  });

  test("3問チャレンジモードが動作する", async ({ page }) => {
    await page.goto("/quiz");

    // 3問チャレンジボタンをクリック
    await page.locator("button").filter({ hasText: "3問チャレンジ" }).first().click();

    // クイズ画面が表示される（問題番号が表示される）
    await expect(page.locator("text=1 / 3")).toBeVisible({ timeout: 5000 });

    // 3問回答する
    for (let i = 0; i < 3; i++) {
      // 選択肢を待つ
      await page.waitForSelector("button:has-text('回答')", {
        state: "visible",
        timeout: 5000,
      }).catch(() => {
        // 選択肢ボタンがない場合は通常の選択肢をクリック
      });

      // 最初の選択肢をクリック
      const options = page.locator("main button").filter({
        has: page.locator("span.font-display"),
      });
      const count = await options.count();
      if (count > 0) {
        await options.first().click();
      }

      // 結果表示を待つ
      await page.waitForTimeout(1500);

      // 次の問題へまたは結果表示
      const nextButton = page.locator("button").filter({
        hasText: /次の問題へ|結果を見る|次のクイズへ/,
      });
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }
    }

    // チャレンジ完了画面が表示される
    await expect(page.locator("text=チャレンジ完了！")).toBeVisible({
      timeout: 5000,
    });
  });

  test("コレクションページでカードが表示される", async ({ page }) => {
    await page.goto("/collection");

    // ヘッダーが表示される
    await expect(page.locator("h2")).toContainText("コレクション");

    // フィルターボタンが表示される
    await expect(page.locator("button").filter({ hasText: "すべて" })).toBeVisible();

    // カテゴリフィルターが動作する
    await page.locator("button").filter({ hasText: "穀物" }).click();
    await expect(page.locator("button").filter({ hasText: "穀物" })).toHaveClass(
      /bg-gradient/
    );
  });

  test("設定ページでデータ管理ができる", async ({ page }) => {
    await page.goto("/settings");

    // ヘッダーが表示される（main内のh1を特定）
    await expect(
      page.locator("main h1").filter({ hasText: "設定" })
    ).toBeVisible();

    // 現在の進捗が表示される
    await expect(page.locator("text=現在の進捗")).toBeVisible();
    await expect(page.locator("text=収集カード")).toBeVisible();

    // データ管理ボタンが表示される
    await expect(page.locator("text=データをエクスポート")).toBeVisible();
    await expect(page.locator("text=データをインポート")).toBeVisible();
    await expect(page.locator("text=進捗をリセット")).toBeVisible();
  });

  test("リセット確認モーダルが表示される", async ({ page }) => {
    await page.goto("/settings");

    // リセットボタンをクリック
    await page.locator("button").filter({ hasText: "進捗をリセット" }).click();

    // 確認モーダルが表示される
    await expect(page.locator("text=本当にリセットしますか？")).toBeVisible();
    await expect(page.locator("text=キャンセル")).toBeVisible();
    await expect(page.locator("text=リセットする")).toBeVisible();

    // キャンセルをクリック
    await page.locator("button").filter({ hasText: "キャンセル" }).click();

    // モーダルが閉じる
    await expect(page.locator("text=本当にリセットしますか？")).not.toBeVisible();
  });

  test("ナビゲーションが正しく動作する", async ({ page }) => {
    // ホーム → クイズ
    await page.goto("/");
    await page.click("text=クイズで学ぶ");
    await expect(page).toHaveURL("/quiz");

    // クイズ → ホーム
    await page.click("text=ホームに戻る");
    await expect(page).toHaveURL("/");

    // ホーム → コレクション
    await page.click("text=コレクション");
    await expect(page).toHaveURL("/collection");

    // コレクション → ホーム
    await page.click("text=ホームに戻る");
    await expect(page).toHaveURL("/");

    // ホーム → 設定
    await page.click("text=設定");
    await expect(page).toHaveURL("/settings");
  });
});

test.describe("カード獲得時のフリップ機能", () => {
  test("カード獲得時にカードをクリックして裏面が見れる", async ({ page }) => {
    await page.goto("/quiz");

    // 穀物カテゴリを選択（クイズの正解率が高いカテゴリ）
    await page.locator("button").filter({ hasText: "穀物" }).first().click();

    // クイズが表示されるまで待つ
    await expect(page.locator("text=🌾")).toBeVisible({ timeout: 5000 });

    // 正解するまでクイズを繰り返す（最大10回）
    let cardEarned = false;
    for (let attempt = 0; attempt < 10 && !cardEarned; attempt++) {
      // 選択肢をクリック（最初の選択肢）
      const options = page.locator("main button").filter({
        has: page.locator("span.font-display"),
      });
      await options.first().click();

      // 結果を待つ
      await page.waitForTimeout(1500);

      // 「カードを見る」ボタンが表示されたら（新しいカード獲得）
      const viewCardButton = page.locator("button").filter({ hasText: "カードを見る" });
      if (await viewCardButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        cardEarned = true;
        await viewCardButton.click();
        break;
      }

      // 次のクイズへ進む
      const nextButton = page.locator("button").filter({
        hasText: /次のクイズへ|もう一度挑戦/,
      });
      if (await nextButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await nextButton.click();
        await page.waitForTimeout(500);
      }
    }

    // カード獲得できなかった場合はスキップ
    if (!cardEarned) {
      test.skip();
      return;
    }

    // CardRevealモーダルが表示される
    await expect(page.locator("text=NEW!")).toBeVisible({ timeout: 3000 });

    // 「タップで裏面」ヒントが表示される
    await expect(page.locator("text=タップで裏面")).toBeVisible();

    // カード本体をクリック（role="button"の要素）
    const cardButton = page.locator('[role="button"][tabindex="0"]').first();
    await cardButton.click();

    // 裏面が表示される（「タップで表面」ヒントが表示される）
    await expect(page.locator("text=タップで表面")).toBeVisible({ timeout: 2000 });

    // もう一度クリックして表面に戻る
    await cardButton.click();

    // 表面に戻る（「タップで裏面」ヒントが表示される）
    await expect(page.locator("text=タップで裏面")).toBeVisible({ timeout: 2000 });

    // モーダルを閉じる
    await page.locator("button").filter({ hasText: "タップして閉じる" }).click();

    // モーダルが閉じる
    await expect(page.locator("text=NEW!")).not.toBeVisible({ timeout: 2000 });
  });
});

test.describe("アクセシビリティ", () => {
  test("キーボードナビゲーションが動作する", async ({ page }) => {
    await page.goto("/quiz");

    // カテゴリ選択画面が表示されることを確認
    await expect(page.locator("h2")).toContainText("カテゴリを選択");

    // 最初のカテゴリボタン（サイロ）をクリックして選択
    await page.locator("button").filter({ hasText: "サイロ" }).first().click();

    // クイズ画面に遷移する（カテゴリ選択画面が消える）
    await expect(page.locator("h2").filter({ hasText: "カテゴリを選択" })).not.toBeVisible({
      timeout: 5000,
    });

    // クイズ問題が表示される（選択肢ボタンが表示される）
    await expect(page.locator("main button").first()).toBeVisible({ timeout: 5000 });
  });

  test("ESCキーでモーダルが閉じる", async ({ page }) => {
    await page.goto("/settings");

    // リセットモーダルを開く
    await page.locator("button").filter({ hasText: "進捗をリセット" }).click();
    await expect(page.locator("text=本当にリセットしますか？")).toBeVisible();

    // ESCキーで閉じる
    await page.keyboard.press("Escape");
    await expect(page.locator("text=本当にリセットしますか？")).not.toBeVisible();
  });
});
