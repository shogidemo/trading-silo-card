import { Page, expect } from "@playwright/test";

export const STORAGE_KEY = "silo-card-collection";

export type CardCategory = "silo" | "grain" | "trader";

export interface CollectionState {
  collectedCardIds: string[];
  totalQuizAttempts: number;
  correctAnswers: number;
  wrongAnswerQuizIds: string[];
  answeredQuizIds: string[];
  categoryStats: Record<CardCategory, { attempts: number; correct: number }>;
}

// localStorage操作
export async function setLocalStorage(
  page: Page,
  key: string,
  data: object
): Promise<void> {
  await page.evaluate(
    ({ key, data }) => {
      localStorage.setItem(key, JSON.stringify(data));
    },
    { key, data }
  );
}

export async function getLocalStorage(
  page: Page,
  key: string
): Promise<object | null> {
  return await page.evaluate((key) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }, key);
}

export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

export async function clearLocalStorageBeforeLoad(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.clear();
  });
}

export async function getCollectionState(
  page: Page
): Promise<CollectionState | null> {
  return (await getLocalStorage(page, STORAGE_KEY)) as CollectionState | null;
}

export async function setCollectionState(
  page: Page,
  state: Partial<CollectionState>
): Promise<void> {
  const defaultState: CollectionState = {
    collectedCardIds: [],
    totalQuizAttempts: 0,
    correctAnswers: 0,
    wrongAnswerQuizIds: [],
    answeredQuizIds: [],
    categoryStats: {
      silo: { attempts: 0, correct: 0 },
      grain: { attempts: 0, correct: 0 },
      trader: { attempts: 0, correct: 0 },
    },
  };
  await setLocalStorage(page, STORAGE_KEY, { ...defaultState, ...state });
}

/**
 * ページ読み込み前にlocalStorageを設定するヘルパー
 * addInitScriptを使用してReactが初期化される前にデータを設定
 * 使用後はreload()を呼び出す必要がある
 */
export async function setCollectionStateBeforeLoad(
  page: Page,
  state: Partial<CollectionState>
): Promise<void> {
  const defaultState: CollectionState = {
    collectedCardIds: [],
    totalQuizAttempts: 0,
    correctAnswers: 0,
    wrongAnswerQuizIds: [],
    answeredQuizIds: [],
    categoryStats: {
      silo: { attempts: 0, correct: 0 },
      grain: { attempts: 0, correct: 0 },
      trader: { attempts: 0, correct: 0 },
    },
  };
  const fullState = { ...defaultState, ...state };
  await page.addInitScript(
    (data) => {
      localStorage.setItem("silo-card-collection", JSON.stringify(data));
    },
    fullState
  );
}

// クイズ操作
export async function goToQuiz(page: Page): Promise<void> {
  await page.goto("/quiz");
  await expect(page.getByRole("heading", { name: "カテゴリを選択" })).toBeVisible({ timeout: 10000 });
}

export async function selectCategory(
  page: Page,
  category: CardCategory
): Promise<void> {
  const categoryMap = {
    silo: "サイロ",
    grain: "穀物",
    trader: "商社",
  };
  await page
    .locator("button")
    .filter({ hasText: categoryMap[category] })
    .first()
    .click();
  // クイズの選択肢が表示されるまで待機
  await expect(
    page.locator("main button").filter({
      has: page.locator("span.font-display"),
    }).first()
  ).toBeVisible({ timeout: 10000 });
}

export async function answerQuiz(
  page: Page,
  correct: boolean
): Promise<{ isNewCard: boolean }> {
  // 選択肢を取得（絵文字やボタンテキストを除外）
  const options = page.locator("main button").filter({
    has: page.locator("span.font-display"),
  });

  await expect(options.first()).toBeVisible({ timeout: 5000 });

  if (correct) {
    const correctOption = page.locator('button[data-correct="true"]');
    if (await correctOption.first().isVisible().catch(() => false)) {
      await correctOption.first().click();
    } else {
      await options.first().click();
    }
  } else {
    await options.first().click();
  }

  // 結果を待つ
  await expect(
    page.locator("text=正解！").or(page.locator("text=不正解..."))
  ).toBeVisible({ timeout: 5000 });

  // 結果画面を確認
  const isCorrect = await page.locator("text=正解！").isVisible();
  const isNewCard = await page.locator("text=NEW CARD").isVisible();

  return { isNewCard };
}

