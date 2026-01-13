import { Route } from "@/types";

/**
 * 航路データ
 *
 * 日本沿岸の主要航路を定義
 * distance はゲームバランス優先の抽象的なマス数（実距離とは無関係）
 * waypoints は海上を通るための経由点
 *
 * 【航路構成】
 * - 太平洋ルート（メイン）: 釧路 → 苫小牧 → 八戸 → 鹿島 → 衣浦 → 神戸 → 水島 → 志布志
 * - 日本海ルート: 苫小牧 → 新潟 → 博多
 * - 支線: 釜石、八代 など
 */

export const routes: Route[] = [
  // ========================================
  // 北海道エリア
  // ========================================
  {
    id: "route-kushiro-tomakomai",
    from: "port-kushiro",
    to: "port-tomakomai",
    distance: 4,
    type: "main",
    // 太平洋側を通り襟裳岬沖を回る
    waypoints: [
      { lat: 42.3, lng: 143.5 },
      { lat: 41.8, lng: 142.8 },
      { lat: 42.0, lng: 142.0 },
    ],
    mapWaypoints: [{ x: 620, y: 260 }, { x: 580, y: 260 }],
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
    // 津軽海峡東側を通過
    waypoints: [
      { lat: 41.8, lng: 141.5 },
      { lat: 41.2, lng: 141.6 },
    ],
    mapWaypoints: [{ x: 600, y: 250 }, { x: 600, y: 290 }],
  },
  {
    id: "route-hachinohe-kamaishi",
    from: "port-hachinohe",
    to: "port-kamaishi",
    distance: 2,
    type: "main",
    // 三陸海岸沿い（太平洋側を通る）
    waypoints: [{ lat: 39.9, lng: 141.9 }],
    mapWaypoints: [{ x: 590, y: 345 }],
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
    // 三陸・常磐沖を南下
    waypoints: [
      { lat: 38.5, lng: 141.8 },
      { lat: 37.5, lng: 141.5 },
      { lat: 36.5, lng: 141.0 },
    ],
    mapWaypoints: [{ x: 590, y: 410 }, { x: 580, y: 450 }],
  },
  // ========================================
  // 関東 → 中部（太平洋側）
  // ========================================
  {
    id: "route-kashima-kinuura",
    from: "port-kashima",
    to: "port-kinuura",
    distance: 6,
    type: "main",
    // 房総半島南端 → 伊豆諸島北側 → 遠州灘 → 伊勢湾
    waypoints: [
      { lat: 35.7, lng: 140.6 },  // 房総半島東岸沖
      { lat: 35.0, lng: 139.9 },  // 房総半島南端沖
      { lat: 34.5, lng: 139.2 },  // 伊豆大島沖
      { lat: 34.3, lng: 138.0 },  // 遠州灘
      { lat: 34.5, lng: 137.2 },  // 渥美半島沖
    ],
    mapWaypoints: [{ x: 540, y: 520 }, { x: 490, y: 560 }, { x: 430, y: 560 }],
  },
  // ========================================
  // 中部 → 関西 → 中国（瀬戸内海）
  // ========================================
  {
    id: "route-kinuura-kobe",
    from: "port-kinuura",
    to: "port-kobe",
    distance: 3,
    type: "main",
    // 伊勢湾 → 紀伊水道 → 大阪湾（紀伊半島南側を回る）
    waypoints: [
      { lat: 34.4, lng: 136.9 },  // 伊勢湾口
      { lat: 33.8, lng: 136.2 },  // 熊野灘
      { lat: 33.5, lng: 135.5 },  // 紀伊半島南端沖
      { lat: 34.0, lng: 135.0 },  // 紀伊水道
    ],
    mapWaypoints: [{ x: 420, y: 580 }, { x: 360, y: 560 }],
  },
  {
    id: "route-kobe-mizushima",
    from: "port-kobe",
    to: "port-mizushima",
    distance: 3,
    type: "main",
    // 瀬戸内海を西進
    waypoints: [
      { lat: 34.6, lng: 134.8 },  // 明石海峡西
      { lat: 34.5, lng: 134.2 },  // 播磨灘
    ],
    mapWaypoints: [{ x: 310, y: 555 }],
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
    // 瀬戸内海 → 豊後水道 → 日向灘
    waypoints: [
      { lat: 34.2, lng: 133.3 },  // 備讃瀬戸
      { lat: 33.8, lng: 132.5 },  // 燧灘
      { lat: 33.3, lng: 132.2 },  // 豊後水道北
      { lat: 32.5, lng: 131.8 },  // 豊後水道南
      { lat: 31.8, lng: 131.5 },  // 日向灘
    ],
    mapWaypoints: [{ x: 320, y: 580 }, { x: 320, y: 640 }, { x: 260, y: 680 }],
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
    // 津軽海峡を抜けて日本海側を南下
    waypoints: [
      { lat: 41.5, lng: 140.8 },  // 津軽海峡西側
      { lat: 40.8, lng: 140.0 },  // 日本海北部
      { lat: 39.5, lng: 139.5 },  // 秋田沖
    ],
    mapWaypoints: [
      { x: 490, y: 260 },   // 苫小牧から西へ向かう
      { x: 420, y: 300 },   // 津軽海峡へ
      { x: 420, y: 370 },   // 日本海を南下
    ],
  },
  {
    id: "route-niigata-hakata",
    from: "port-niigata",
    to: "port-hakata",
    distance: 6,
    type: "main",
    // 日本海を南西に
    waypoints: [
      { lat: 37.0, lng: 138.0 },  // 佐渡島南
      { lat: 36.0, lng: 136.5 },  // 能登半島沖
      { lat: 35.5, lng: 135.5 },  // 隠岐諸島沖
      { lat: 34.5, lng: 132.0 },  // 山陰沖
      { lat: 34.0, lng: 130.8 },  // 対馬海峡東
    ],
    mapWaypoints: [{ x: 400, y: 450 }, { x: 320, y: 490 }, { x: 240, y: 540 }],
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
    // 有明海経由
    waypoints: [
      { lat: 33.0, lng: 130.4 },  // 島原湾
    ],
    mapWaypoints: [{ x: 220, y: 600 }],
  },
  {
    id: "route-yatsushiro-shibushi",
    from: "port-yatsushiro",
    to: "port-shibushi",
    distance: 3,
    type: "main",
    // 八代海 → 天草灘 → 日向灘
    waypoints: [
      { lat: 32.0, lng: 130.3 },  // 天草灘
      { lat: 31.5, lng: 130.8 },  // 薩摩半島東沖
    ],
    mapWaypoints: [{ x: 170, y: 660 }, { x: 180, y: 700 }],
  },
  {
    id: "route-hakata-shibushi",
    from: "port-hakata",
    to: "port-shibushi",
    distance: 5,
    type: "main",
    // 玄界灘 → 東シナ海 → 日向灘
    waypoints: [
      { lat: 33.0, lng: 129.8 },  // 五島灘
      { lat: 32.2, lng: 129.8 },  // 東シナ海
      { lat: 31.5, lng: 130.5 },  // 大隅半島西沖
    ],
    mapWaypoints: [{ x: 150, y: 600 }, { x: 130, y: 650 }, { x: 160, y: 690 }],
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
    // 瀬戸内海 → 関門海峡 → 玄界灘
    waypoints: [
      { lat: 34.0, lng: 132.5 },  // 広島湾
      { lat: 33.9, lng: 131.5 },  // 周防灘
      { lat: 33.95, lng: 130.9 }, // 関門海峡
    ],
    mapWaypoints: [{ x: 260, y: 565 }, { x: 220, y: 575 }],
  },
  {
    id: "route-kobe-hakata",
    from: "port-kobe",
    to: "port-hakata",
    distance: 5,
    type: "branch",
    // 瀬戸内海を西進 → 関門海峡（本州の南側を通る）
    waypoints: [
      { lat: 34.5, lng: 134.5 },  // 播磨灘
      { lat: 34.3, lng: 133.5 },  // 備讃瀬戸
      { lat: 34.0, lng: 132.0 },  // 広島湾
      { lat: 33.9, lng: 131.0 },  // 関門海峡
    ],
    mapWaypoints: [{ x: 300, y: 560 }, { x: 250, y: 570 }, { x: 210, y: 580 }],
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
