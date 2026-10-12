import { test, expect } from "@playwright/test";
import { setCollectionStateBeforeLoad, getCollectionState } from "./helpers/test-utils";

const TILE = '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#315b62"/><path d="M0 140H256M180 0V256" stroke="#5a8190" stroke-width="36"/><text x="12" y="24" fill="#fff">SYNTHETIC PHOTO TILE</text></svg>';

test.beforeEach(async ({ page }) => {
  await page.route("https://tile.openstreetmap.org/**", route => route.fulfill({ contentType: "image/svg+xml", body: TILE }));
  await page.route("https://cyberjapandata.gsi.go.jp/**", route => route.fulfill({ contentType: "image/svg+xml", body: TILE }));
  await setCollectionStateBeforeLoad(page, { collectedCardIds: [] });
});

test("広域では写真を先読みせず、未獲得施設を選んで航空写真と地図を切り替えられる", async ({ page }) => {
  const photos: string[] = [];
  page.on("request", request => { if (request.url().includes("/xyz/seamlessphoto/")) photos.push(request.url()); });
  await page.goto("/map");
  await page.getByRole("button", { name: "航空写真", exact: true }).click();
  await expect(page.getByText("施設を選ぶか拡大すると、航空写真を表示します。", { exact: true })).toBeVisible();
  expect(photos).toEqual([]);
  await page.getByTestId("silo-sidebar").getByRole("button", { name: "東北グレーンターミナルを選択" }).click();
  await expect.poll(() => photos.length).toBeGreaterThan(0);
  expect(photos.every(url => Number(url.split("/seamlessphoto/")[1].split("/")[0]) >= 14)).toBe(true);
  await expect(page.locator('[data-silo-id="silo-tohoku"]')).toBeInViewport({ ratio: 1 });
  await expect(page.getByTestId("silo-selected-detail")).toContainText("○ 未獲得");
  await expect(page.getByRole("button", { name: "カードの詳細を見る", exact: true })).toHaveCount(0);
  await expect(page.getByTestId("silo-map").getByRole("link", { name: "国土地理院", exact: true })).toBeVisible();
  const google = page.getByRole("link", { name: "Googleマップで見る", exact: true });
  await expect(google).toHaveAttribute("href", /https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/);
  await page.screenshot({ path: "/Users/shosato/Documents/Codex/2026-10-12/task-2/qa-mobile-aerial-mock.png" });
  await page.getByRole("button", { name: "地図", exact: true }).click();
  await expect(page.getByRole("button", { name: "地図", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-silo-id="silo-tohoku"]')).toBeInViewport({ ratio: 1 });
  expect((await getCollectionState(page))?.collectedCardIds).toEqual([]);
});

test("航空写真に接続できなくても施設一覧とGoogleマップへの導線を維持する", async ({ page }) => {
  await page.route("https://cyberjapandata.gsi.go.jp/**", route => route.abort());
  await page.goto("/map?silo=silo-tohoku");
  await page.getByRole("button", { name: "航空写真", exact: true }).click();
  await expect(page.getByText(/背景画像の読み込みに失敗/)).toBeVisible();
  await expect(page.getByTestId("silo-sidebar").getByRole("button", { name: /を選択$/ })).toHaveCount(21);
  await expect(page.getByRole("link", { name: "Googleマップで見る", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "地図", exact: true }).click();
  await expect(page.getByText(/背景画像の読み込みに失敗/)).toHaveCount(0);
  expect((await getCollectionState(page))?.collectedCardIds).toEqual([]);
});
