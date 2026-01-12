"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import {
  ports,
  routeCells,
  getReachableCells,
  getStartingCellId,
  RouteCell,
} from "@/data";

// ========================================
// 型定義
// ========================================

export interface Cargo {
  grainId: string;
  grainName: string;
  amount: number; // トン数
}

interface PlayerState {
  companyId: string;
  currentCellId: string; // マス制：現在のセルID
  fuel: number;
  maxFuel: number;
  money: number;
  cargo: Cargo[];
  maxCapacity: number; // 最大積載量（トン）
}

interface GameState {
  phase: "idle" | "rolling" | "selecting_destination" | "moving" | "arrived" | "port_action";
  turn: number;
  maxTurns: number;
  player: PlayerState;
  lastDiceValue: number | null;
  remainingMoves: number;
  moveHistory: string[]; // 訪問したセルのID履歴
  // 統計情報（スコア計算用）
  totalFuelCost: number;
}

type GameAction =
  | { type: "START_GAME"; companyId: string; startPortId: string }
  | { type: "ROLL_DICE"; value: number }
  | { type: "SELECT_CELL"; cellId: string }
  | { type: "COMPLETE_MOVE" }
  | { type: "ENTER_PORT_ACTION" }
  | { type: "REFUEL"; amount: number }
  | { type: "LOAD_CARGO"; grainId: string; grainName: string; amount: number; cost: number }
  | { type: "UNLOAD_CARGO"; grainId: string; amount: number; revenue: number }
  | { type: "END_TURN" }
  | { type: "RESET_GAME" };

// ========================================
// 初期状態
// ========================================

// 燃料補給コスト（円/燃料）
const FUEL_COST_PER_UNIT = 10;

// 船の最大積載量（トン）
const SHIP_MAX_CAPACITY = 100;

const initialState: GameState = {
  phase: "idle",
  turn: 0,
  maxTurns: 30,
  player: {
    companyId: "",
    currentCellId: "",
    fuel: 100,
    maxFuel: 100,
    money: 10000,
    cargo: [],
    maxCapacity: SHIP_MAX_CAPACITY,
  },
  lastDiceValue: null,
  remainingMoves: 0,
  moveHistory: [],
  totalFuelCost: 0,
};

// ========================================
// ヘルパー関数
// ========================================

// セルから港IDを取得
function getPortIdFromCell(cellId: string): string | null {
  const cell = routeCells.find((c) => c.id === cellId);
  if (cell?.type === "port" && cell.portId) {
    return cell.portId;
  }
  return null;
}

// 2つのセル間の距離（移動に必要なマス数）を計算
function getDistanceBetweenCells(fromCellId: string, toCellId: string): number {
  // 到達可能セルを取得して距離を計算
  // 最大100マスまで探索
  for (let moves = 1; moves <= 100; moves++) {
    const reachable = getReachableCells(fromCellId, moves);
    if (reachable.some((c) => c.id === toCellId)) {
      return moves;
    }
  }
  return -1; // 到達不可
}

