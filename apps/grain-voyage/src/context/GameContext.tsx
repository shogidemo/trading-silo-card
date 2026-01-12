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

interface PlayerState {
  companyId: string;
  currentCellId: string; // マス制：現在のセルID
  fuel: number;
  maxFuel: number;
  money: number;
}

interface GameState {
  phase: "idle" | "rolling" | "selecting_destination" | "moving" | "arrived";
  turn: number;
  maxTurns: number;
  player: PlayerState;
  lastDiceValue: number | null;
  remainingMoves: number;
  moveHistory: string[]; // 訪問したセルのID履歴
}

type GameAction =
  | { type: "START_GAME"; companyId: string; startPortId: string }
  | { type: "ROLL_DICE"; value: number }
  | { type: "SELECT_CELL"; cellId: string }
  | { type: "COMPLETE_MOVE" }
  | { type: "END_TURN" }
  | { type: "RESET_GAME" };

// ========================================
// 初期状態
// ========================================

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
  },
  lastDiceValue: null,
  remainingMoves: 0,
  moveHistory: [],
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
  endTurn: () => void;
  resetGame: () => void;
  // ヘルパー
  getReachableCellIds: () => string[];
  canMoveTo: (cellId: string) => boolean;
  getCurrentCell: () => RouteCell | undefined;
  getCurrentPort: () => (typeof ports)[0] | undefined;
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

  const value: GameContextValue = {
    state,
    startGame,
    rollDice,
    selectCell,
    completeMove,
    endTurn,
    resetGame,
    getReachableCellIds,
    canMoveTo,
    getCurrentCell,
    getCurrentPort,
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
