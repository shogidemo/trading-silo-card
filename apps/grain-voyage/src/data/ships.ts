import { Ship } from "@/types";

export const ships: Ship[] = [
  {
    id: "ship-1",
    grainId: "grain-corn",
    grainName: "トウモロコシ",
    totalCargo: 50000,
    remainingCargo: 50000,
    portId: "port-kashima",
    freeTime: 5,
    berthingTurn: 0,
  },
  {
    id: "ship-2",
    grainId: "grain-soybean",
    grainName: "大豆",
    totalCargo: 30000,
    remainingCargo: 30000,
    portId: "port-shibushi",
    freeTime: 5,
    berthingTurn: 0,
  },
];
