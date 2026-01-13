"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { silos } from "@/data";
import { useCollection } from "@/context/CollectionContext";
import { useReducedMotion } from "@/hooks";
import { SiloCard } from "@/types";
import SiloPopup from "./SiloPopup";

interface SiloMapProps {
  selectedSiloId?: string | null;
  onSiloSelect?: (id: string) => void;
}

type GridPosition = { x: number; y: number };

const MAP_LAYOUT = [
  "........................",
  "..................###...",
  ".................#####..",
  ".................####...",
  "...............###......",
  "..............####......",
  ".............#####......",
  "............######......",
  "...........#######......",
  "..........#######.......",
  ".........######.........",
  "........#####...........",
  ".......#####............",
  "......#####..##.........",
  ".....####..##...........",
  "....####................",
  "...###..................",
  "........................",
];

const MAP_ROWS = MAP_LAYOUT.length;
const MAP_COLS = MAP_LAYOUT[0].length;

const MAP_BOUNDS = {
  minLat: 30,
  maxLat: 45,
  minLng: 128,
  maxLng: 146,
};

const DIRECTIONS: Array<[number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const toKey = (pos: GridPosition) => `${pos.x},${pos.y}`;

const inBounds = (x: number, y: number) =>
  y >= 0 && y < MAP_ROWS && x >= 0 && x < MAP_COLS;

const isLand = (x: number, y: number) =>
  MAP_LAYOUT[y]?.[x] === "#";

const isSea = (x: number, y: number) => MAP_LAYOUT[y]?.[x] === ".";

const isCoastalSea = (x: number, y: number) =>
  isSea(x, y) &&
  DIRECTIONS.some(([dx, dy]) => inBounds(x + dx, y + dy) && isLand(x + dx, y + dy));

const latLngToGrid = (lat: number, lng: number): GridPosition => {
  const x = Math.round(
    ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) *
      (MAP_COLS - 1)
  );
  const y = Math.round(
    ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) *
      (MAP_ROWS - 1)
  );
  return {
    x: clamp(x, 0, MAP_COLS - 1),
    y: clamp(y, 0, MAP_ROWS - 1),
  };
};

const findNearestCoastalSea = (start: GridPosition): GridPosition => {
  const queue: GridPosition[] = [start];
  const visited = new Set<string>([toKey(start)]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (isCoastalSea(current.x, current.y)) {
      return current;
    }

    for (const [dx, dy] of DIRECTIONS) {
      const next = { x: current.x + dx, y: current.y + dy };
      if (!inBounds(next.x, next.y)) continue;
      const key = toKey(next);
      if (visited.has(key)) continue;
      visited.add(key);
      queue.push(next);
    }
  }

  if (isSea(start.x, start.y)) {
    return start;
  }

  return { x: 0, y: 0 };
};

const findSeaPath = (start: GridPosition, goal: GridPosition): GridPosition[] => {
  if (start.x === goal.x && start.y === goal.y) {
    return [start];
  }

  const queue: GridPosition[] = [start];
  const visited = new Set<string>([toKey(start)]);
  const cameFrom = new Map<string, GridPosition>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.x === goal.x && current.y === goal.y) {
      break;
    }

    for (const [dx, dy] of DIRECTIONS) {
      const next = { x: current.x + dx, y: current.y + dy };
      if (!inBounds(next.x, next.y) || !isSea(next.x, next.y)) continue;
      const key = toKey(next);
      if (visited.has(key)) continue;
      visited.add(key);
      cameFrom.set(key, current);
      queue.push(next);
    }
  }

  if (!visited.has(toKey(goal))) {
    return [start];
  }

  const path: GridPosition[] = [];
  let current: GridPosition | undefined = goal;
  while (current) {
    path.push(current);
    const prev = cameFrom.get(toKey(current));
    if (!prev) break;
    current = prev;
  }

  return path.reverse();
};

const MARKER_OFFSETS = [
  { x: -28, y: -28 },
  { x: 28, y: -28 },
  { x: -28, y: 28 },
  { x: 28, y: 28 },
  { x: 0, y: 0 },
];

