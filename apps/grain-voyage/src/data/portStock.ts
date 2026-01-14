/**
 * 港の穀物在庫・価格データ
 *
 * 各港で売買できる穀物と価格を定義
 * - buyPrice: 購入価格（円/トン）
 * - sellPrice: 売却価格（円/トン）
 * - stock: 在庫量（トン）- ゲーム中は無制限として扱う
 */

export interface GrainStock {
  grainId: string;
  grainName: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
}

export interface PortStock {
  portId: string;
  grains: GrainStock[];
}

// 穀物の基準価格（円/トン）
// 売値は買値の約90%（同じ港で売買すると損をする）
const BASE_PRICES = {
  "grain-wheat": { buy: 80, sell: 72 },
  "grain-soybean": { buy: 90, sell: 81 },
  "grain-corn": { buy: 60, sell: 54 },
  "grain-barley": { buy: 70, sell: 63 },
  "grain-canola": { buy: 100, sell: 90 },
};

// 穀物名のマッピング
const GRAIN_NAMES: Record<string, string> = {
  "grain-wheat": "小麦",
  "grain-soybean": "大豆",
  "grain-corn": "トウモロコシ",
  "grain-barley": "大麦",
  "grain-canola": "菜種",
};

// 港ごとの在庫データ
// 北海道・東北は原料産地なので買値が安い
// 関東・関西は消費地なので売値が高い（ただし同じ港で売買すると損）
// sellPrice = buyPrice * 0.9（約10%の手数料相当）
export const portStocks: PortStock[] = [
  // === 北海道（産地：買値安め） ===
  {
    portId: "port-kushiro",
    grains: [
      { grainId: "grain-corn", grainName: "トウモロコシ", buyPrice: 50, sellPrice: 45, stock: 1000 },
      { grainId: "grain-soybean", grainName: "大豆", buyPrice: 80, sellPrice: 72, stock: 500 },
    ],
  },
  {
    portId: "port-tomakomai",
    grains: [
      { grainId: "grain-corn", grainName: "トウモロコシ", buyPrice: 55, sellPrice: 50, stock: 1200 },
      { grainId: "grain-soybean", grainName: "大豆", buyPrice: 85, sellPrice: 77, stock: 800 },
    ],
  },

  // === 東北（中継地点） ===
  {
    portId: "port-hachinohe",
    grains: [
      { grainId: "grain-corn", grainName: "トウモロコシ", buyPrice: 60, sellPrice: 54, stock: 600 },
      { grainId: "grain-soybean", grainName: "大豆", buyPrice: 90, sellPrice: 81, stock: 400 },
    ],
  },
  {
    portId: "port-kamaishi",
    grains: [
      { grainId: "grain-corn", grainName: "トウモロコシ", buyPrice: 60, sellPrice: 54, stock: 500 },
      { grainId: "grain-soybean", grainName: "大豆", buyPrice: 90, sellPrice: 81, stock: 300 },
    ],
  },

  // === 関東（消費地：売値高め、産地から運べば利益） ===
  {
    portId: "port-kashima",
    grains: [
      { grainId: "grain-corn", grainName: "トウモロコシ", buyPrice: 70, sellPrice: 63, stock: 2000 },
      { grainId: "grain-soybean", grainName: "大豆", buyPrice: 100, sellPrice: 90, stock: 1500 },
      { grainId: "grain-wheat", grainName: "小麦", buyPrice: 90, sellPrice: 81, stock: 1000 },
    ],
  },
  // === 北陸 ===
  {
    portId: "port-niigata",
    grains: [
      { grainId: "grain-corn", grainName: "トウモロコシ", buyPrice: 65, sellPrice: 59, stock: 600 },
      { grainId: "grain-soybean", grainName: "大豆", buyPrice: 95, sellPrice: 86, stock: 400 },
      { grainId: "grain-wheat", grainName: "小麦", buyPrice: 85, sellPrice: 77, stock: 300 },
    ],
  },

  // === 中部 ===
  {
    portId: "port-kinuura",
    grains: [
      { grainId: "grain-corn", grainName: "トウモロコシ", buyPrice: 68, sellPrice: 61, stock: 2000 },
      { grainId: "grain-soybean", grainName: "大豆", buyPrice: 98, sellPrice: 88, stock: 1000 },
      { grainId: "grain-wheat", grainName: "小麦", buyPrice: 88, sellPrice: 79, stock: 800 },
    ],
  },

  // === 関西（消費地：売値高め、産地から運べば利益） ===
  {
    portId: "port-kobe",
    grains: [
      { grainId: "grain-corn", grainName: "トウモロコシ", buyPrice: 70, sellPrice: 63, stock: 1200 },
      { grainId: "grain-soybean", grainName: "大豆", buyPrice: 100, sellPrice: 90, stock: 900 },
      { grainId: "grain-wheat", grainName: "小麦", buyPrice: 90, sellPrice: 81, stock: 700 },
    ],
  },

  // === 中国 ===
  {
    portId: "port-mizushima",
    grains: [
      { grainId: "grain-corn", grainName: "トウモロコシ", buyPrice: 65, sellPrice: 59, stock: 1800 },
      { grainId: "grain-soybean", grainName: "大豆", buyPrice: 95, sellPrice: 86, stock: 1200 },
      { grainId: "grain-wheat", grainName: "小麦", buyPrice: 85, sellPrice: 77, stock: 800 },
      { grainId: "grain-canola", grainName: "菜種", buyPrice: 95, sellPrice: 86, stock: 600 },
    ],
  },

  // === 九州（畜産需要で売値高め、産地から運べば利益） ===
  {
    portId: "port-hakata",
    grains: [
      { grainId: "grain-corn", grainName: "トウモロコシ", buyPrice: 68, sellPrice: 61, stock: 800 },
      { grainId: "grain-soybean", grainName: "大豆", buyPrice: 98, sellPrice: 88, stock: 500 },
      { grainId: "grain-wheat", grainName: "小麦", buyPrice: 88, sellPrice: 79, stock: 400 },
    ],
  },
  {
    portId: "port-yatsushiro",
    grains: [
      { grainId: "grain-corn", grainName: "トウモロコシ", buyPrice: 65, sellPrice: 59, stock: 500 },
      { grainId: "grain-soybean", grainName: "大豆", buyPrice: 95, sellPrice: 86, stock: 300 },
    ],
  },
  {
    portId: "port-shibushi",
    grains: [
      { grainId: "grain-corn", grainName: "トウモロコシ", buyPrice: 62, sellPrice: 56, stock: 1000 },
      { grainId: "grain-soybean", grainName: "大豆", buyPrice: 92, sellPrice: 83, stock: 700 },
    ],
  },
];

/**
 * 港IDから在庫データを取得
 */
export function getPortStock(portId: string): PortStock | undefined {
  return portStocks.find((ps) => ps.portId === portId);
}

/**
 * 港で特定の穀物の買値を取得
 */
export function getGrainBuyPrice(portId: string, grainId: string): number | undefined {
  const portStock = getPortStock(portId);
  if (!portStock) return undefined;
  const grain = portStock.grains.find((g) => g.grainId === grainId);
  return grain?.buyPrice;
}

/**
 * 港で特定の穀物の売値を取得
 */
export function getGrainSellPrice(portId: string, grainId: string): number | undefined {
  const portStock = getPortStock(portId);
  if (!portStock) return undefined;
  const grain = portStock.grains.find((g) => g.grainId === grainId);
  return grain?.sellPrice;
}
