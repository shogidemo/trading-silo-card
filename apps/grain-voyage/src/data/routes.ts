import { Route } from "@/types";

/**
 * 航路データ
 *
 * 日本沿岸の主要航路を定義
 * distance はゲームバランス優先の抽象的なマス数（実距離とは無関係）
 * waypoints は海上を通るための経由点
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
    // 太平洋沿岸を通る（陸上を避ける）
    waypoints: [{ lat: 42.5, lng: 143.8 }],
    mapWaypoints: [{ x: 620, y: 210 }],
  },
  {
    id: "route-tokachi-tomakomai",
    from: "port-tokachi",
    to: "port-tomakomai",
    distance: 3,
    type: "main",
    // 襟裳岬沖を回る
    waypoints: [
      { lat: 41.9, lng: 143.2 },
      { lat: 42.0, lng: 142.5 },
    ],
    mapWaypoints: [{ x: 600, y: 270 }],
  },
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
    mapWaypoints: [{ x: 620, y: 270 }],
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
    mapWaypoints: [{ x: 620, y: 270 }, { x: 620, y: 360 }],
  },
  {
    id: "route-hachinohe-kamaishi",
    from: "port-hachinohe",
    to: "port-kamaishi",
    distance: 2,
    type: "main",
    // 三陸海岸沿い（太平洋側を通る）
    waypoints: [{ lat: 39.9, lng: 141.9 }],
    mapWaypoints: [
      { x: 660, y: 360 },  // 太平洋へ
      { x: 660, y: 420 },  // 三陸沖を南下
    ],
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
    mapWaypoints: [{ x: 660, y: 420 }, { x: 660, y: 500 }],
  },
  {
    id: "route-kashima-chiba",
    from: "port-kashima",
    to: "port-chiba",
    distance: 2,
    type: "main",
    // 房総半島東岸沖
    waypoints: [{ lat: 35.7, lng: 140.6 }],
    mapWaypoints: [{ x: 640, y: 540 }],
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
    // 房総半島南端 → 伊豆諸島北側 → 遠州灘 → 伊勢湾
    waypoints: [
      { lat: 35.0, lng: 139.9 },  // 房総半島南端沖
      { lat: 34.5, lng: 139.2 },  // 伊豆大島沖
      { lat: 34.3, lng: 138.0 },  // 遠州灘
      { lat: 34.5, lng: 137.2 },  // 渥美半島沖
    ],
    mapWaypoints: [{ x: 640, y: 540 }, { x: 640, y: 610 }],
  },
  {
    id: "route-chita-hekinan",
    from: "port-chita",
    to: "port-hekinan",
    distance: 1,
    type: "branch",
    // 三河湾内
    waypoints: [{ lat: 34.9, lng: 136.95 }],
    mapWaypoints: [{ x: 580, y: 630 }],
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
    // 伊勢湾 → 紀伊水道 → 大阪湾（紀伊半島南側を回る）
    waypoints: [
      { lat: 34.4, lng: 136.9 },  // 伊勢湾口
      { lat: 33.8, lng: 136.2 },  // 熊野灘
      { lat: 33.5, lng: 135.5 },  // 紀伊半島南端沖
      { lat: 34.0, lng: 135.0 },  // 紀伊水道
    ],
    mapWaypoints: [
      { x: 600, y: 660 },  // 伊勢湾から紀伊半島南へ
      { x: 480, y: 660 },  // 西へ
    ],
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
    mapWaypoints: [{ x: 440, y: 600 }, { x: 440, y: 610 }],
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
    mapWaypoints: [
      { x: 440, y: 610 },  // 瀬戸内海から豊後水道へ
      { x: 440, y: 700 },  // 豊後水道を南下
      { x: 420, y: 780 },  // 日向灘を南下
    ],
  },
  {
    id: "route-shibushi-kagoshima",
    from: "port-shibushi",
    to: "port-kagoshima",
    distance: 2,
    type: "main",
    // 大隅半島沖を回る
    waypoints: [
      { lat: 31.2, lng: 131.0 },  // 大隅半島南端沖
    ],
    mapWaypoints: [{ x: 420, y: 820 }, { x: 340, y: 820 }],
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
      { x: 480, y: 270 },   // 苫小牧から西へ向かう
      { x: 480, y: 320 },   // 津軽海峡へ
      { x: 320, y: 320 },   // 海峡を西へ通過→日本海
      { x: 320, y: 440 },   // 日本海を南下
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
    mapWaypoints: [{ x: 260, y: 440 }, { x: 260, y: 640 }],
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
    mapWaypoints: [{ x: 240, y: 640 }, { x: 240, y: 720 }],
  },
  {
    id: "route-yatsushiro-kagoshima",
    from: "port-yatsushiro",
    to: "port-kagoshima",
    distance: 3,
    type: "main",
    // 八代海 → 天草灘 → 東シナ海 → 鹿児島湾（九州を南回り）
    waypoints: [
      { lat: 32.0, lng: 130.3 },  // 天草灘
      { lat: 31.8, lng: 130.2 },  // 甑島沖
    ],
    mapWaypoints: [
      { x: 200, y: 720 },   // 九州西側を南下
      { x: 200, y: 820 },   // 九州南端
      { x: 340, y: 820 },   // 東へ
    ],
  },
  {
    id: "route-hakata-kagoshima",
    from: "port-hakata",
    to: "port-kagoshima",
    distance: 4,
    type: "main",
    // 玄界灘 → 東シナ海 → 鹿児島湾（九州の西側を南回り）
    waypoints: [
      { lat: 33.0, lng: 129.8 },  // 五島灘
      { lat: 32.2, lng: 129.8 },  // 東シナ海
      { lat: 31.5, lng: 130.0 },  // 薩摩半島西
    ],
    mapWaypoints: [
      { x: 200, y: 640 },   // 九州西側へ
      { x: 200, y: 820 },   // 南下
      { x: 340, y: 820 },   // 九州南端を東へ
    ],
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
    mapWaypoints: [{ x: 320, y: 610 }, { x: 320, y: 640 }],
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
    mapWaypoints: [
      { x: 400, y: 620 },  // 瀬戸内海を西へ
      { x: 260, y: 620 },  // 関門海峡経由
    ],
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
