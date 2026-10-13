import { test, expect } from "@playwright/test";
import { getCollectionState, STORAGE_KEY } from "./helpers/test-utils";
import { silos } from "@trading-silo/shared";

const TILE = Buffer.from("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"256\" height=\"256\"><rect width=\"256\" height=\"256\" fill=\"#e1edf3\"/><path d=\"M0 128H256M128 0V256\" stroke=\"#c9d4db\"/><text x=\"8\" y=\"18\" fill=\"#8296a3\" font-size=\"10\">TEST TILE</text></svg>");
const savedState = {
  collectedCardIds: ["silo-kanto", "silo-zenno-kashima", "silo-toyo", "grain-wheat"],
  totalQuizAttempts: 9, correctAnswers: 6,
  wrongAnswerQuizIds: ["quiz-tohoku-1"], answeredQuizIds: ["quiz-kanto-1", "quiz-tohoku-1"],
  categoryStats: { silo: { attempts: 6, correct: 3 }, grain: { attempts: 3, correct: 3 }, trader: { attempts: 0, correct: 0 } },
};

test.beforeEach(async ({ page }) => {
  // OSMの実タイルを自動巡回・取得しない。
  await page.route("https://tile.openstreetmap.org/**", route => route.fulfill({ contentType: "image/svg+xml", body: TILE }));
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
  await expect(page.getByRole("dialog").locator("h2")).toHaveCSS("color", "rgb(24, 55, 71)");
  await expect(page.getByRole("dialog").getByText("サイロカード", { exact: true })).toHaveCSS("color", "rgb(17, 125, 121)");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect.poll(() => getCollectionState(page)).toEqual(savedState);
  await page.reload();
  await expect(page.getByTestId("silo-selected-detail")).toContainText("関東グレーンターミナル");
  await expect.poll(() => getCollectionState(page)).toEqual(savedState);
  await page.getByRole("link", { name: "コレクションで見る", exact: true }).click();
  await expect(page).toHaveURL(/\/collection#card-silo-kanto/);
  await expect(page.locator("#card-silo-kanto")).toBeInViewport({ ratio: 1 });
});

test("未獲得も所在地を表示し、ゲームのカード詳細は開かない", async ({ page }) => {
  await page.goto("/map?silo=silo-tohoku");
  await expect(page.getByTestId("silo-selected-detail")).toContainText("東北グレーンターミナル");
  await expect(page.getByTestId("silo-selected-detail")).toContainText("未獲得");
  const pin = page.locator('[data-testid="silo-marker"][data-silo-id="silo-tohoku"]');
  await expect(pin).toHaveAttribute("data-collected", "false");
  await expect(pin).toBeInViewport({ ratio: 1 });
  await expect(page.getByRole("button", { name: "カードの詳細を見る" })).toHaveCount(0);
  await page.getByRole("button", { name: "獲得済み", exact: true }).click();
  await expect(page.locator('[data-silo-id="silo-tohoku"]')).toHaveCount(0);
  await expect(page.getByTestId("silo-sidebar").getByRole("button", { name: /を選択$/ })).toHaveCount(3);
  await expect.poll(() => getCollectionState(page)).toEqual(savedState);
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
  await expect(page.getByRole("button", { name: "すべて", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("silo-sidebar").getByRole("button", { name: /を選択$/ })).toHaveCount(21);
});

test("全獲得でも施設一覧は21件を維持する", async ({ page }) => {
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
  await expect(page.getByText(/背景画像の読み込みに失敗/)).toBeVisible();
  await page.getByRole("button", { name: "カードの詳細を見る" }).click();
  await expect(page.getByRole("dialog")).toContainText("所在地");
  await page.getByRole("button", { name: "詳細を閉じる", exact: true }).click();
  await expect.poll(() => getCollectionState(page)).toEqual(savedState);
});

test("390px幅で横にはみ出さず、地図と44px操作が使える", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/map?silo=silo-kanto");
  await expect(page.getByTestId("silo-map")).toBeVisible();
  await expect(page.getByTestId("silo-selected-detail")).toContainText("関東グレーンターミナル");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const pin = page.locator('[data-testid="silo-marker"][data-silo-id="silo-kanto"]');
  await expect(pin).toBeInViewport({ ratio: 1 });
  const box = await pin.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await expect(page.getByRole("button", { name: "全国を表示" })).toBeInViewport({ ratio: 1 });
  await expect(page.getByText("OpenStreetMap", { exact: true })).toBeVisible();
  await page.getByTestId("silo-sidebar").getByRole("button", { name: "東北グレーンターミナルを選択" }).click();
  await expect(page.getByTestId("silo-selected-detail")).toContainText("東北グレーンターミナル");
  await expect(page.locator('[data-testid="silo-marker"][data-silo-id="silo-tohoku"]')).toBeInViewport({ ratio: 1 });
  await page.getByRole("button", { name: "獲得済み", exact: true }).click();
  const visiblePins = page.getByTestId("silo-map").locator(".silo-map-icon");
  await expect(visiblePins).toHaveCount(2);
  for (const marker of await visiblePins.all()) await expect(marker).toBeInViewport({ ratio: 1 });
  await expect.poll(() => getCollectionState(page)).toEqual(savedState);
});

test("390幅の0枚でもすべてに施設ピンがあり、獲得済みでは空になる", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), {
    key: STORAGE_KEY, state: { ...savedState, collectedCardIds: [] },
  });
  await page.goto("/map");
  const pins = page.getByTestId("silo-map").locator(".silo-map-icon");
  await expect.poll(async () => (await pins.evaluateAll(items => items.reduce((sum, item) => sum + Number(item.getAttribute("data-facility-count")), 0)))).toBe(21);
  for (const pin of await pins.all()) await expect(pin).toBeInViewport({ ratio: 1 });
  await page.screenshot({ path: test.info().outputPath("qa-mobile-zero-all.png") });
  await page.getByTestId("silo-sidebar").getByRole("button", { name: "関東グレーンターミナルを選択" }).click();
  await expect(page.locator('[data-testid="silo-marker"][data-silo-id="silo-kanto"]')).toBeInViewport({ ratio: 1 });
  await expect(page.getByRole("button", { name: "カードの詳細を見る" })).toHaveCount(0);
  await page.getByRole("button", { name: "獲得済み", exact: true }).click();
  await expect(pins).toHaveCount(0);
  await expect(page.getByRole("status").filter({ hasText: "獲得済みのサイロカードがありません" })).toBeVisible();
  await page.getByRole("button", { name: "すべて", exact: true }).click();
  await expect(pins.first()).toBeInViewport({ ratio: 1 });
});

