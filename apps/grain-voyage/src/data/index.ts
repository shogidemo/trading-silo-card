// Re-export shared data
export { silos, grains, traders } from "@trading-silo/shared";

// Game-specific data
export { ports, getSilosForPort, portsByRegion } from "./ports";
export { routes, getRoutesFromPort, getConnectedPorts, getRouteBetween } from "./routes";
