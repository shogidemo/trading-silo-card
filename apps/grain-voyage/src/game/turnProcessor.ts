import {
  CompletedDemand,
  Demand,
  Delivery,
  Ship,
  SiloState,
} from "@/types";
import { calculateDemurrageCharge } from "./demurrage";

const MAX_VISIBLE_DEMANDS = 2;
const EARLY_BONUS_RATE = 0.2;
const LATE_PENALTY_PER_TURN = 200000;

export interface TurnState {
  turn: number;
  currentShip: Ship | null;
  pendingShips: Ship[];
  completedShips: Ship[];
  siloStates: Record<string, SiloState>;
  visibleDemands: Demand[];
  pendingDemands: Demand[];
  completedDemands: CompletedDemand[];
  activeDeliveries: Delivery[];
  completedDeliveries: Delivery[];
  totalDemurrageCharge: number;
  totalDeliveryCost: number;
  totalReward: number;
  totalBonus: number;
  totalPenalty: number;
  unloadingUsed: number;
}

function shouldAppear(
  demand: Demand,
  turn: number,
  arrivingShipId: string | null,
  currentShip: Ship | null,
  completedShips: Ship[]
) {
  const condition = demand.appearCondition;
  if (condition.type === "start") return turn >= 1;
  if (condition.type === "turn") return turn >= condition.turn;
  if (condition.type === "ship_arrival") {
    return (
      arrivingShipId === condition.shipId ||
      currentShip?.id === condition.shipId ||
      completedShips.some((ship) => ship.id === condition.shipId)
    );
  }
  return false;
}

function applyDemandCompletion<T extends TurnState>(
  demand: Demand,
  completedAtTurn: number,
  state: T
) {
  const turnsRemaining = demand.deadline - completedAtTurn;
  const earlyBonus = turnsRemaining >= 2 ? Math.round(demand.reward * EARLY_BONUS_RATE) : 0;
  const penalty = completedAtTurn > demand.deadline
    ? (completedAtTurn - demand.deadline) * LATE_PENALTY_PER_TURN
    : 0;

  const completedDemand: CompletedDemand = {
    demand,
    completedAtTurn,
    earlyBonus,
    penalty,
  };

  return {
    ...state,
    completedDemands: [...state.completedDemands, completedDemand],
    totalReward: state.totalReward + demand.reward,
    totalBonus: state.totalBonus + earlyBonus,
    totalPenalty: state.totalPenalty + penalty,
  } as T;
}

function applyDeliveryArrival<T extends TurnState>(
  delivery: Delivery,
  state: T
) {
  const visibleDemands = state.visibleDemands.map((demand) => {
    if (demand.id !== delivery.demandId) return demand;
    if (demand.fulfilled) return demand;

    const remainingNeed = demand.amount - demand.fulfilledAmount;
    const deliveredAmount = Math.min(remainingNeed, delivery.amount);
    const fulfilledAmount = demand.fulfilledAmount + deliveredAmount;

    return {
      ...demand,
      fulfilledAmount,
      fulfilled: fulfilledAmount >= demand.amount,
    };
  });

  return {
    ...state,
    visibleDemands,
  } as T;
}

export function applyTurnStart<T extends TurnState>(state: T): T {
  let currentShip = state.currentShip;
  let pendingShips = [...state.pendingShips];
  let arrivingShipId: string | null = null;

  if (!currentShip && pendingShips.length > 0) {
    const nextShip = pendingShips[0];
    currentShip = { ...nextShip, berthingTurn: 0 };
    pendingShips = pendingShips.slice(1);
    arrivingShipId = nextShip.id;
  }

  if (currentShip) {
    currentShip = { ...currentShip, berthingTurn: currentShip.berthingTurn + 1 };
  }

  const visibleDemands = [...state.visibleDemands];
  const pendingDemands: Demand[] = [];
  let availableSlots = MAX_VISIBLE_DEMANDS - visibleDemands.length;

  for (const demand of state.pendingDemands) {
    if (
      availableSlots > 0 &&
      shouldAppear(demand, state.turn, arrivingShipId, currentShip, state.completedShips)
    ) {
      visibleDemands.push({ ...demand });
      availableSlots -= 1;
    } else {
      pendingDemands.push(demand);
    }
  }

  const activeDeliveries = state.activeDeliveries.map((delivery) => ({
    ...delivery,
    remainingTurns: delivery.remainingTurns - 1,
  }));

  const arrivedDeliveries = activeDeliveries.filter((d) => d.remainingTurns <= 0);
  const ongoingDeliveries = activeDeliveries.filter((d) => d.remainingTurns > 0);

  let nextState: T = {
    ...state,
    currentShip,
    pendingShips,
    visibleDemands,
    pendingDemands,
    activeDeliveries: ongoingDeliveries,
    completedDeliveries: [...state.completedDeliveries, ...arrivedDeliveries],
    unloadingUsed: 0,
  } as T;

  for (const delivery of arrivedDeliveries) {
    nextState = applyDeliveryArrival(delivery, nextState);
  }

  const completedDemands: Demand[] = [];
  const remainingDemands: Demand[] = [];
  for (const demand of nextState.visibleDemands) {
    if (demand.fulfilled) {
      completedDemands.push(demand);
    } else {
      remainingDemands.push(demand);
    }
  }

  nextState = { ...nextState, visibleDemands: remainingDemands } as T;

  for (const demand of completedDemands) {
    nextState = applyDemandCompletion(demand, state.turn, nextState);
  }

  return nextState;
}

export function applyTurnEnd<T extends TurnState>(state: T) {
  let currentShip = state.currentShip ? { ...state.currentShip } : null;
  let totalDemurrageCharge = state.totalDemurrageCharge;

  if (currentShip && currentShip.remainingCargo > 0) {
    totalDemurrageCharge += calculateDemurrageCharge(
      currentShip.berthingTurn,
      currentShip.freeTime
    );
  }

  let completedShips = state.completedShips;
  if (currentShip && currentShip.remainingCargo <= 0) {
    completedShips = [...state.completedShips, currentShip];
    currentShip = null;
  }

  const gameEnded =
    !currentShip &&
    state.pendingShips.length === 0 &&
    state.pendingDemands.length === 0 &&
    state.visibleDemands.length === 0 &&
    state.activeDeliveries.length === 0;

  return {
    state: {
      ...state,
      currentShip,
      completedShips,
      totalDemurrageCharge,
    } as T,
    gameEnded,
  };
}
