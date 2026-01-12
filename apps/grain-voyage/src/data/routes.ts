import { Route } from "@/types";

/**
 * 航路データ
 *
 * 日本沿岸の主要航路を定義
 * distance はゲームバランス優先の抽象的なマス数（実距離とは無関係）
 *
 * 【航路構成】
 * - 太平洋ルート（メイン）: 釧路 → 苫小牧 → 八戸 → 鹿島 → 千葉 → 知多 → 神戸 → 水島 → 志布志 → 鹿児島
 * - 日本海ルート: 苫小牧 → 新潟 → 博多
 * - 支線: 十勝、釜石、碧南、八代 など
 */

export const routes: Route[] = [
  // ========================================
  // 北海道エリア
  // ========================================
  {
    id: "route-kushiro-tokachi",
    from: "port-kushiro",
    to: "port-tokachi",
    distance: 2,
    type: "branch",
  },
  {
    id: "route-tokachi-tomakomai",
    from: "port-tokachi",
    to: "port-tomakomai",
    distance: 3,
    type: "main",
  },
  {
    id: "route-kushiro-tomakomai",
    from: "port-kushiro",
    to: "port-tomakomai",
    distance: 4,
    type: "main",
  },

  // ========================================
  // 北海道 → 東北（太平洋側）
  // ========================================
  {
    id: "route-tomakomai-hachinohe",
    from: "port-tomakomai",
    to: "port-hachinohe",
    distance: 4,
    type: "main",
  },
  {
    id: "route-hachinohe-kamaishi",
    from: "port-hachinohe",
    to: "port-kamaishi",
    distance: 2,
    type: "main",
  },

  // ========================================
  // 東北 → 関東（太平洋側）
  // ========================================
  {
    id: "route-kamaishi-kashima",
    from: "port-kamaishi",
    to: "port-kashima",
    distance: 5,
    type: "main",
  },
  {
    id: "route-kashima-chiba",
    from: "port-kashima",
    to: "port-chiba",
    distance: 2,
    type: "main",
  },

  // ========================================
  // 関東 → 中部（太平洋側）
  // ========================================
  {
    id: "route-chiba-chita",
    from: "port-chiba",
    to: "port-chita",
    distance: 5,
    type: "main",
  },
  {
    id: "route-chita-hekinan",
    from: "port-chita",
    to: "port-hekinan",
    distance: 1,
    type: "branch",
  },

  // ========================================
  // 中部 → 関西 → 中国（瀬戸内海）
  // ========================================
  {
    id: "route-chita-kobe",
    from: "port-chita",
    to: "port-kobe",
    distance: 3,
    type: "main",
  },
  {
    id: "route-kobe-mizushima",
    from: "port-kobe",
    to: "port-mizushima",
    distance: 3,
    type: "main",
  },

  // ========================================
  // 中国 → 九州（太平洋・瀬戸内海側）
  // ========================================
  {
    id: "route-mizushima-shibushi",
    from: "port-mizushima",
    to: "port-shibushi",
    distance: 5,
    type: "main",
  },
  {
    id: "route-shibushi-kagoshima",
    from: "port-shibushi",
    to: "port-kagoshima",
    distance: 2,
    type: "main",
  },

  // ========================================
  // 日本海ルート
  // ========================================
  {
    id: "route-tomakomai-niigata",
    from: "port-tomakomai",
    to: "port-niigata",
    distance: 5,
    type: "main",
  },
  {
    id: "route-niigata-hakata",
    from: "port-niigata",
    to: "port-hakata",
    distance: 6,
    type: "main",
  },

  // ========================================
  // 九州内航路
  // ========================================
  {
    id: "route-hakata-yatsushiro",
    from: "port-hakata",
    to: "port-yatsushiro",
    distance: 2,
    type: "branch",
  },
  {
    id: "route-yatsushiro-kagoshima",
    from: "port-yatsushiro",
    to: "port-kagoshima",
    distance: 3,
    type: "main",
  },
  {
    id: "route-hakata-kagoshima",
    from: "port-hakata",
    to: "port-kagoshima",
    distance: 4,
    type: "main",
  },

  // ========================================
  // 瀬戸内海 ↔ 日本海側 接続
  // ========================================
  {
    id: "route-mizushima-hakata",
    from: "port-mizushima",
    to: "port-hakata",
    distance: 4,
    type: "main",
  },
  {
    id: "route-kobe-hakata",
    from: "port-kobe",
    to: "port-hakata",
    distance: 5,
    type: "branch",
  },
];

/**
 * 港IDから接続している航路を取得
 */
export function getRoutesFromPort(portId: string): Route[] {
  return routes.filter((r) => r.from === portId || r.to === portId);
}

/**
 * 港IDから接続先の港IDリストを取得
 */
export function getConnectedPorts(portId: string): string[] {
  const connected: string[] = [];
  for (const route of routes) {
    if (route.from === portId) {
      connected.push(route.to);
    } else if (route.to === portId) {
      connected.push(route.from);
    }
  }
  return connected;
}

/**
 * 2つの港間の航路を取得
 */
export function getRouteBetween(
  portId1: string,
  portId2: string
): Route | undefined {
  return routes.find(
    (r) =>
      (r.from === portId1 && r.to === portId2) ||
      (r.from === portId2 && r.to === portId1)
  );
}

/**
 * 航路の総マス数を計算
 */
export function getTotalRouteDistance(): number {
  return routes.reduce((sum, r) => sum + r.distance, 0);
}
