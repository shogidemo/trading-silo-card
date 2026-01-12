// Re-export shared types
export type { SiloCard, GrainCard, TraderCard, Coordinates } from "@trading-silo/shared";

// ========================================
// 商社関連
// ========================================

// 架空商社
export interface Company {
  id: string;
  name: string;
  description: string;
  color: string;
  specialty: string;
  // ボーナス係数
  bonuses: {
    fuelEfficiency: number;    // 燃費効率 (1.0 = 標準)
    domesticDelivery: number;  // 国内配送ボーナス
    longDistance: number;      // 遠距離ボーナス
    bulkCapacity: number;      // 大量輸送ボーナス
  };
}

// ========================================
// 航路・港関連
// ========================================

// 港（サイロをベースに拡張）
export interface Port {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  capacity: number;        // 受入能力（トン/ターン）
  acceptableGrains: string[];  // 受入可能穀物ID
  currentDemand: Record<string, number>;  // 穀物IDごとの需要係数
}

// 航路
export interface Route {
  id: string;
  from: string;  // 港ID
  to: string;    // 港ID
  distance: number;  // マス数
  type: "main" | "branch";
  // 特殊効果
  effects?: RouteEffect[];
}

// 航路上の特殊効果
export interface RouteEffect {
  type: "wind_boost" | "wind_penalty" | "storm" | "supply" | "event";
  position: number;  // 航路上の位置（0 ~ distance-1）
  probability?: number;  // 発生確率（イベント用）
}

// ========================================
// 船関連
// ========================================

// 船の基本スペック
export interface ShipSpec {
  id: string;
  name: string;
  capacity: number;      // 積載量（トン）
  speed: number;         // サイコロボーナス
  fuelEfficiency: number;  // 燃費効率
  durability: number;    // 耐久度（悪天候耐性）
}

// 船の現在状態
export interface ShipState {
  shipId: string;
  ownerId: string;       // 商社ID
  position: ShipPosition;
  cargo: Cargo[];
  fuel: number;
  maxFuel: number;
}

// 船の位置
export type ShipPosition =
  | { type: "port"; portId: string }
  | { type: "route"; routeId: string; progress: number };

// 積荷
export interface Cargo {
  grainId: string;
  amount: number;
}

// ========================================
// ミッション関連
// ========================================

// 配送ミッション
export interface Mission {
  id: string;
  targetPortId: string;
  grainId: string;
  amount: number;
  reward: number;
  demandMultiplier: number;  // 需要係数
  deadline: number;          // 制限ターン数
}

// ========================================
// AI関連
// ========================================

// AI船の性格タイプ
export type AIPersonality =
  | "shortest"      // 最短志向
  | "profit_max"    // 報酬最大化
  | "safe"          // 安全志向
  | "balanced";     // バランス型

// AI船の状態
export interface AIShipState extends ShipState {
  personality: AIPersonality;
  currentMission: Mission | null;
}

// ========================================
// ゲーム状態
// ========================================

// ゲームモード
export type GameMode = "scenario" | "free" | "challenge";

// ゲーム全体の状態
export interface GameState {
  mode: GameMode;
  turn: number;
  maxTurns: number;
  phase: GamePhase;

  // プレイヤー
  playerCompanyId: string;
  playerShip: ShipState;
  playerMoney: number;
  playerMissions: Mission[];

  // AI
  aiShips: AIShipState[];

  // マーケット
  marketDemand: Record<string, Record<string, number>>;  // 港ID -> 穀物ID -> 需要

  // イベント
  activeEvents: GameEvent[];
}

// ゲームフェーズ
export type GamePhase =
  | "mission_select"   // ミッション選択
  | "dice_roll"        // サイコロ
  | "move"             // 移動
  | "port_action"      // 港でのアクション
  | "ai_turn"          // AI船の行動
  | "turn_end"         // ターン終了
  | "game_end";        // ゲーム終了

// ゲームイベント
export interface GameEvent {
  id: string;
  type: "storm" | "demand_surge" | "fuel_shortage" | "bonus";
  affectedPortIds?: string[];
  affectedRouteIds?: string[];
  duration: number;  // 残りターン数
  description: string;
}

// ========================================
// スコア関連
// ========================================

// スコア計算結果
export interface ScoreResult {
  deliveryRevenue: number;   // 配送収益
  fuelCost: number;          // 燃料コスト
  delayPenalty: number;      // 遅延ペナルティ
  bonuses: number;           // ボーナス
  totalScore: number;        // 最終スコア
  rank: "S" | "A" | "B" | "C" | "D";
}

// ========================================
// シナリオ関連
// ========================================

// シナリオ定義
export interface Scenario {
  id: string;
  chapter: number;
  title: string;
  description: string;
  objectives: string[];
  targetScore: number;
  initialState: Partial<GameState>;
  unlockCondition?: string;  // 前提シナリオID
}
