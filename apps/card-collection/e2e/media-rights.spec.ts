import { test, expect } from "@playwright/test";
import { setCollectionStateBeforeLoad, getCollectionState } from "./helpers/test-utils";

test("旧画像の直URLと最適化URLを配信せず、図解に差し替えて収集状態を維持する", async ({ page, request }) => {
  for (const path of ["/images/silos/tohoku-grain-terminal.jpg", "/images/grains/rice.jpg", "/images/traders/kanematsu.svg", "/screenshots/01-home.png"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(410);
  }
  const optimized = await request.get("/_next/image?url=%2Fimages%2Fgrains%2Frice.jpg&w=640&q=75");
  expect([404, 410]).toContain(optimized.status());
  expect(optimized.headers()["content-type"]).not.toMatch(/^image\//);
  await setCollectionStateBeforeLoad(page, { collectedCardIds: ["silo-tohoku", "trader-cargill", "grain-rice"] });
  const legacyRequests: string[] = [];
  page.on("request", request => { if (/\/images\/(silos|grains|traders)\//.test(decodeURIComponent(request.url()))) legacyRequests.push(request.url()); });
  await page.goto("/collection");
  await expect(page.locator("#card-silo-tohoku").getByTestId("card-artwork")).toBeVisible();
  await expect(page.locator("#card-trader-cargill").getByTestId("card-artwork")).toContainText("カーギル");
  await expect(page.locator("#card-grain-rice").getByTestId("card-artwork")).toHaveAttribute("aria-label", /オリジナル図解/);
  expect(legacyRequests).toEqual([]);
  expect((await getCollectionState(page))?.collectedCardIds).toEqual(["silo-tohoku", "trader-cargill", "grain-rice"]);
  const notices = await request.get("/third-party-notices.txt");
  expect(notices.status()).toBe(200);
  expect(await notices.text()).toContain("Hippocratic");
  await page.goto("/credits");
  await expect(page.getByRole("heading", { name: "出典・素材・ライセンス", exact: true })).toBeVisible();
  await expect(page.getByText(/旧配信画像がこれらと同一/)).toBeVisible();
});
