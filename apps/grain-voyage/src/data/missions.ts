/**
 * ミッション（配送依頼）データ
 *
 * プレイヤーはミッションを受注し、指定された穀物を
 * 出発港で積んで目的港に届けることで報酬を得る
 */

export interface Mission {
  id: string;
  title: string;
  description: string;
  grainId: string;
  grainName: string;
  amount: number; // 必要量（トン）
  fromPortId: string;
  fromPortName: string;
  toPortId: string;
  toPortName: string;
  reward: number; // 報酬（円）
  bonusTurns?: number; // ボーナス獲得可能ターン数
  bonusReward?: number; // 早期達成ボーナス
}

// ミッションテンプレート（ゲーム開始時にランダム選択）
export const missionTemplates: Omit<Mission, "id">[] = [
  // === 北海道発 → 本州・九州着 ===
  {
    title: "北海道産トウモロコシを関東へ",
    description: "十勝のトウモロコシを鹿島港の飼料工場へ届けてください",
    grainId: "grain-corn",
    grainName: "トウモロコシ",
    amount: 50,
    fromPortId: "port-tokachi",
    fromPortName: "十勝港",
    toPortId: "port-kashima",
    toPortName: "鹿島港",
    reward: 3000,
    bonusTurns: 8,
    bonusReward: 1000,
  },
  {
    title: "苫小牧の大豆を神戸へ",
    description: "苫小牧で積んだ大豆を神戸の食品工場へ配送",
    grainId: "grain-soybean",
    grainName: "大豆",
    amount: 40,
    fromPortId: "port-tomakomai",
    fromPortName: "苫小牧港",
    toPortId: "port-kobe",
    toPortName: "神戸港",
    reward: 3500,
    bonusTurns: 10,
    bonusReward: 1200,
  },
  {
    title: "釧路から鹿児島へ長距離配送",
    description: "釧路のトウモロコシを九州の畜産農家へ",
    grainId: "grain-corn",
    grainName: "トウモロコシ",
    amount: 60,
    fromPortId: "port-kushiro",
    fromPortName: "釧路港",
    toPortId: "port-kagoshima",
    toPortName: "鹿児島港",
    reward: 5000,
    bonusTurns: 15,
    bonusReward: 2000,
  },

  // === 関東・中部発 ===
  {
    title: "鹿島の小麦を博多へ",
    description: "鹿島港の小麦を博多の製粉工場へ",
    grainId: "grain-wheat",
    grainName: "小麦",
    amount: 50,
    fromPortId: "port-kashima",
    fromPortName: "鹿島港",
    toPortId: "port-hakata",
    toPortName: "博多港",
    reward: 2800,
    bonusTurns: 9,
    bonusReward: 900,
  },
  {
    title: "千葉から水島へ大豆輸送",
    description: "千葉港の大豆を水島の油脂工場へ",
    grainId: "grain-soybean",
    grainName: "大豆",
    amount: 45,
    fromPortId: "port-chiba",
    fromPortName: "千葉港",
    toPortId: "port-mizushima",
    toPortName: "水島港",
    reward: 2500,
    bonusTurns: 7,
    bonusReward: 800,
  },

  // === 短距離ミッション ===
  {
    title: "八戸から釜石へ緊急配送",
    description: "八戸のトウモロコシを釜石へ急送",
    grainId: "grain-corn",
    grainName: "トウモロコシ",
    amount: 30,
    fromPortId: "port-hachinohe",
    fromPortName: "八戸港",
    toPortId: "port-kamaishi",
    toPortName: "釜石港",
    reward: 1200,
    bonusTurns: 4,
    bonusReward: 500,
  },
  {
    title: "知多から神戸へ小麦輸送",
    description: "知多港の小麦を神戸のパン工場へ",
    grainId: "grain-wheat",
    grainName: "小麦",
    amount: 40,
    fromPortId: "port-chita",
    fromPortName: "知多港",
    toPortId: "port-kobe",
    toPortName: "神戸港",
    reward: 1800,
    bonusTurns: 5,
    bonusReward: 600,
  },

  // === 九州内ミッション ===
  {
    title: "博多から鹿児島へ",
    description: "博多のトウモロコシを鹿児島の畜産農家へ",
    grainId: "grain-corn",
    grainName: "トウモロコシ",
    amount: 35,
    fromPortId: "port-hakata",
    fromPortName: "博多港",
    toPortId: "port-kagoshima",
    toPortName: "鹿児島港",
    reward: 1500,
    bonusTurns: 6,
    bonusReward: 500,
  },
  {
    title: "志布志から八代へ大豆配送",
    description: "志布志の大豆を八代の味噌工場へ",
    grainId: "grain-soybean",
    grainName: "大豆",
    amount: 30,
    fromPortId: "port-shibushi",
    fromPortName: "志布志港",
    toPortId: "port-yatsushiro",
    toPortName: "八代港",
    reward: 1400,
    bonusTurns: 5,
    bonusReward: 450,
  },

  // === 日本海ルート ===
  {
    title: "新潟から博多へ日本海ルート",
    description: "新潟の小麦を博多へ日本海経由で配送",
    grainId: "grain-wheat",
    grainName: "小麦",
    amount: 50,
    fromPortId: "port-niigata",
    fromPortName: "新潟港",
    toPortId: "port-hakata",
    toPortName: "博多港",
    reward: 3200,
    bonusTurns: 10,
    bonusReward: 1000,
  },
  {
    title: "苫小牧から新潟へ",
    description: "苫小牧のトウモロコシを新潟へ",
    grainId: "grain-corn",
    grainName: "トウモロコシ",
    amount: 45,
    fromPortId: "port-tomakomai",
    fromPortName: "苫小牧港",
    toPortId: "port-niigata",
    toPortName: "新潟港",
    reward: 2200,
    bonusTurns: 7,
    bonusReward: 700,
  },

  // === 大量輸送ミッション ===
  {
    title: "大量トウモロコシ輸送",
    description: "鹿島から鹿児島へ大量のトウモロコシを輸送",
    grainId: "grain-corn",
    grainName: "トウモロコシ",
    amount: 80,
    fromPortId: "port-kashima",
    fromPortName: "鹿島港",
    toPortId: "port-kagoshima",
    toPortName: "鹿児島港",
    reward: 4500,
    bonusTurns: 12,
    bonusReward: 1500,
  },
];

/**
 * ゲーム開始時に利用可能なミッションを生成
 * @param count 生成するミッション数
 */
export function generateMissions(count: number = 3): Mission[] {
  // シャッフルしてランダムに選択
  const shuffled = [...missionTemplates].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  return selected.map((template, index) => ({
    ...template,
    id: `mission-${Date.now()}-${index}`,
  }));
}

/**
 * 特定の港から出発するミッションをフィルタ
 */
export function getMissionsFromPort(
  missions: Mission[],
  portId: string
): Mission[] {
  return missions.filter((m) => m.fromPortId === portId);
}

/**
 * 特定の港が目的地のミッションをフィルタ
 */
export function getMissionsToPort(
  missions: Mission[],
  portId: string
): Mission[] {
  return missions.filter((m) => m.toPortId === portId);
}
