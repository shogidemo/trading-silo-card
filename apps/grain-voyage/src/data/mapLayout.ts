export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 1500;
export const MAP_GRID_SIZE = 80;

export const MAP_LAT_RANGE = { min: 30, max: 46 };
export const MAP_LNG_RANGE = { min: 129, max: 146 };

export const LAND_SHAPES = [
  {
    id: "hokkaido",
    type: "rect" as const,
    x: 560,
    y: 60,
    width: 220,
    height: 180,
    rx: 70,
  },
  {
    id: "honshu",
    type: "rect" as const,
    x: 500,
    y: 260,
    width: 240,
    height: 700,
    rx: 110,
  },
  {
    id: "shikoku",
    type: "rect" as const,
    x: 470,
    y: 1060,
    width: 180,
    height: 120,
    rx: 60,
  },
  {
    id: "kyushu",
    type: "rect" as const,
    x: 220,
    y: 1140,
    width: 280,
    height: 260,
    rx: 90,
  },
];
