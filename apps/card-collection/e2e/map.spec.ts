import { test, expect } from "@playwright/test";
import { setCollectionStateBeforeLoad } from "./helpers/test-utils";

test.describe("サイロマップ", () => {
  test("ホームページからマップページに遷移できる", async ({ page }) => {
    await page.goto("/");

    // マップボタンが表示される（main内のリンクを対象）
    await expect(page.locator("main a").filter({ hasText: "サイロマップ" })).toBeVisible();

    // マップページに遷移（main内のリンクをクリック）
    await page.locator("main a").filter({ hasText: "サイロマップ" }).click();

    // マップページのヘッダーが表示される
    await expect(
      page.locator("h2").filter({ hasText: "サイロマップ" })
    ).toBeVisible();
  });

  test("マップページが正しく表示される", async ({ page }) => {
    await page.goto("/map");

    // ヘッダーが表示される
    await expect(
      page.locator("h2").filter({ hasText: "サイロマップ" })
    ).toBeVisible();
    await expect(
      page.locator("text=桃鉄風デフォルメマップで日本のサイロを巡ろう")
    ).toBeVisible();

    // 戻るリンクが表示される
    await expect(page.locator("text=ホームに戻る")).toBeVisible();

    // サイドバーのサイロ一覧が表示される
    await expect(
      page.locator("h3").filter({ hasText: "サイロ一覧" })
    ).toBeVisible();

    // 凡例が表示される
    await expect(page.locator("text=獲得済みサイロ")).toBeVisible();
    await expect(page.locator("text=未獲得サイロ")).toBeVisible();
    await expect(page.locator("text=航路（斜め移動あり）")).toBeVisible();
  });

  test("地図コンテナが表示される", async ({ page }) => {
    await page.goto("/map");

    const map = page.getByTestId("deformed-map");
    await expect(map).toBeVisible();
    await expect(map).toHaveAttribute("data-map-cols");
    await expect(map).toHaveAttribute("data-map-rows");
  });

  test("サイドバーにサイロが表示される", async ({ page }) => {
    await page.goto("/map");

    // サイドバー内のボタン（サイロリスト）を取得
    const siloButtons = page
      .getByTestId("silo-sidebar")
      .locator("button");

    // サイロが表示される（5つ以上）
    const count = await siloButtons.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("サイドバーのサイロをクリックすると選択状態になる", async ({
    page,
  }) => {
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["silo-kanto"],
    });
    await page.goto("/map");

    // 獲得済みサイロボタンをクリック
    const collectedSiloButton = page
      .getByTestId("silo-sidebar")
      .getByRole("button", {
      name: "関東グレーンターミナルを選択",
    });
    await collectedSiloButton.click();

    // 選択状態のスタイルが適用される（bg-slate-600）
    await expect(collectedSiloButton).toHaveClass(/bg-slate-600/);
  });

  test("戻るリンクでホームページに戻れる", async ({ page }) => {
    await page.goto("/map");

    // 戻るリンクをクリック
    await page.click("text=ホームに戻る");

    // ホームページに戻る
    await expect(page.locator("h2").first()).toContainText("穀物の世界を");
  });

  test("マーカーが地図上に表示される", async ({ page }) => {
    await page.goto("/map");

    const markers = page.getByTestId("silo-marker");
    await expect(markers.first()).toBeVisible();
    const count = await markers.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("デフォルメ地図が日本を表している", async ({ page }) => {
    await page.goto("/map");

    await expect(
      page.locator('[data-cell-type="land"][data-x="18"][data-y="2"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-cell-type="land"][data-x="13"][data-y="13"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-cell-type="land"][data-x="5"][data-y="15"]')
    ).toBeVisible();
  });

  test("船は縦横移動のみで航路を進む", async ({ page }) => {
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["silo-kanto", "silo-zenno-shibushi"],
    });
    await page.goto("/map");

    const ship = page.getByTestId("map-ship");

    const getShipPosition = async () => {
      const x = Number(await ship.getAttribute("data-grid-x"));
      const y = Number(await ship.getAttribute("data-grid-y"));
      return { x, y };
    };

    const sidebarButton = page
      .getByTestId("silo-sidebar")
      .getByRole("button", {
        name: "全農サイロ志布志支店を選択",
      });
    await sidebarButton.click();

    const positions: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < 10; i += 1) {
      positions.push(await getShipPosition());
      await page.waitForTimeout(180);
    }

    const uniquePositions = positions.filter((pos, index, arr) => {
      if (index === 0) return true;
      return pos.x !== arr[index - 1].x || pos.y !== arr[index - 1].y;
    });

    expect(uniquePositions.length).toBeGreaterThan(1);

    expect(uniquePositions[0]).not.toEqual(uniquePositions[uniquePositions.length - 1]);
  });
});

test.describe("サイロマップ - マーカー状態", () => {
  test("獲得済みサイロは金色マーカーで表示される", async ({ page }) => {
    // サイロカードを獲得した状態を設定
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: ["silo-kanto", "silo-tohoku"],
      totalQuizAttempts: 2,
      correctAnswers: 2,
      categoryStats: {
        silo: { attempts: 2, correct: 2 },
        grain: { attempts: 0, correct: 0 },
        trader: { attempts: 0, correct: 0 },
      },
    });
    await page.goto("/map");

    // 獲得済みマーカーが表示される
    await expect(page.locator(".silo-marker-collected").first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("未獲得サイロはグレーマーカーで表示される", async ({ page }) => {
    // 空の状態（サイロ未獲得）
    await setCollectionStateBeforeLoad(page, {
      collectedCardIds: [],
    });
    await page.goto("/map");

    // 未獲得マーカーのみが表示される
    await expect(page.locator(".silo-marker-uncollected").first()).toBeVisible({
      timeout: 5000,
    });

    // 獲得済みマーカーは表示されない
    await expect(page.locator(".silo-marker-collected")).not.toBeVisible({
      timeout: 1000,
    });
  });
});