// ========================================
// Reducer
// ========================================

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      const startCellId = getStartingCellId(action.startPortId);
      if (!startCellId) return state;

      return {
        ...initialState,
        phase: "idle",
        turn: 1,
        player: {
          ...initialState.player,
          companyId: action.companyId,
          currentCellId: startCellId,
        },
        moveHistory: [startCellId],
      };
    }

    case "ROLL_DICE":
      return {
        ...state,
        phase: "selecting_destination",
        lastDiceValue: action.value,
        remainingMoves: action.value,
      };

    case "SELECT_CELL": {
      const distance = getDistanceBetweenCells(
        state.player.currentCellId,
        action.cellId
      );
      if (distance < 0 || distance > state.remainingMoves) return state;

      const newRemainingMoves = state.remainingMoves - distance;

      // 燃料消費（1マスあたり2燃料）
      const fuelCost = distance * 2;
      const newFuel = Math.max(0, state.player.fuel - fuelCost);

      // 港に到着したかどうか
      const arrivedAtPort = getPortIdFromCell(action.cellId) !== null;

      return {
        ...state,
        phase: newRemainingMoves > 0 && !arrivedAtPort ? "selecting_destination" : "arrived",
        player: {
          ...state.player,
          currentCellId: action.cellId,
          fuel: newFuel,
        },
        remainingMoves: arrivedAtPort ? 0 : newRemainingMoves,
        moveHistory: [...state.moveHistory, action.cellId],
      };
    }

    case "COMPLETE_MOVE":
      return {
        ...state,
        phase: "arrived",
        remainingMoves: 0,
      };

    case "ENTER_PORT_ACTION": {
      // 港にいない場合は無視
      const portId = getPortIdFromCell(state.player.currentCellId);
      if (!portId) return state;

      return {
        ...state,
        phase: "port_action",
      };
    }

    case "REFUEL": {
      // 港にいない場合は無視
      const currentPortId = getPortIdFromCell(state.player.currentCellId);
      if (!currentPortId) return state;

      // 補給量の計算（最大燃料を超えない）
      const maxRefuel = state.player.maxFuel - state.player.fuel;
      const actualRefuel = Math.min(action.amount, maxRefuel);

      // コスト計算
      const cost = actualRefuel * FUEL_COST_PER_UNIT;

      // お金が足りない場合は購入できる分だけ
      const affordableAmount = Math.floor(state.player.money / FUEL_COST_PER_UNIT);
      const finalRefuel = Math.min(actualRefuel, affordableAmount);
      const finalCost = finalRefuel * FUEL_COST_PER_UNIT;

      if (finalRefuel <= 0) return state;

      return {
        ...state,
        player: {
          ...state.player,
          fuel: state.player.fuel + finalRefuel,
          money: state.player.money - finalCost,
        },
        totalFuelCost: state.totalFuelCost + finalCost,
      };
    }

    case "LOAD_CARGO": {
      // 港にいない場合は無視
      const loadPortId = getPortIdFromCell(state.player.currentCellId);
      if (!loadPortId) return state;

      // 現在の積載量を計算
      const currentLoad = state.player.cargo.reduce((sum, c) => sum + c.amount, 0);
      const availableCapacity = state.player.maxCapacity - currentLoad;

      // 積載可能量を計算
      const actualLoad = Math.min(action.amount, availableCapacity);
      if (actualLoad <= 0) return state;

      // お金が足りるか確認
      if (state.player.money < action.cost) return state;

      // 既存の同じ穀物があるか確認
      const existingCargoIndex = state.player.cargo.findIndex(
        (c) => c.grainId === action.grainId
      );

      let newCargo: Cargo[];
      if (existingCargoIndex >= 0) {
        // 既存の積荷に追加
        newCargo = state.player.cargo.map((c, i) =>
          i === existingCargoIndex
            ? { ...c, amount: c.amount + actualLoad }
            : c
        );
      } else {
        // 新しい積荷を追加
        newCargo = [
          ...state.player.cargo,
          { grainId: action.grainId, grainName: action.grainName, amount: actualLoad },
        ];
      }

      return {
        ...state,
        player: {
          ...state.player,
          cargo: newCargo,
          money: state.player.money - action.cost,
        },
      };
    }

    case "UNLOAD_CARGO": {
      // 港にいない場合は無視
      const unloadPortId = getPortIdFromCell(state.player.currentCellId);
      if (!unloadPortId) return state;

      // 該当する積荷を探す
      const cargoIndex = state.player.cargo.findIndex(
        (c) => c.grainId === action.grainId
      );
      if (cargoIndex < 0) return state;

      const cargo = state.player.cargo[cargoIndex];
      const actualUnload = Math.min(action.amount, cargo.amount);
      if (actualUnload <= 0) return state;

      // 積荷を更新
      let newCargo: Cargo[];
      if (cargo.amount - actualUnload <= 0) {
        // 全て降ろした場合は削除
        newCargo = state.player.cargo.filter((_, i) => i !== cargoIndex);
      } else {
        // 一部降ろした場合は量を減らす
        newCargo = state.player.cargo.map((c, i) =>
          i === cargoIndex ? { ...c, amount: c.amount - actualUnload } : c
        );
      }

      return {
        ...state,
        player: {
          ...state.player,
          cargo: newCargo,
          money: state.player.money + action.revenue,
        },
      };
    }

    case "END_TURN":
      return {
        ...state,
        phase: "idle",
        turn: state.turn + 1,
        lastDiceValue: null,
        remainingMoves: 0,
      };

    case "RESET_GAME":
      return initialState;

    default:
      return state;
  }
}

// ========================================
// Context
// ========================================

