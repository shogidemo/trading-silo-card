// Re-export shared data
export { silos, grains, traders } from "@trading-silo/shared";

// Game-specific data
export { ports, getSilosForPort, portsByRegion } from "./ports";
export { routes, getRoutesFromPort, getConnectedPorts, getRouteBetween } from "./routes";
export {
  routeCells,
  getCellsForRoute,
  getCellsAtPort,
  getNextCell,
  getReachableCells,
  getStartingCellId,
  type RouteCell,
} from "./cells";
export {
  portStocks,
  getPortStock,
  getGrainBuyPrice,
  getGrainSellPrice,
  type GrainStock,
  type PortStock,
} from "./portStock";
export {
  missionTemplates,
  generateMissions,
  getMissionsFromPort,
  getMissionsToPort,
  type Mission,
} from "./missions";
