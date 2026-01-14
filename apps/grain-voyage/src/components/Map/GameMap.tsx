"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import { ports, routes, getCellsForRoute } from "@/data";
import {
  MAP_GRID_SIZE,
  MAP_HEIGHT,
  MAP_LAT_RANGE,
  MAP_LNG_RANGE,
  MAP_WIDTH,
} from "@/data/mapLayout";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 10;
const ZOOM_STEP = 0.25;

const COLORS = {
  navy: "#1a237e",
  navyLight: "#3949ab",
  gold: "#ffc107",
  goldDark: "#c79100",
  vermillion: "#d32f2f",
  seagreen: "#00897b",
  seagreenLight: "#b2dfdb",
  cream: "#fff8e1",
  skyLight: "#e3f2fd",
  gridLine: "#bbdefb",
  white: "#ffffff",
};

interface GameMapProps {
  selectedPortId?: string | null;
  shipPortId?: string | null;
  onPortSelect?: (id: string) => void;
  demandPortIds?: string[];
}

const projectToMap = (coordinates: { lat: number; lng: number }) => {
  const x =
    ((coordinates.lng - MAP_LNG_RANGE.min) /
      (MAP_LNG_RANGE.max - MAP_LNG_RANGE.min)) *
    MAP_WIDTH;
  const y =
    (1 -
      (coordinates.lat - MAP_LAT_RANGE.min) /
        (MAP_LAT_RANGE.max - MAP_LAT_RANGE.min)) *
    MAP_HEIGHT;

  return { x, y };
};

const getPortPosition = (portId: string) => {
  const port = ports.find((p) => p.id === portId);
  if (!port) return { x: 0, y: 0 };
  return port.mapPosition ?? projectToMap(port.coordinates);
};

const getPortStyle = (isSelected: boolean, hasShip: boolean, hasDemand: boolean) => {
  if (hasShip) {
    return { stroke: COLORS.goldDark, fill: COLORS.gold };
  }
  if (hasDemand) {
    return { stroke: COLORS.vermillion, fill: "#ffcdd2" };
  }
  if (isSelected) {
    return { stroke: COLORS.navyLight, fill: COLORS.white };
  }
  return { stroke: COLORS.navy, fill: COLORS.white };
};