interface GameContextValue {
  state: GameState;
  // アクション
  startGame: (companyId: string, startPortId: string) => void;
  rollDice: (value: number) => void;
  selectCell: (cellId: string) => void;
  completeMove: () => void;
  enterPortAction: () => void;
  refuel: (amount: number) => void;
  loadCargo: (grainId: string, grainName: string, amount: number, cost: number) => void;
  unloadCargo: (grainId: string, amount: number, revenue: number) => void;
  endTurn: () => void;
  resetGame: () => void;
  // ヘルパー
  getReachableCellIds: () => string[];
  canMoveTo: (cellId: string) => boolean;
  getCurrentCell: () => RouteCell | undefined;
  getCurrentPort: () => (typeof ports)[0] | undefined;
  isAtPort: () => boolean;
  getCurrentCargoAmount: () => number;
  getAvailableCapacity: () => number;
  // 定数
  FUEL_COST_PER_UNIT: number;
}

const GameContext = createContext<GameContextValue | null>(null);

// ========================================
// Provider
// ========================================

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback((companyId: string, startPortId: string) => {
    dispatch({ type: "START_GAME", companyId, startPortId });
  }, []);

  const rollDice = useCallback((value: number) => {
    dispatch({ type: "ROLL_DICE", value });
  }, []);

  const selectCell = useCallback((cellId: string) => {
    dispatch({ type: "SELECT_CELL", cellId });
  }, []);

  const completeMove = useCallback(() => {
    dispatch({ type: "COMPLETE_MOVE" });
  }, []);

  const enterPortAction = useCallback(() => {
    dispatch({ type: "ENTER_PORT_ACTION" });
  }, []);

  const refuel = useCallback((amount: number) => {
    dispatch({ type: "REFUEL", amount });
  }, []);

  const loadCargo = useCallback(
    (grainId: string, grainName: string, amount: number, cost: number) => {
      dispatch({ type: "LOAD_CARGO", grainId, grainName, amount, cost });
    },
    []
  );

  const unloadCargo = useCallback(
    (grainId: string, amount: number, revenue: number) => {
      dispatch({ type: "UNLOAD_CARGO", grainId, amount, revenue });
    },
    []
  );

  const endTurn = useCallback(() => {
    dispatch({ type: "END_TURN" });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  // 現在位置から到達可能なセルIDのリストを取得
  const getReachableCellIds = useCallback(() => {
    if (!state.player.currentCellId || state.remainingMoves <= 0) {
      return [];
    }

    const reachable = getReachableCells(
      state.player.currentCellId,
      state.remainingMoves
    );
    return reachable.map((c) => c.id);
  }, [state.player.currentCellId, state.remainingMoves]);

  // 指定したセルに移動可能かチェック
  const canMoveTo = useCallback(
    (cellId: string) => {
      const reachableIds = getReachableCellIds();
      return reachableIds.includes(cellId);
    },
    [getReachableCellIds]
  );

  // 現在のセルを取得
  const getCurrentCell = useCallback(() => {
    return routeCells.find((c) => c.id === state.player.currentCellId);
  }, [state.player.currentCellId]);

  // 現在の港を取得（港マスにいる場合のみ）
  const getCurrentPort = useCallback(() => {
    const cell = getCurrentCell();
    if (cell?.type === "port" && cell.portId) {
      return ports.find((p) => p.id === cell.portId);
    }
    return undefined;
  }, [getCurrentCell]);

  // 港にいるかどうか
  const isAtPort = useCallback(() => {
    const cell = getCurrentCell();
    return cell?.type === "port";
  }, [getCurrentCell]);

  // 現在の積載量を取得
  const getCurrentCargoAmount = useCallback(() => {
    return state.player.cargo.reduce((sum, c) => sum + c.amount, 0);
  }, [state.player.cargo]);

  // 残り積載可能量を取得
  const getAvailableCapacity = useCallback(() => {
    return state.player.maxCapacity - getCurrentCargoAmount();
  }, [state.player.maxCapacity, getCurrentCargoAmount]);

  const value: GameContextValue = {
    state,
    startGame,
    rollDice,
    selectCell,
    completeMove,
    enterPortAction,
    refuel,
    loadCargo,
    unloadCargo,
    endTurn,
    resetGame,
    getReachableCellIds,
    canMoveTo,
    getCurrentCell,
    getCurrentPort,
    isAtPort,
    getCurrentCargoAmount,
    getAvailableCapacity,
    FUEL_COST_PER_UNIT,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// ========================================
// Hook
// ========================================

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