export async function answerQuizCorrectly(
  page: Page
): Promise<{ isNewCard: boolean }> {
  const options = page.locator("main button").filter({
    has: page.locator("span.font-display"),
  });

  const nextButtons = page.locator("button").filter({
    hasText: /次のクイズ|同じカテゴリでもう1問|続けて/,
  });

  const maxAttempts = 6;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    await expect(options.first()).toBeVisible({ timeout: 5000 });

    const correctOption = page.locator('button[data-correct="true"]');
    if (await correctOption.first().isVisible().catch(() => false)) {
      await correctOption.first().click();
    } else {
      await options.first().click();
    }

    await expect(
      page.locator("text=正解！").or(page.locator("text=不正解..."))
    ).toBeVisible({ timeout: 5000 });

    const isCorrect = await page.locator("text=正解！").isVisible();
    const isNewCard = await page.locator("text=NEW CARD").isVisible();

    if (isCorrect) {
      return { isNewCard };
    }

    if (await nextButtons.first().isVisible().catch(() => false)) {
      await nextButtons.first().click();
      await page.waitForTimeout(400);
    }
  }

  const isNewCard = await page.locator("text=NEW CARD").isVisible();
  return { isNewCard };
}

export async function answerQuizIncorrectly(page: Page): Promise<void> {
  const options = page.locator("main button").filter({
    has: page.locator("span.font-display"),
  });

  await expect(options.first()).toBeVisible({ timeout: 5000 });
  await options.first().click();
  await expect(
    page.locator("text=正解！").or(page.locator("text=不正解..."))
  ).toBeVisible({ timeout: 5000 });

  // 不正解になったかどうかは結果に依存
}

// カード収集（クイズ正解 → カード獲得まで）
export async function collectCardViaQuiz(
  page: Page,
  category: CardCategory
): Promise<void> {
  await goToQuiz(page);
  await selectCategory(page, category);

  // クイズに回答（何度か試行して正解を得る）
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const options = page.locator("main button").filter({
      has: page.locator("span.font-display"),
    });

    await expect(options.first()).toBeVisible({ timeout: 5000 });
    await options.first().click();
    await page.waitForTimeout(1500);

    const isCorrect = await page.locator("text=正解！").isVisible();
    if (isCorrect) {
      // NEW CARDボタンがあればクリック
      const cardButton = page
        .locator("button")
        .filter({ hasText: "カードを見る" });
      if (await cardButton.isVisible()) {
        await cardButton.click();
        // CardRevealモーダルを閉じる
        await page.waitForTimeout(500);
        await page.locator("text=タップして閉じる").click();
      }
      return;
    }

    // 次のクイズへ
    const nextButton = page
      .locator("button")
      .filter({ hasText: /次のクイズへ/ });
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500);
    }

    attempts++;
  }
}

// 設定操作
export async function resetProgress(page: Page): Promise<void> {
  await page.goto("/settings");

  // リセットボタンをクリック
  await page.locator("button").filter({ hasText: "進捗をリセット" }).click();

  // 確認モーダルでリセットを実行
  await expect(page.locator("text=本当にリセットしますか？")).toBeVisible();
  await page.locator("button").filter({ hasText: "リセットする" }).click();

  // モーダルが閉じるまで待機
  await expect(
    page.locator("text=本当にリセットしますか？")
  ).not.toBeVisible();
}

// 復習モード関連
export async function startReviewMode(page: Page): Promise<void> {
  await page.goto("/quiz");
  await page.locator("button").filter({ hasText: "復習モード" }).click();
}

export async function hasReviewModeButton(page: Page): Promise<boolean> {
  await page.goto("/quiz");
  return await page.locator("button").filter({ hasText: "復習モード" }).isVisible();
}

// ユーティリティ
export async function waitForAnimations(page: Page): Promise<void> {
  await page.waitForTimeout(500);
}

export async function getProgressStats(page: Page): Promise<{
  collected: number;
  total: number;
  accuracy: number;
}> {
  await page.goto("/");

  // 統計情報を取得
  const collectedText = await page
    .locator("text=Collected")
    .locator("..")
    .textContent();
  const totalText = await page
    .locator("text=Total Cards")
    .locator("..")
    .textContent();
  const accuracyText = await page
    .locator("text=Accuracy")
    .locator("..")
    .textContent();

  // 数値を抽出
  const collected = parseInt(collectedText?.match(/\d+/)?.[0] || "0");
  const total = parseInt(totalText?.match(/\d+/)?.[0] || "0");
  const accuracy = parseInt(accuracyText?.match(/\d+/)?.[0] || "0");

  return { collected, total, accuracy };
}