const REGION_LABELS = [
  { id: "hokkaido", label: "北海道", x: 19, y: 2 },
  { id: "tohoku", label: "東北", x: 16, y: 6 },
  { id: "honshu", label: "本州", x: 14, y: 10 },
  { id: "shikoku", label: "四国", x: 15, y: 13 },
  { id: "kyushu", label: "九州", x: 6, y: 15 },
];

type PortAssignment = { position: GridPosition; slot: number };

const buildPortAssignments = (cards: SiloCard[]): Record<string, PortAssignment> => {
  const occupancy = new Map<string, number>();
  return cards.reduce<Record<string, PortAssignment>>((acc, silo) => {
    const mapped = latLngToGrid(silo.coordinates.lat, silo.coordinates.lng);
    const port = findNearestCoastalSea(mapped);
    const key = toKey(port);
    const slot = occupancy.get(key) ?? 0;
    occupancy.set(key, slot + 1);
    acc[silo.id] = { position: port, slot };
    return acc;
  }, {});
};

export default function SiloMap({ selectedSiloId, onSiloSelect }: SiloMapProps) {
  const router = useRouter();
  const { hasCard } = useCollection();
  const prefersReducedMotion = useReducedMotion();
  const portAssignments = useMemo(() => buildPortAssignments(silos), []);
  const defaultPort = portAssignments[silos[0]?.id]?.position ?? { x: 0, y: 0 };
  const [shipPosition, setShipPosition] = useState<GridPosition>(defaultPort);
  const [shipPath, setShipPath] = useState<GridPosition[]>([]);
  const [isSailing, setIsSailing] = useState(false);
  const shipPositionRef = useRef(shipPosition);

  useEffect(() => {
    shipPositionRef.current = shipPosition;
  }, [shipPosition]);

  const selectedSilo = selectedSiloId
    ? silos.find((silo) => silo.id === selectedSiloId)
    : undefined;

  useEffect(() => {
    if (!selectedSiloId) return;
    const target = portAssignments[selectedSiloId]?.position;
    if (!target) return;
    const start = shipPositionRef.current;
    if (start.x === target.x && start.y === target.y) return;
    const path = findSeaPath(start, target);
    setShipPath(path);
  }, [selectedSiloId, portAssignments]);

  useEffect(() => {
    if (shipPath.length <= 1) {
      setIsSailing(false);
      return;
    }

    if (prefersReducedMotion) {
      const last = shipPath[shipPath.length - 1];
      if (last) {
        setShipPosition(last);
      }
      setIsSailing(false);
      return;
    }

    let stepIndex = 0;
    setIsSailing(true);

    const timer = window.setInterval(() => {
      stepIndex += 1;
      const next = shipPath[stepIndex];
      if (!next) {
        window.clearInterval(timer);
        setIsSailing(false);
        return;
      }
      setShipPosition(next);
      if (stepIndex >= shipPath.length - 1) {
        window.clearInterval(timer);
        setIsSailing(false);
      }
    }, 260);

    return () => window.clearInterval(timer);
  }, [shipPath, prefersReducedMotion]);

  const routeSet = useMemo(
    () => new Set(shipPath.map((pos) => toKey(pos))),
    [shipPath]
  );

  const gridCells = useMemo(() => {
    const cells: Array<{
      key: string;
      x: number;
      y: number;
      isLand: boolean;
      isSea: boolean;
      isCoastalSea: boolean;
    }> = [];
    for (let y = 0; y < MAP_ROWS; y += 1) {
      for (let x = 0; x < MAP_COLS; x += 1) {
        const key = `${x},${y}`;
        const land = isLand(x, y);
        cells.push({
          key,
          x,
          y,
          isLand: land,
          isSea: !land,
          isCoastalSea: !land && isCoastalSea(x, y),
        });
      }
    }
    return cells;
  }, []);

  return (
    <div
      className="relative w-full h-full"
      data-testid="deformed-map"
      data-map-cols={MAP_COLS}
      data-map-rows={MAP_ROWS}
    >
      <div
        className="absolute inset-0 map-board grid"
        style={{
          gridTemplateColumns: `repeat(${MAP_COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${MAP_ROWS}, minmax(0, 1fr))`,
        }}
        role="img"
        aria-label="桃鉄風のデフォルメ地図。海上のマスだけを通って船が移動します。"
      >
        {gridCells.map((cell) => {
          const isRoute = routeSet.has(cell.key);
          return (
            <div
              key={cell.key}
              className={[
                "map-cell",
                cell.isLand ? "map-cell-land" : "map-cell-sea",
                cell.isCoastalSea ? "map-cell-coast" : "",
                isRoute ? "map-cell-route" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              data-cell-type={cell.isLand ? "land" : "sea"}
              data-x={cell.x}
              data-y={cell.y}
            />
          );
        })}
      </div>

      <div
        className="absolute inset-0 grid pointer-events-none"
        style={{
          gridTemplateColumns: `repeat(${MAP_COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${MAP_ROWS}, minmax(0, 1fr))`,
        }}
        aria-hidden="true"
      >
        {REGION_LABELS.map((region) => (
          <div
            key={region.id}
            className="map-label"
            style={{
              gridColumnStart: region.x + 1,
              gridRowStart: region.y + 1,
            }}
          >
            {region.label}
          </div>
        ))}
      </div>

      <div
        className="absolute inset-0 grid pointer-events-none"
        style={{
          gridTemplateColumns: `repeat(${MAP_COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${MAP_ROWS}, minmax(0, 1fr))`,
        }}
      >
        {silos.map((silo) => {
          const assignment = portAssignments[silo.id];
          if (!assignment) return null;
          const isCollected = hasCard(silo.id);
          const isSelected = selectedSiloId === silo.id;
          const offset = MARKER_OFFSETS[assignment.slot % MARKER_OFFSETS.length];

          return (
            <button
              key={silo.id}
              type="button"
              onClick={() => {
                if (isCollected) {
                  onSiloSelect?.(silo.id);
                  return;
                }
                router.push(`/quiz?cardId=${silo.id}`);
              }}
              className="map-marker pointer-events-auto"
              style={{
                gridColumnStart: assignment.position.x + 1,
                gridRowStart: assignment.position.y + 1,
                transform: `translate(${offset.x}%, ${offset.y}%)`,
              }}
              data-testid="silo-marker"
              data-silo-id={silo.id}
              data-collected={isCollected ? "true" : "false"}
              aria-label={
                isCollected
                  ? `${silo.name}を選択`
                  : `${silo.name}のクイズに挑戦する`
              }
            >
              <span
                className={[
                  isCollected ? "silo-marker-collected" : "silo-marker-uncollected",
                  isSelected ? "map-marker-selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isCollected ? (
                  <Image
                    src={silo.imageUrl}
                    alt={silo.name}
                    fill
                    sizes="40px"
                    className="silo-marker-image"
                  />
                ) : (
                  <span className="map-marker-question">?</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="absolute inset-0 grid pointer-events-none"
        style={{
          gridTemplateColumns: `repeat(${MAP_COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${MAP_ROWS}, minmax(0, 1fr))`,
        }}
      >
        <motion.div
          layout
          className="map-ship"
          style={{
            gridColumnStart: shipPosition.x + 1,
            gridRowStart: shipPosition.y + 1,
          }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
          data-testid="map-ship"
          data-grid-x={shipPosition.x}
          data-grid-y={shipPosition.y}
          data-sailing={isSailing ? "true" : "false"}
          aria-hidden="true"
        >
          🚢
        </motion.div>
      </div>

      {selectedSilo && hasCard(selectedSilo.id) && (
        <div className="absolute bottom-4 right-4 max-w-xs pointer-events-none">
          <div className="map-info-card pointer-events-auto">
            <SiloPopup silo={selectedSilo} />
          </div>
        </div>
      )}
    </div>
  );
}
