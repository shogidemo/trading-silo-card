import { test, expect, Page } from "@playwright/test";
import { setCollectionStateBeforeLoad, getCollectionState, answerQuizCorrectly } from "./helpers/test-utils";
import { allCards, silos } from "@/data";

// 実利用者の保存ではなく、引継ぎ仕様の合成fixture。
const saved = {
  collectedCardIds: ["silo-tohoku", "grain-wheat", "trader-marubeni"], totalQuizAttempts: 50, correctAnswers: 30,
  wrongAnswerQuizIds: ["quiz-tohoku-1"], answeredQuizIds: ["quiz-tohoku-1", "quiz-wheat-1"],
  categoryStats: { silo: { attempts: 25, correct: 15 }, grain: { attempts: 20, correct: 12 }, trader: { attempts: 5, correct: 3 } },
};
const TILE = '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#dbecef"/><text x="8" y="20">SYNTHETIC TILE</text></svg>';

test.beforeEach(async ({ page }) => {
  await page.route("https://tile.openstreetmap.org/**", route => route.fulfill({ contentType: "image/svg+xml", body: TILE }));
  await page.route("https://cyberjapandata.gsi.go.jp/**", route => route.fulfill({ contentType: "image/svg+xml", body: TILE }));
});

async function view(page: Page) {
  const container = page.locator(".leaflet-container");
  return { lat: Number(await container.getAttribute("data-view-lat")), lng: Number(await container.getAttribute("data-view-lng")), zoom: Number(await container.getAttribute("data-view-zoom")) };
}

test("HOME-01 RESP-01 RESP-02: 5幅で初回CTAとナビを見せ、横溢れと末尾の重なりがない", async ({ page }) => {
  await setCollectionStateBeforeLoad(page, { collectedCardIds: [] });
  await page.goto("/");
  for (const [width, height] of [[390, 844], [320, 568], [195, 422], [768, 900], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo(0, 0));
    const cta = page.getByRole("link", { name: "鹿島の1問を解く", exact: true });
    await expect(cta).toBeInViewport({ ratio: 1 });
    const nav = page.getByRole("navigation", { name: "主な画面" });
    expect((await cta.boundingBox())!.y + (await cta.boundingBox())!.height).toBeLessThanOrEqual((await nav.boundingBox())!.y);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `/Users/shosato/Documents/Codex/2026-10-12/task-2/qa-atlas-home-${width}.png` });
    await page.getByRole("link", { name: "出典・素材・ライセンス", exact: true }).last().scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const last = await page.locator("footer").boundingBox();
    expect(last!.y + last!.height).toBeLessThanOrEqual((await nav.boundingBox())!.y + 1);
  }
});

test("HOME-02 A11Y-01: 港図とボタンをEnter/Spaceで選び、役割と選択状態が一致する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "岸壁を知る", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "2 岸壁", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("岸壁で受け取る", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "サイロを知る", exact: true }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("button", { name: "3 サイロ", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("サイロに蓄える", { exact: true })).toBeVisible();
  for (const name of ["1 船", "2 岸壁", "3 サイロ"]) { const box = await page.getByRole("button", { name, exact: true }).boundingBox(); expect(box!.width).toBeGreaterThanOrEqual(44); expect(box!.height).toBeGreaterThanOrEqual(44); }
});

test("HOME-03 DETAIL-01 DETAIL-02: 0枚でも施設情報を読み、同じカードへ進む。閲覧で獲得しない", async ({ page }) => {
  await setCollectionStateBeforeLoad(page, { collectedCardIds: [] });
  await page.goto("/");
  const source = page.getByRole("button", { name: "施設を先に知る", exact: true });
  await source.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("○ 未獲得");
  await expect(dialog).toContainText("関東グレーンターミナル");
  await expect(dialog.getByRole("link", { name: "クイズでこのカードを集める", exact: true })).toHaveAttribute("href", "/quiz?cardId=silo-kanto");
  await page.keyboard.press("Escape");
  await expect(source).toBeFocused();
  expect((await getCollectionState(page))?.collectedCardIds).toEqual([]);
  await source.click();
  await dialog.getByRole("link", { name: "地図で見る", exact: true }).click();
  await expect(page).toHaveURL(/\/map\?silo=silo-kanto/);
  await expect(page.locator('[data-silo-id="silo-kanto"]')).toBeInViewport({ ratio: 1 });
});