test("新潟は公式案内の施設地点であることを説明する", async ({ page }) => {
  await page.goto("/map?silo=silo-zenno-niigata");
  await expect(page.getByTestId("silo-selected-detail")).toContainText("事務所・受付側");
  await expect(page.locator('[data-silo-id="silo-zenno-niigata"]')).toBeInViewport({ ratio: 1 });
});

for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
  for (const collected of [false, true]) {
    test(`新潟の本体未確認を地図前に表示する（${viewport.width}px・${collected ? "獲得済み" : "未獲得"}）`, async ({ page }) => {
      await page.setViewportSize(viewport);
      const state = { ...savedState, collectedCardIds: collected ? [...savedState.collectedCardIds, "silo-zenno-niigata"] : savedState.collectedCardIds };
      await page.addInitScript(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), { key: STORAGE_KEY, state });
      await page.goto("/map?silo=silo-zenno-niigata");
      const warning = page.getByTestId("silo-location-warning");
      await expect(warning).toHaveText("事務所・受付の位置。サイロ本体の位置は未確認");
      await expect(warning).toBeInViewport({ ratio: 1 });
      const map = page.getByRole("region", { name: "サイロの所在地と収集状況を示す地図" });
      expect((await warning.boundingBox())!.y + (await warning.boundingBox())!.height).toBeLessThanOrEqual((await map.boundingBox())!.y);
      const pin = page.locator('[data-silo-id="silo-zenno-niigata"]');
      await expect(pin).toHaveAttribute("data-lat", "37.975386");
      await expect(pin).toHaveAttribute("data-lng", "139.238126");
      await expect(pin).toHaveAttribute("data-collected", String(collected));
      await page.screenshot({ path: test.info().outputPath("niigata-warning.png") });
      if (collected) {
        await page.getByRole("button", { name: "獲得済み", exact: true }).click();
        await expect(warning).toHaveCount(0);
        await page.getByRole("button", { name: "全農サイロ新潟支店を選択", exact: true }).click();
      } else {
        await page.getByRole("button", { name: "関東グレーンターミナルを選択", exact: true }).click();
        await expect(warning).toHaveCount(0);
        await page.getByRole("button", { name: "全農サイロ新潟支店を選択", exact: true }).click();
      }
      await expect(warning).toBeInViewport({ ratio: 1 });
      await expect.poll(() => getCollectionState(page)).toEqual(state);
    });
  }
}
