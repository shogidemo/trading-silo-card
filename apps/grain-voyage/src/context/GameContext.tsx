"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { demands, ports, ships } from "@/data";
import {
  Demand,
  Delivery,
  DeliveryMethod,
  Ship,
  SiloState,
} from "@/types";
import { getDeliverySpec } from "@/game/delivery";
import { applyTurnEnd, applyTurnStart, TurnState } from "@/game/turnProcessor";

export type GamePhase = "idle" | "planning" | "game_end";

export interface GameState extends TurnState {
  phase: GamePhase;
  maxTurns: number;
}

type GameAction =
  | { type: "START_GAME" }
  | { type: "UNLOAD_FROM_SHIP"; amount: number }
  | { type: "CREATE_DELIVERY"; demandId: string; originPortId: string; method: DeliveryMethod }
  | { type: "END_TURN" }
  | { type: "RESET_GAME" };

const MAX_TURNS = 20;

function initializeSiloStates(): Record<string, SiloState> {
  return ports.reduce<Record<string, SiloState>>((acc, port) => {
    acc[port.id] = {
      portId: port.id,
      capacity: port.siloCapacity,
      stock: {},
      totalStock: 0,
    };
    return acc;
  }, {});
}

function cloneShips(): Ship[] {
  return ships.map((ship) => ({ ...ship }));
}

function cloneDemands(): Demand[] {
  return demands.map((demand) => ({ ...demand }));
}

function createBaseState(turn: number): GameState {
  return {
    phase: "idle",
    turn,
    maxTurns: MAX_TURNS,
    currentShip: null,
    pendingShips: cloneShips(),
    completedShips: [],
    siloStates: initializeSiloStates(),
    visibleDemands: [],
    pendingDemands: cloneDemands(),
    completedDemands: [],
    activeDeliveries: [],
    completedDeliveries: [],
    totalDemurrageCharge: 0,
    totalDeliveryCost: 0,
    totalReward: 0,
    totalBonus: 0,
    totalPenalty: 0,
    unloadingUsed: 0,
  };
}

const initialState: GameState = createBaseState(0);