export default function GameMap({
  selectedPortId,
  shipPortId,
  onPortSelect,
  demandPortIds = [],
}: GameMapProps) {
  const demandSet = useMemo(() => new Set(demandPortIds), [demandPortIds]);

  const highlightedRouteIds = useMemo(() => {
    if (!selectedPortId) return new Set<string>();
    const connected = routes.filter(
      (route) => route.from === selectedPortId || route.to === selectedPortId
    );
    return new Set(connected.map((route) => route.id));
  }, [selectedPortId]);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const viewBox = useMemo(() => {
    const width = MAP_WIDTH / zoom;
    const height = MAP_HEIGHT / zoom;
    const x = (MAP_WIDTH - width) / 2 - pan.x / zoom;
    const y = (MAP_HEIGHT - height) / 2 - pan.y / zoom;
    return `${x} ${y} ${width} ${height}`;
  }, [zoom, pan]);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + delta));

    if (newZoom !== zoom) {
      const zoomRatio = newZoom / zoom;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseOffsetX = e.clientX - rect.left - centerX;
      const mouseOffsetY = e.clientY - rect.top - centerY;

      setPan((prev) => ({
        x: prev.x * zoomRatio + mouseOffsetX * (1 - zoomRatio),
        y: prev.y * zoomRatio + mouseOffsetY * (1 - zoomRatio),
      }));
      setZoom(newZoom);
    }
  }, [zoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="game-panel relative h-full w-full overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="日本の港と需要地点を示したマップ"
      >
        <defs>
          <pattern
            id="mapGrid"
            width={MAP_GRID_SIZE}
            height={MAP_GRID_SIZE}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${MAP_GRID_SIZE} 0 L 0 0 0 ${MAP_GRID_SIZE}`}
              fill="none"
              stroke={COLORS.gridLine}
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill={COLORS.skyLight} />
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#mapGrid)" />

        <image
          href="/japan-only.svg"
          x="140"
          y="40"
          width="560"
          height="750"
          opacity="0.8"
          preserveAspectRatio="xMidYMid meet"
        />

        <g>
          {routes.map((route) => {
            const cells = getCellsForRoute(route.id);
            const sortedCells = [...cells].sort((a, b) => a.index - b.index);
            const points = sortedCells
              .map((cell) => `${cell.coordinates.x},${cell.coordinates.y}`)
              .join(" ");
            const isHighlighted = highlightedRouteIds.has(route.id);

            return (
              <g key={route.id}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={COLORS.white}
                  strokeWidth={(isHighlighted ? 10 : 8) / zoom}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke={isHighlighted ? COLORS.seagreen : COLORS.navy}
                  strokeWidth={(isHighlighted ? 6 : 4) / zoom}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}
        </g>

        <g>
          {ports.map((port) => {
            const position = getPortPosition(port.id);
            const isSelected = selectedPortId === port.id;
            const hasShip = shipPortId === port.id;
            const hasDemand = demandSet.has(port.id);
            const style = getPortStyle(isSelected, hasShip, hasDemand);
            const shortName = port.name.replace("港", "");

            return (
              <g
                key={port.id}
                onClick={() => onPortSelect?.(port.id)}
                style={{ cursor: onPortSelect ? "pointer" : "default" }}
              >
                <title>
                  {`${port.name}${hasShip ? "（荷役中）" : ""}${hasDemand ? "（需要あり）" : ""}`}
                </title>
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={24 / zoom}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth={4 / zoom}
                />
                <text
                  x={position.x}
                  y={position.y + 5 / zoom}
                  textAnchor="middle"
                  fontSize={(shortName.length >= 3 ? 11 : 14) / zoom}
                  fontWeight="bold"
                  fill={style.stroke}
                >
                  {shortName}
                </text>
                {hasShip && (
                  <g transform={`translate(${position.x + 20 / zoom}, ${position.y - 20 / zoom}) scale(${1 / zoom})`}>
                    <circle
                      cx={0}
                      cy={0}
                      r={14}
                      fill={COLORS.gold}
                      stroke={COLORS.goldDark}
                      strokeWidth={2}
                    />
                    <path
                      d="M-6 2 L6 2 L4 -2 L-4 -2 Z M-2 -2 L-2 -5 L0 -7 L2 -5 L2 -2"
                      fill={COLORS.navy}
                      stroke={COLORS.navy}
                      strokeWidth={1}
                      strokeLinejoin="round"
                    />
                  </g>
                )}
                {hasDemand && !hasShip && (
                  <g>
                    <circle
                      cx={position.x + 16 / zoom}
                      cy={position.y - 16 / zoom}
                      r={10 / zoom}
                      fill={COLORS.vermillion}
                      stroke={COLORS.white}
                      strokeWidth={2 / zoom}
                    />
                    <text
                      x={position.x + 16 / zoom}
                      y={position.y - 12 / zoom}
                      textAnchor="middle"
                      fontSize={10 / zoom}
                      fontWeight="bold"
                      fill={COLORS.white}
                    >
                      !
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      <div className="absolute left-3 top-3 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          disabled={zoom >= MAX_ZOOM}
          className="btn-game btn-game-secondary flex h-10 w-10 items-center justify-center p-0 text-game-heading"
          aria-label="拡大"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          disabled={zoom <= MIN_ZOOM}
          className="btn-game btn-game-secondary flex h-10 w-10 items-center justify-center p-0 text-game-heading"
          aria-label="縮小"
        >
          -
        </button>
        <button
          onClick={handleZoomReset}
          className="btn-game btn-game-secondary flex h-10 w-10 items-center justify-center p-0 text-game-small"
          aria-label="リセット"
        >
          R
        </button>
      </div>

      <div className="badge-game badge-game-gold absolute bottom-3 left-3">
        <span className="text-game-small font-bold">{Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}