test("HOME-04 STORE-01: 合成途中収集の数・履歴・統計を遷移と再読込でも維持する", async ({ page }) => {
  await setCollectionStateBeforeLoad(page, saved);
  await page.goto("/");
  await expect(page.getByText(`集めたサイロ 1 / ${silos.length}`, { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "獲得済みの地点へ", exact: true }).click();
  await expect(page).toHaveURL(/silo=silo-tohoku/);
  await page.reload();
  await expect.poll(() => getCollectionState(page)).toEqual(saved);
});

test("COL-01 COL-02: 日本語変換・検索0件解除・詳細復帰で条件とフォーカスを維持する", async ({ page }) => {
  await setCollectionStateBeforeLoad(page, saved);
  await page.goto("/collection");
  const input = page.getByRole("searchbox", { name: "カード名を検索" });
  const original = await input.elementHandle();
  await input.dispatchEvent("compositionstart");
  await input.fill("東北");
  await expect(page.locator(".atlas-collection-card")).toHaveCount(allCards.length);
  await input.dispatchEvent("compositionend");
  await expect(page.locator(".atlas-collection-card")).toHaveCount(1);
  expect(await input.evaluate((element, previous) => element === previous, original)).toBe(true);
  await page.getByTestId("category-filter-silo").click();
  await page.getByTestId("collection-filter-collected").click();
  const detail = page.getByRole("button", { name: "東北グレーンターミナルの詳細を見る", exact: true });
  await detail.click();
  await page.keyboard.press("Escape");
  await expect(detail).toBeFocused();
  await expect(input).toHaveValue("東北");
  await detail.click();
  await page.getByRole("dialog").getByRole("link", { name: "地図で見る", exact: true }).click();
  await expect(page).toHaveURL(/\/map\?silo=silo-tohoku/);
  await page.goBack();
  await expect(input).toHaveValue("東北");
  await expect(page.getByTestId("collection-filter-collected")).toHaveAttribute("aria-pressed", "true");
  await input.fill("該当なしの合成検索");
  await expect(page.getByText("該当するカードがありません。", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "検索と絞り込みを解除", exact: true }).click();
  await expect(page.locator(".atlas-collection-card")).toHaveCount(allCards.length);
  await expect.poll(() => getCollectionState(page)).toEqual(saved);
});

test("QUIZ-03 STATE-01: 正解結果と詳細から地図へ進み、ブラウザ戻るで同じ結果へ戻る", async ({ page }) => {
  await setCollectionStateBeforeLoad(page, { collectedCardIds: [] });
  await page.goto("/quiz?cardId=silo-kanto");
  await answerQuizCorrectly(page);
  const result = page.getByTestId("quiz-result");
  await expect(result).toBeFocused();
  await page.getByRole("button", { name: "カードの詳細を見る", exact: true }).click();
  await page.getByRole("dialog").getByRole("link", { name: "地図で見る", exact: true }).click();
  await expect(page).toHaveURL(/\/map\?silo=silo-kanto/);
  const state = await getCollectionState(page);
  await page.goBack();
  await expect(result).toContainText("正解！");
  await expect.poll(() => getCollectionState(page)).toEqual(state);
  expect(state?.collectedCardIds).toEqual(["silo-kanto"]);
});

test("MAP-05 STATE-01: 航空切替と詳細経由の戻るで中心・倍率・選択・フィルタを維持する", async ({ page }) => {
  await setCollectionStateBeforeLoad(page, saved);
  await page.goto("/map?silo=silo-tohoku");
  await expect.poll(async () => (await view(page)).zoom).toBe(16);
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect.poll(async () => (await view(page)).zoom).toBe(17);
  const before = await view(page);
  await page.getByRole("button", { name: "航空写真", exact: true }).click();
  expect(await view(page)).toEqual(before);
  await page.getByRole("button", { name: "カードの詳細を見る", exact: true }).click();
  await page.getByRole("dialog").getByRole("link", { name: "このカードでもう1問", exact: true }).click();
  await expect(page).toHaveURL(/\/quiz\?cardId=silo-tohoku/);
  await page.goBack();
  await expect(page.getByRole("button", { name: "航空写真", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect.poll(async () => (await view(page)).zoom).toBe(17);
  const after = await view(page); expect(after.lat).toBeCloseTo(before.lat, 6); expect(after.lng).toBeCloseTo(before.lng, 6);
  await expect(page.getByTestId("silo-selected-detail")).toContainText("東北グレーンターミナル");
  await expect.poll(() => getCollectionState(page)).toEqual(saved);
});

test("DETAIL-02: 獲得済みフィルタの後も未獲得カードの詳細から同じ施設へ移動する", async ({ page }) => {
  await setCollectionStateBeforeLoad(page, saved);
  await page.goto("/map");
  await page.getByRole("button", { name: "獲得済み", exact: true }).click();
  await expect(page.getByRole("button", { name: "獲得済み", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("navigation", { name: "主な画面" }).getByRole("link", { name: "図鑑", exact: true }).click();
  await page.getByRole("button", { name: "関東グレーンターミナルの詳細を見る", exact: true }).click();
  await page.getByRole("dialog").getByRole("link", { name: "地図で見る", exact: true }).click();
  await expect(page).toHaveURL(/silo=silo-kanto/);
  await expect(page.getByRole("button", { name: "すべて", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-silo-id="silo-kanto"]')).toBeInViewport({ ratio: 1 });
  await expect.poll(() => getCollectionState(page)).toEqual(saved);
});

test("QUIZ-02: 獲得済みカードの再正解は枚数とNEW演出を増やさない", async ({ page }) => {
  await setCollectionStateBeforeLoad(page, { collectedCardIds: ["silo-kanto"] });
  await page.goto("/quiz?cardId=silo-kanto");
  const before = await getCollectionState(page);
  await answerQuizCorrectly(page);
  const after = await getCollectionState(page);
  expect(after?.collectedCardIds).toEqual(["silo-kanto"]);
  expect(after?.totalQuizAttempts).toBe(before!.totalQuizAttempts + 1);
  expect(after?.correctAnswers).toBe(before!.correctAnswers + 1);
  await expect(page.getByText("NEW CARD!", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /カードを見る$/ })).toHaveCount(0);
});

test("STATE-01: 3問の途中から詳細・地図へ移動して戻っても現在問数を維持する", async ({ page }) => {
  await setCollectionStateBeforeLoad(page, { collectedCardIds: [] });
  await page.goto("/quiz");
  await page.getByRole("button", { name: "サイロの3問チャレンジ", exact: true }).click();
  await answerQuizCorrectly(page);
  await page.getByRole("button", { name: "次の問題へ", exact: true }).click();
  await expect(page.getByText("2 / 3", { exact: true })).toBeVisible();
  await answerQuizCorrectly(page);
  const saved = await getCollectionState(page);
  await page.getByRole("button", { name: "カードの詳細を見る", exact: true }).click();
  await page.getByRole("dialog").getByRole("link", { name: "地図で見る", exact: true }).click();
  await expect(page).toHaveURL(/\/map\?silo=/);
  await page.goBack();
  await expect(page.getByTestId("quiz-result")).toBeVisible();
  await expect.poll(() => getCollectionState(page)).toEqual(saved);
  await page.getByRole("button", { name: "次の問題へ", exact: true }).click();
  await expect(page.getByText("3 / 3", { exact: true })).toBeVisible();
});

test("HOME-01: 誤答後の通常の主CTAは対象カードの新しい1問を開く", async ({ page }) => {
  await setCollectionStateBeforeLoad(page, { collectedCardIds: [] });
  await page.goto("/quiz?cardId=silo-kanto");
  await page.locator('button[data-correct="false"]').first().click();
  await expect(page.getByTestId("quiz-result")).toContainText("不正解");
  const before = await getCollectionState(page);
  await page.getByRole("link", { name: "港のアトラス ホーム", exact: true }).click();
  await page.getByRole("link", { name: "鹿島の1問を解く", exact: true }).click();
  await expect(page.getByTestId("quiz-option-0")).toBeVisible();
  await expect(page.getByTestId("quiz-result")).toHaveCount(0);
  await expect.poll(() => getCollectionState(page)).toEqual(before);
});


test("DETAIL-01: 結果の詳細から同じURLでも対象カードの新しい1問を始める", async ({ page }) => {
  await setCollectionStateBeforeLoad(page, { collectedCardIds: [] });
  await page.goto("/quiz?cardId=silo-kanto");
  await page.locator('button[data-correct="false"]').first().click();
  await expect(page.getByTestId("quiz-result")).toContainText("不正解");
  const before = await getCollectionState(page);
  await page.getByRole("button", { name: "カードの詳細を見る", exact: true }).click();
  await page.getByRole("dialog").getByRole("link", { name: "クイズでこのカードを集める", exact: true }).click();
  await expect(page.getByTestId("quiz-option-0")).toBeEnabled();
  await expect(page.getByTestId("quiz-result")).toHaveCount(0);
  await expect.poll(() => getCollectionState(page)).toEqual(before);
});

test("STATE-01: 回答直後に離脱して戻っても回答を再計上せず結果へ進む", async ({ page }) => {
  await setCollectionStateBeforeLoad(page, { collectedCardIds: [] });
  await page.goto("/quiz");
  await page.getByRole("button", { name: "サイロを知る", exact: true }).click();
  await page.getByRole("link", { name: "図鑑", exact: true }).hover();
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page.locator('button[data-correct="false"]').first().click();
  const before = await getCollectionState(page);
  await page.getByRole("link", { name: "図鑑", exact: true }).click();
  let elapsed = 0;
  await expect.poll(async () => { await page.clock.runFor(50); elapsed += 50; return page.url(); }).toMatch(/collection/);
  expect(elapsed).toBeLessThan(1000);
  await page.getByRole("link", { name: "学ぶ", exact: true }).click();
  await expect.poll(async () => { await page.clock.runFor(50); return page.url(); }).toMatch(/quiz$/);
  await expect.poll(async () => { await page.clock.runFor(250); return page.getByTestId("quiz-result").count(); }, { intervals: [100, 100, 100, 100], timeout: 5000 }).toBe(1);
  await expect(page.getByTestId("quiz-result")).toContainText("不正解");
  await expect.poll(() => getCollectionState(page)).toEqual(before);
});

test("QUIZ-02 STATE-01: category入口の通常再入場は古い結果を復元しない", async ({ page }) => {
  await setCollectionStateBeforeLoad(page, { collectedCardIds: [] });
  await page.goto("/quiz?category=silo");
  await answerQuizCorrectly(page);
  const before = await getCollectionState(page);
  await page.getByRole("link", { name: "探す", exact: true }).click();
  await expect(page).toHaveURL(/map$/);
  const uncollected = silos.find(card => !before.collectedCardIds.includes(card.id))!;
  await page.getByRole("button", { name: `${uncollected.name}を選択`, exact: true }).click();
  await page.getByRole("link", { name: "クイズでカードを集める", exact: true }).click();
  await expect(page.getByTestId("quiz-option-0")).toBeEnabled();
  await expect(page.getByTestId("quiz-result")).toHaveCount(0);
  await expect.poll(() => getCollectionState(page)).toEqual(before);
});


test("QUIZ-01 STATE-01: 復習入口の再入場は古い結果を復元しない", async ({ page }) => {
  await setCollectionStateBeforeLoad(page, saved);
  await page.goto("/quiz?mode=review");
  await page.locator('button[data-correct="false"]').first().click();
  await expect(page.getByTestId("quiz-result")).toContainText("不正解");
  const before = await getCollectionState(page);
  await page.getByRole("link", { name: "港のアトラス ホーム", exact: true }).click();
  await page.getByRole("link", { name: /^復習モードを開始/ }).click();
  await expect(page.getByTestId("quiz-option-0")).toBeEnabled();
  await expect(page.getByTestId("quiz-result")).toHaveCount(0);
  await expect.poll(() => getCollectionState(page)).toEqual(before);
});
