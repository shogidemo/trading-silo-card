import { test, expect } from "@playwright/test";
import { getCollectionState, STORAGE_KEY } from "./helpers/test-utils";
import { silos } from "@trading-silo/shared";

const TILE = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==", "base64");
const savedState = {
  collectedCardIds: ["silo-kanto", "silo-zenno-kashima", "silo-toyo", "grain-wheat"],
  totalQuizAttempts: 9, correctAnswers: 6,
  wrongAnswerQuizIds: ["quiz-tohoku-1"], answeredQuizIds: ["quiz-kanto-1", "quiz-tohoku-1"],
  categoryStats: { silo: { attempts: 6, correct: 3 }, grain: { attempts: 3, correct: 3 }, trader: { attempts: 0, correct: 0 } },
};

test.beforeEach(async ({ page }) => {
  // OSMの実タイルを自動巡回・取得しない。
  await page.route("https://tile.openstreetmap.org/**", route => route.fulfill({ contentType: "image/png", body: TILE }));
  await page.addInitScript(({ key, state }) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(state));
  }, { key: STORAGE_KEY, state: savedState });
});

test("カードから所在地・詳細・コレクションへ往復でき、保存と復習履歴を維持する", async ({ page }) => {
  await page.goto("/collection");
  await page.getByRole("link", { name: "関東グレーンターミナルの地図を見る" }).click();
  await expect(page).toHaveURL(/\/map\?silo=silo-kanto/);
  await expect(page.getByTestId("silo-selected-detail")).toContainText("関東グレーンターミナル");
  const pin = page.getByTestId("silo-marker").filter({ has: page.locator(".silo-map-pin") }).and(page.locator('[data-silo-id="silo-kanto"]'));
  await expect(pin).toHaveAttribute("data-lat", "35.920465");
  await expect(pin).toHaveAttribute("data-lng", "140.664847");
  await page.getByRole("button", { name: "カードの詳細を見る" }).click();
  await expect(page.getByRole("dialog")).toContainText("関東グレーンターミナル");
  await expect(page.getByRole("dialog").locator("h2")).toBeVisible();
  await expect(page.getByTestId("card-detail-header")).toHaveCSS("background-color", "rgb(42, 37, 32)");
  await expect(page.getByRole("dialog").locator("h2")).toHaveCSS("color", "rgb(250, 249, 247)");
  await expect(page.getByTestId("card-detail-header").getByText("サイロカード", { exact: true })).toHaveCSS("color", "rgb(250, 249, 247)");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect.poll(() => getCollectionState(page)).toEqual(savedState);
  await page.reload();
  await expect(page.getByTestId("silo-selected-detail")).toContainText("関東グレーンターミナル");
  await expect.poll(() => getCollectionState(page)).toEqual(savedState);
  await page.getByRole("link", { name: "コレクションで見る", exact: true }).click();
  await expect(page).toHaveURL(/\/collection#card-silo-kanto/);
  await expect(page.locator("#card-silo-kanto")).toBeInViewport();
});

test("未獲得は地域表示だけになり、直接URLでも施設名と実座標を出さない", async ({ page }) => {
  await page.goto("/map?silo=silo-tohoku");
  await expect(page.getByRole("heading", { name: "サイロマップ", exact: true })).toBeVisible();
  await expect(page.getByTestId("silo-region")).toHaveCount(0);
  await expect(page.getByTestId("silo-sidebar")).toContainText("未獲得の地域");
  await expect(page.getByTestId("silo-selected-detail")).toContainText("未獲得、または見つかりません");
  await expect(page.getByText("東北グレーンターミナル", { exact: true })).toHaveCount(0);
  await expect(page.locator('[data-silo-id="silo-tohoku"]')).toHaveCount(0);
  await page.getByTestId("silo-sidebar").getByRole("button", { name: "地域 東北 残り2施設" }).click();
  await expect(page.getByTestId("silo-selected-detail")).toContainText("地域の範囲を示しています");
  await page.getByRole("button", { name: "獲得済み", exact: true }).click();
  await expect(page.getByTestId("silo-region")).toHaveCount(0);
  await expect(page.getByTestId("silo-sidebar")).not.toContainText("未獲得の地域");
});

test("密集ピンを拡大し、一覧と個別ピンの選択が連動する", async ({ page }) => {
  await page.goto("/map");
  await page.getByRole("button", { name: "獲得済み", exact: true }).click();
  await page.getByTestId("silo-cluster").first().click();
  await expect(page.getByTestId("silo-marker")).toHaveCount(3);
  await page.getByTestId("silo-sidebar").getByRole("button", { name: "全農サイロ鹿島支店を選択" }).click();
  await expect(page.getByTestId("silo-selected-detail")).toContainText("全農サイロ鹿島支店");
  await expect(page.getByTestId("silo-sidebar").getByRole("button", { name: "全農サイロ鹿島支店を選択" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "全国を表示" }).click();
  await expect(page).toHaveURL(/\/map$/);
  await expect(page.getByTestId("silo-cluster")).toHaveCount(1);
  await expect(page.locator('[data-testid="silo-marker"][data-silo-id="silo-toyo"]')).toBeVisible();
});

test("獲得すると地域の残数が減り、施設を個別に選べる", async ({ page }) => {
  await page.addInitScript(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), {
    key: STORAGE_KEY, state: { ...savedState, collectedCardIds: silos.map(silo => silo.id) },
  });
  await page.goto("/map");
  await expect(page.getByTestId("silo-sidebar").getByRole("button", { name: /を選択$/ })).toHaveCount(21);
  await expect(page.getByTestId("silo-region")).toHaveCount(0);
});

test("背景地図に接続できなくても所在地・詳細・保存が使える", async ({ page }) => {
  await page.route("https://tile.openstreetmap.org/**", route => route.abort());
  await page.goto("/map?silo=silo-kanto");
  await expect(page.getByText("背景地図を読み込めません。施設一覧から所在地と詳細を確認できます。")).toBeVisible();
  await page.getByRole("button", { name: "カードの詳細を見る" }).click();
  await expect(page.getByRole("dialog")).toContainText("所在地");
  await page.getByRole("button", { name: "閉じる", exact: true }).click();
  await expect.poll(() => getCollectionState(page)).toEqual(savedState);
});

test("390px幅で横にはみ出さず、地図と44px操作が使える", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/map?silo=silo-kanto");
  await expect(page.getByTestId("silo-map")).toBeVisible();
  await expect(page.getByTestId("silo-selected-detail")).toContainText("関東グレーンターミナル");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const pin = page.locator('[data-testid="silo-marker"][data-silo-id="silo-kanto"]');
  const box = await pin.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await expect(page.getByRole("button", { name: "全国を表示" })).toBeInViewport();
  await expect(page.getByText("OpenStreetMap", { exact: true })).toBeVisible();
});
