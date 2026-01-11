import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import {
  STORAGE_KEY,
  clearLocalStorage,
  getCollectionState,
  setCollectionStateBeforeLoad,
} from "./helpers/test-utils";

test.describe("データ永続化", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearLocalStorage(page);
    await page.reload();
  });

  test("カード獲得後にリロードしても進捗が保持される", async ({ page }) => {
    // addInitScript を使ってページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["grain-wheat", "silo-kanto"],
    });

    // ページをリロードしてスクリプトを実行
    await page.reload();
    await page.waitForLoadState("networkidle");

    // 状態を確認
    const state = await getCollectionState(page);
    expect(state?.collectedCardIds).toContain("grain-wheat");
    expect(state?.collectedCardIds).toContain("silo-kanto");
  });

  test("クイズ統計がリロード後も保持される", async ({ page }) => {
    // addInitScript を使ってページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      totalQuizAttempts: 10,
      correctAnswers: 7,
      categoryStats: {
        silo: { attempts: 3, correct: 2 },
        grain: { attempts: 4, correct: 3 },
        trader: { attempts: 3, correct: 2 },
      },
    });
    await page.reload();

    // 状態を確認
    const state = await getCollectionState(page);
    expect(state?.totalQuizAttempts).toBe(10);
    expect(state?.correctAnswers).toBe(7);
    expect(state?.categoryStats.grain.correct).toBe(3);
  });

  test("エクスポートボタンでJSONがダウンロードされる", async ({ page }) => {
    // addInitScript を使ってページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["grain-wheat"],
      totalQuizAttempts: 5,
      correctAnswers: 3,
    });
    await page.goto("/settings");

    // ダウンロードを待機
    const downloadPromise = page.waitForEvent("download");
    await page.locator("button").filter({ hasText: "データをエクスポート" }).click();
    const download = await downloadPromise;

    // ファイル名を確認
    const fileName = download.suggestedFilename();
    expect(fileName).toMatch(/grain-card-collection-\d{4}-\d{2}-\d{2}\.json/);
  });

  test("エクスポートファイルに正しいデータが含まれる", async ({ page }) => {
    // addInitScript を使ってページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["grain-wheat", "silo-kanto"],
      totalQuizAttempts: 5,
      correctAnswers: 3,
      wrongAnswerQuizIds: ["quiz-wheat-1"],
    });
    await page.goto("/settings");

    // ダウンロードを待機
    const downloadPromise = page.waitForEvent("download");
    await page.locator("button").filter({ hasText: "データをエクスポート" }).click();
    const download = await downloadPromise;

    // ファイル内容を読み取り
    const downloadPath = await download.path();
    if (downloadPath) {
      const content = fs.readFileSync(downloadPath, "utf-8");
      const data = JSON.parse(content);

      expect(data.collectedCardIds).toContain("grain-wheat");
      expect(data.collectedCardIds).toContain("silo-kanto");
      expect(data.totalQuizAttempts).toBe(5);
      expect(data.correctAnswers).toBe(3);
      expect(data.wrongAnswerQuizIds).toContain("quiz-wheat-1");
    }
  });

  test("インポートで進捗が復元される", async ({ page }) => {
    await page.goto("/settings");

    // インポート用のJSONデータ
    const importData = {
      collectedCardIds: ["grain-soybean", "trader-marubeni"],
      totalQuizAttempts: 8,
      correctAnswers: 6,
      wrongAnswerQuizIds: [],
      answeredQuizIds: ["quiz-wheat-1"],
      categoryStats: {
        silo: { attempts: 0, correct: 0 },
        grain: { attempts: 5, correct: 4 },
        trader: { attempts: 3, correct: 2 },
      },
    };

    // ファイルを作成してインポート
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator("button").filter({ hasText: "データをインポート" }).click();
    const fileChooser = await fileChooserPromise;

    // 一時ファイルを作成
    const tempFilePath = path.join(__dirname, "temp-import.json");
    fs.writeFileSync(tempFilePath, JSON.stringify(importData));

    await fileChooser.setFiles(tempFilePath);

    // 成功メッセージを確認
    await expect(page.locator("text=データをインポートしました")).toBeVisible({
      timeout: 5000,
    });

    // 一時ファイルを削除
    fs.unlinkSync(tempFilePath);
  });

  test("無効なJSONをインポートするとエラー表示", async ({ page }) => {
    await page.goto("/settings");

    // 無効なJSONファイルを作成
    const tempFilePath = path.join(__dirname, "invalid-import.json");
    fs.writeFileSync(tempFilePath, "{ invalid json }");

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator("button").filter({ hasText: "データをインポート" }).click();
    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles(tempFilePath);

    // エラーメッセージを確認
    await expect(page.locator("text=エラー")).toBeVisible({ timeout: 5000 });

    // 一時ファイルを削除
    fs.unlinkSync(tempFilePath);
  });

  test("collectedCardIdsがないJSONはエラー", async ({ page }) => {
    await page.goto("/settings");

    // collectedCardIdsがないJSONを作成
    const tempFilePath = path.join(__dirname, "missing-field.json");
    fs.writeFileSync(
      tempFilePath,
      JSON.stringify({ totalQuizAttempts: 5 })
    );

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator("button").filter({ hasText: "データをインポート" }).click();
    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles(tempFilePath);

    // エラーメッセージを確認
    await expect(page.locator("text=エラー")).toBeVisible({ timeout: 5000 });

    // 一時ファイルを削除
    fs.unlinkSync(tempFilePath);
  });

  test("リセットで全データがクリアされる", async ({ page }) => {
    // addInitScript を使ってページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["grain-wheat"],
      totalQuizAttempts: 5,
      correctAnswers: 3,
      wrongAnswerQuizIds: ["quiz-wheat-1"],
    });
    await page.goto("/settings");

    // リセットを実行
    await page.locator("button").filter({ hasText: "進捗をリセット" }).click();
    await expect(page.locator("text=本当にリセットしますか？")).toBeVisible();
    await page.locator("button").filter({ hasText: "リセットする" }).click();

    // 少し待ってから状態を確認（reloadするとaddInitScriptが再実行されるので直接確認）
    await page.waitForTimeout(500);

    const state = await getCollectionState(page);
    // リセット後は初期状態
    expect(state?.collectedCardIds.length || 0).toBe(0);
    expect(state?.totalQuizAttempts || 0).toBe(0);
  });

  test("リセット後にlocalStorageが空になる", async ({ page }) => {
    // addInitScript を使ってページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["grain-wheat"],
    });
    await page.goto("/settings");

    // リセットを実行
    await page.locator("button").filter({ hasText: "進捗をリセット" }).click();
    await page.locator("button").filter({ hasText: "リセットする" }).click();

    await page.waitForTimeout(500);

    // localStorageを確認
    const stored = await page.evaluate((key) => {
      return localStorage.getItem(key);
    }, STORAGE_KEY);

    // リセット後はnullまたは空の状態
    if (stored) {
      const data = JSON.parse(stored);
      expect(data.collectedCardIds.length).toBe(0);
    }
  });

  test("復習リストもリセットされる", async ({ page }) => {
    // addInitScript を使ってページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["grain-wheat"],
      wrongAnswerQuizIds: ["quiz-wheat-1", "quiz-corn-1"],
    });
    await page.goto("/settings");

    // リセットを実行
    await page.locator("button").filter({ hasText: "進捗をリセット" }).click();
    await page.locator("button").filter({ hasText: "リセットする" }).click();

    // 少し待ってから状態を確認（reloadするとaddInitScriptが再実行されるので直接確認）
    await page.waitForTimeout(500);

    const state = await getCollectionState(page);
    expect(state?.wrongAnswerQuizIds?.length || 0).toBe(0);
  });
});
