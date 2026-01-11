import { test, expect } from "@playwright/test";
import {
  clearLocalStorage,
  getCollectionState,
  setCollectionStateBeforeLoad,
} from "./helpers/test-utils";

test.describe("復習モード", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearLocalStorage(page);
  });

  test("誤答するとwrongAnswerQuizIdsに追加される", async ({ page }) => {
    await page.goto("/quiz");

    // 穀物カテゴリを選択
    await page.locator("button").filter({ hasText: "穀物" }).first().click();

    // クイズに回答
    const options = page.locator("main button").filter({
      has: page.locator("span.font-display"),
    });
    await expect(options.first()).toBeVisible({ timeout: 5000 });
    await options.first().click();

    await page.waitForTimeout(1500);

    // 不正解の場合、wrongAnswerQuizIdsに追加される
    const isIncorrect = await page.locator("text=不正解...").isVisible();
    if (isIncorrect) {
      const state = await getCollectionState(page);
      expect(state?.wrongAnswerQuizIds.length).toBeGreaterThan(0);
    }
  });

  test("誤答がある場合に復習モードボタンが表示される", async ({ page }) => {
    // addInitScriptでページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      totalQuizAttempts: 1,
      wrongAnswerQuizIds: ["quiz-wheat-1"],
      categoryStats: {
        silo: { attempts: 0, correct: 0 },
        grain: { attempts: 1, correct: 0 },
        trader: { attempts: 0, correct: 0 },
      },
    });
    await page.goto("/quiz");

    // 復習モードボタンが表示される
    await expect(
      page.locator("button").filter({ hasText: "復習モード" })
    ).toBeVisible({ timeout: 5000 });
  });

  test("誤答がない場合は復習モードボタンが非表示", async ({ page }) => {
    await page.goto("/quiz");

    // 復習モードボタンが表示されない
    await expect(
      page.locator("button").filter({ hasText: "復習モード" })
    ).not.toBeVisible({ timeout: 3000 });
  });

  test("復習モードでクイズが出題される", async ({ page }) => {
    // addInitScriptでページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      totalQuizAttempts: 1,
      wrongAnswerQuizIds: ["quiz-wheat-1"],
      categoryStats: {
        silo: { attempts: 0, correct: 0 },
        grain: { attempts: 1, correct: 0 },
        trader: { attempts: 0, correct: 0 },
      },
    });
    await page.goto("/quiz");

    // 復習モードボタンをクリック
    await page.locator("button").filter({ hasText: "復習モード" }).click();

    // クイズ画面に遷移（復習マークが表示される）
    await expect(page.locator("text=📚")).toBeVisible({ timeout: 5000 });
  });

  test("復習で正解すると復習リストから削除される", async ({ page }) => {
    // addInitScriptでページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      totalQuizAttempts: 1,
      wrongAnswerQuizIds: ["quiz-wheat-1"],
      categoryStats: {
        silo: { attempts: 0, correct: 0 },
        grain: { attempts: 1, correct: 0 },
        trader: { attempts: 0, correct: 0 },
      },
    });
    await page.goto("/quiz");

    await page.locator("button").filter({ hasText: "復習モード" }).click();

    // クイズに回答
    const options = page.locator("main button").filter({
      has: page.locator("span.font-display"),
    });
    await expect(options.first()).toBeVisible({ timeout: 5000 });
    await options.first().click();

    await page.waitForTimeout(1500);

    // 正解した場合、復習リストから削除される
    const isCorrect = await page.locator("text=正解！").isVisible();
    if (isCorrect) {
      const nextButton = page.locator("button").filter({
        hasText: /次のクイズへ|結果を見る/,
      });
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }

      await page.waitForTimeout(500);
      const state = await getCollectionState(page);
      expect(state?.wrongAnswerQuizIds).not.toContain("quiz-wheat-1");
    }
  });

  test("復習サマリーが表示される", async ({ page }) => {
    // addInitScriptでページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      totalQuizAttempts: 1,
      wrongAnswerQuizIds: ["quiz-wheat-1"],
      categoryStats: {
        silo: { attempts: 0, correct: 0 },
        grain: { attempts: 1, correct: 0 },
        trader: { attempts: 0, correct: 0 },
      },
    });
    await page.goto("/quiz");

    await page.locator("button").filter({ hasText: "復習モード" }).click();

    // クイズに回答
    const options = page.locator("main button").filter({
      has: page.locator("span.font-display"),
    });
    await expect(options.first()).toBeVisible({ timeout: 5000 });
    await options.first().click();

    await page.waitForTimeout(1500);

    const resultButton = page.locator("button").filter({
      hasText: /結果を見る|次のクイズへ/,
    });
    if (await resultButton.isVisible()) {
      await resultButton.click();
    }

    // 復習サマリーが表示される
    await expect(page.locator("text=復習完了")).toBeVisible({ timeout: 5000 });
  });

  test("復習問題数が正確に表示される", async ({ page }) => {
    // addInitScriptでページ読み込み前にlocalStorageを設定
    await setCollectionStateBeforeLoad(page, {
      totalQuizAttempts: 3,
      wrongAnswerQuizIds: ["quiz-wheat-1", "quiz-soybean-1", "quiz-corn-1"],
      categoryStats: {
        silo: { attempts: 0, correct: 0 },
        grain: { attempts: 3, correct: 0 },
        trader: { attempts: 0, correct: 0 },
      },
    });
    await page.goto("/quiz");

    // 復習モードボタンに問題数が表示される
    const reviewButton = page.locator("button").filter({ hasText: "復習モード" });
    await expect(reviewButton).toBeVisible({ timeout: 5000 });

    // 復習モードボタン内のバッジに問題数が表示される
    await expect(reviewButton.locator("span").filter({ hasText: "3問" })).toBeVisible({ timeout: 5000 });
  });
});