function updateSiloStock(
  silo: SiloState,
  grainId: string,
  delta: number
): SiloState {
  const current = silo.stock[grainId] ?? 0;
  const nextValue = current + delta;
  const nextStock = { ...silo.stock };
  if (nextValue <= 0) {
    delete nextStock[grainId];
  } else {
    nextStock[grainId] = nextValue;
  }

  return {
    ...silo,
    stock: nextStock,
    totalStock: Math.max(0, silo.totalStock + delta),
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      const baseState = createBaseState(1);
      const startedState = applyTurnStart(baseState);
      return {
        ...startedState,
        phase: "planning",
      };
    }

    case "UNLOAD_FROM_SHIP": {
      if (!state.currentShip) return state;
      const port = ports.find((p) => p.id === state.currentShip!.portId);
      if (!port) return state;

      const silo = state.siloStates[port.id];
      if (!silo) return state;

      const availableUnloading = Math.max(0, port.unloadingCapacity - state.unloadingUsed);
      const availableSiloSpace = Math.max(0, silo.capacity - silo.totalStock);
      const possibleAmount = Math.min(
        action.amount,
        availableUnloading,
        availableSiloSpace,
        state.currentShip.remainingCargo
      );

      if (possibleAmount <= 0) return state;

      const updatedShip: Ship = {
        ...state.currentShip,
        remainingCargo: state.currentShip.remainingCargo - possibleAmount,
      };

      const updatedSilo = updateSiloStock(silo, state.currentShip.grainId, possibleAmount);

      return {
        ...state,
        currentShip: updatedShip,
        siloStates: {
          ...state.siloStates,
          [port.id]: updatedSilo,
        },
        unloadingUsed: state.unloadingUsed + possibleAmount,
      };
    }

    case "CREATE_DELIVERY": {
      const demand = state.visibleDemands.find((d) => d.id === action.demandId);
      if (!demand || demand.fulfilled) return state;

      const silo = state.siloStates[action.originPortId];
      if (!silo) return state;

      const availableStock = silo.stock[demand.grainId] ?? 0;
      if (availableStock <= 0) return state;

      const spec = getDeliverySpec(action.method);
      const remainingDemand = Math.max(0, demand.amount - demand.fulfilledAmount);
      const amount = Math.min(spec.amount, availableStock, remainingDemand);
      if (amount <= 0) return state;

      const delivery: Delivery = {
        id: `delivery-${state.turn}-${state.activeDeliveries.length + 1}`,
        demandId: demand.id,
        originPortId: action.originPortId,
        destinationId: demand.destinationId,
        grainId: demand.grainId,
        grainName: demand.grainName,
        method: action.method,
        amount,
        remainingTurns: spec.turns,
        cost: spec.cost,
      };

      const updatedSilo = updateSiloStock(silo, demand.grainId, -amount);

      return {
        ...state,
        activeDeliveries: [...state.activeDeliveries, delivery],
        totalDeliveryCost: state.totalDeliveryCost + spec.cost,
        siloStates: {
          ...state.siloStates,
          [action.originPortId]: updatedSilo,
        },
      };
    }

    case "END_TURN": {
      const endResult = applyTurnEnd(state);
      if (endResult.gameEnded) {
        return {
          ...endResult.state,
          phase: "game_end",
        };
      }

      const nextTurnState = {
        ...endResult.state,
        turn: state.turn + 1,
      };

      const startedState = applyTurnStart(nextTurnState);

      return {
        ...startedState,
        phase: "planning",
      };
    }

    case "RESET_GAME":
      return createBaseState(0);

    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  startGame: () => void;
  unloadFromShip: (amount: number) => void;
  createDelivery: (demandId: string, originPortId: string, method: DeliveryMethod) => void;
  endTurn: () => void;
  resetGame: () => void;
  isGameOver: () => boolean;
  getCurrentPort: () => (typeof ports)[0] | null;
  getSiloState: (portId: string) => SiloState | undefined;
  getAvailableUnloading: () => number;
  getAvailableSiloSpace: () => number;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  const unloadFromShip = useCallback((amount: number) => {
    dispatch({ type: "UNLOAD_FROM_SHIP", amount });
  }, []);

  const createDelivery = useCallback((demandId: string, originPortId: string, method: DeliveryMethod) => {
    dispatch({ type: "CREATE_DELIVERY", demandId, originPortId, method });
  }, []);

  const endTurn = useCallback(() => {
    dispatch({ type: "END_TURN" });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  const isGameOver = useCallback(() => state.phase === "game_end", [state.phase]);

  const getCurrentPort = useCallback(() => {
    if (!state.currentShip) return null;
    return ports.find((p) => p.id === state.currentShip!.portId) ?? null;
  }, [state.currentShip]);

  const getSiloState = useCallback(
    (portId: string) => state.siloStates[portId],
    [state.siloStates]
  );

  const getAvailableUnloading = useCallback(() => {
    if (!state.currentShip) return 0;
    const port = ports.find((p) => p.id === state.currentShip!.portId);
    if (!port) return 0;
    return Math.max(0, port.unloadingCapacity - state.unloadingUsed);
  }, [state.currentShip, state.unloadingUsed]);

  const getAvailableSiloSpace = useCallback(() => {
    if (!state.currentShip) return 0;
    const silo = state.siloStates[state.currentShip.portId];
    if (!silo) return 0;
    return Math.max(0, silo.capacity - silo.totalStock);
  }, [state.currentShip, state.siloStates]);

  const value: GameContextValue = {
    state,
    startGame,
    unloadFromShip,
    createDelivery,
    endTurn,
    resetGame,
    isGameOver,
    getCurrentPort,
    getSiloState,
    getAvailableUnloading,
    getAvailableSiloSpace,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
