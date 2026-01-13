"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import { ports, routes, routeCells, getCellsForRoute } from "@/data";
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

interface GameMapProps {
  // 旧API（互換性のため維持）
  selectedPortId?: string | null;
  shipPortId?: string | null;
  onPortSelect?: (id: string) => void;
  // 新API（マス制用）
  currentCellId?: string | null;
  reachableCellIds?: string[];
  onCellSelect?: (cellId: string) => void;
  showCells?: boolean;
  // ミッション関連
  missionFromPortId?: string | null;
  missionToPortId?: string | null;
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

const getPortStyle = (
  isSelected: boolean,
  hasShip: boolean,
  isReachable: boolean,
  isMissionFrom: boolean,
  isMissionTo: boolean
) => {
  if (hasShip) {
    return { stroke: "#b8860b", fill: "#fef3c7", glow: "url(#glow-gold)" };
  }
  if (isMissionTo) {
    return { stroke: "#dc2626", fill: "#fef2f2", glow: "url(#glow-red)" };
  }
  if (isMissionFrom) {
    return { stroke: "#16a34a", fill: "#f0fdf4", glow: "url(#glow-green)" };
  }
  if (isReachable) {
    return { stroke: "#0ea5e9", fill: "#e0f2fe", glow: "url(#glow-ocean)" };
  }
  if (isSelected) {
    return { stroke: "#0284c7", fill: "#ffffff", glow: "none" };
  }
  return { stroke: "#64748b", fill: "#ffffff", glow: "none" };
};

export default function GameMap({
  selectedPortId,
  shipPortId,
  onPortSelect,
  currentCellId,
  reachableCellIds = [],
  onCellSelect,
  showCells = false,
  missionFromPortId,
  missionToPortId,
}: GameMapProps) {
  const reachableSet = useMemo(
    () => new Set(reachableCellIds),
    [reachableCellIds]
  );

  const currentPortId = useMemo(() => {
    if (currentCellId) {
      const cell = routeCells.find((c) => c.id === currentCellId);
      if (cell?.type === "port") {
        return cell.portId;
      }
    }
    return shipPortId;
  }, [currentCellId, shipPortId]);

  const reachablePortIds = useMemo(() => {
    const portIds = new Set<string>();
    for (const cellId of reachableCellIds) {
      const cell = routeCells.find((c) => c.id === cellId);
      if (cell?.type === "port" && cell.portId) {
        portIds.add(cell.portId);
      }
    }
    return portIds;
  }, [reachableCellIds]);

  const handlePortClick = (portId: string) => {
    if (onCellSelect && showCells) {
      const cell = routeCells.find(
        (c) => c.type === "port" && c.portId === portId && reachableSet.has(c.id)
      );
      if (cell) {
        onCellSelect(cell.id);
      }
    } else if (onPortSelect) {
      onPortSelect(portId);
    }
  };

  const intermediateCells = useMemo(
    () => routeCells.filter((c) => c.type === "normal"),
    []
  );

  const highlightedRouteIds = useMemo(() => {
    if (showCells) return new Set<string>();
    if (!selectedPortId) return new Set<string>();
    const connected = routes.filter(
      (route) => route.from === selectedPortId || route.to === selectedPortId
    );
    return new Set(connected.map((route) => route.id));
  }, [selectedPortId, showCells]);

  const shipCell = currentCellId
    ? routeCells.find((c) => c.id === currentCellId)
    : null;

  // ズーム・パン状態
  const [zoom, setZoom] = useState(2);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // viewBox計算
  const viewBox = useMemo(() => {
    const width = MAP_WIDTH / zoom;
    const height = MAP_HEIGHT / zoom;
    const x = (MAP_WIDTH - width) / 2 - pan.x / zoom;
    const y = (MAP_HEIGHT - height) / 2 - pan.y / zoom;
    return `${x} ${y} ${width} ${height}`;
  }, [zoom, pan]);

  // ズームハンドラー
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

  // マウスホイールでズーム
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta)));
  }, []);

  // ドラッグでパン
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
      className="relative h-full w-full overflow-hidden rounded-2xl border border-ocean-200 bg-gradient-to-b from-sky-100 via-sky-50 to-ocean-100"
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
        aria-label="デフォルメされた日本の航路マップ"
      >
        <defs>
          <linearGradient id="seaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dff2ff" />
            <stop offset="60%" stopColor="#bde7ff" />
            <stop offset="100%" stopColor="#a6d6ff" />
          </linearGradient>
          <pattern
            id="mapGrid"
            width={MAP_GRID_SIZE}
            height={MAP_GRID_SIZE}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${MAP_GRID_SIZE} 0 L 0 0 0 ${MAP_GRID_SIZE}`}
              fill="none"
              stroke="rgba(14, 165, 233, 0.12)"
              strokeWidth="1"
            />
          </pattern>
          <filter id="glow-ocean" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38bdf8" />
          </filter>
          <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#fbbf24" />
          </filter>
          <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f87171" />
          </filter>
          <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#4ade80" />
          </filter>
        </defs>

        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#seaGradient)" />
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#mapGrid)" />

        {/* 日本地図背景 */}
        <image
          href="/japan-only.svg"
          x="140"
          y="40"
          width="560"
          height="750"
          opacity="0.85"
          preserveAspectRatio="xMidYMid meet"
        />

        <g>
          {routes.map((route) => {
            const cells = getCellsForRoute(route.id);
            const sortedCells = [...cells].sort((a, b) => a.index - b.index);
            const points = sortedCells
              .map((cell) => `${cell.coordinates.x},${cell.coordinates.y}`)
              .join(" ");
            const isHighlighted = showCells
              ? sortedCells.some((cell) => reachableSet.has(cell.id))
              : highlightedRouteIds.has(route.id);

            return (
              <g key={route.id}>
                <polyline
                  points={points}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={isHighlighted ? 10 : 8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.9}
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke={isHighlighted ? "#0ea5e9" : "#1e40af"}
                  strokeWidth={isHighlighted ? 6 : 4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={isHighlighted ? 1 : 0.8}
                />
              </g>
            );
          })}
        </g>

        {showCells && (
          <g>
            {intermediateCells.map((cell) => {
              const isReachable = reachableSet.has(cell.id);
              const isCurrent = cell.id === currentCellId;
              const baseRadius = isCurrent ? 9 : isReachable ? 8 : 5;
              const fill = isCurrent
                ? "#b8860b"
                : isReachable
                  ? "#0ea5e9"
                  : "#1e40af";
              const stroke = isCurrent
                ? "#8b6914"
                : isReachable
                  ? "#0369a1"
                  : "#1e3a8a";

              return (
                <circle
                  key={cell.id}
                  cx={cell.coordinates.x}
                  cy={cell.coordinates.y}
                  r={baseRadius / zoom}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={(isCurrent ? 3 : 2) / zoom}
                  opacity={isReachable ? 0.95 : 0.8}
                  onClick={() => {
                    if (isReachable && onCellSelect) {
                      onCellSelect(cell.id);
                    }
                  }}
                  style={{ cursor: isReachable ? "pointer" : "default" }}
                />
              );
            })}
          </g>
        )}

        {showCells && shipCell && shipCell.type === "normal" && (
          <g>
            <circle
              cx={shipCell.coordinates.x}
              cy={shipCell.coordinates.y}
              r={14 / zoom}
              fill="#fef3c7"
              stroke="#b8860b"
              strokeWidth={3 / zoom}
            />
            <text
              x={shipCell.coordinates.x}
              y={shipCell.coordinates.y + 6 / zoom}
              textAnchor="middle"
              fontSize={18 / zoom}
            >
              🚢
            </text>
          </g>
        )}

        <g>
          {ports.map((port) => {
            const position = getPortPosition(port.id);
            const isSelected = selectedPortId === port.id;
            const isReachable = reachablePortIds.has(port.id);
            const hasShip = currentPortId === port.id;
            const isMissionFrom = missionFromPortId === port.id;
            const isMissionTo = missionToPortId === port.id;
            const style = getPortStyle(
              isSelected,
              hasShip,
              isReachable,
              isMissionFrom,
              isMissionTo
            );
            const shortName = port.name.replace("港", "");

            return (
              <g
                key={port.id}
                onClick={() => handlePortClick(port.id)}
                style={{ cursor: isReachable || onPortSelect ? "pointer" : "default" }}
              >
                <title>
                  {`${port.name}${hasShip ? "（現在地）" : ""}${
                    isMissionFrom ? "（出発地）" : isMissionTo ? "（目的地）" : ""
                  }${isReachable ? "（到達可能）" : ""}`}
                </title>
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={20 / zoom}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth={3 / zoom}
                  filter={style.glow}
                />
                <text
                  x={position.x}
                  y={position.y + 6 / zoom}
                  textAnchor="middle"
                  fontSize={18 / zoom}
                >
                  {hasShip ? "🚢" : "⚓"}
                </text>
                {(isMissionFrom || isMissionTo) && !hasShip && (
                  <g>
                    <circle
                      cx={position.x + 14 / zoom}
                      cy={position.y - 16 / zoom}
                      r={8 / zoom}
                      fill={isMissionTo ? "#dc2626" : "#16a34a"}
                    />
                    <text
                      x={position.x + 14 / zoom}
                      y={position.y - 12 / zoom}
                      textAnchor="middle"
                      fontSize={10 / zoom}
                      fill="#ffffff"
                    >
                      {isMissionTo ? "🎯" : "📦"}
                    </text>
                  </g>
                )}
                <text
                  x={position.x}
                  y={position.y + 32 / zoom}
                  textAnchor="middle"
                  className="font-display"
                  fontSize={14 / zoom}
                  fill={
                    isMissionTo
                      ? "#dc2626"
                      : isMissionFrom
                        ? "#16a34a"
                        : hasShip
                          ? "#b8860b"
                          : "#1e293b"
                  }
                >
                  {shortName}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* ズームコントロール */}
      <div className="absolute left-4 top-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          disabled={zoom >= MAX_ZOOM}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 text-xl font-bold text-navy-700 shadow-lg transition hover:bg-white disabled:opacity-50"
          aria-label="拡大"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          disabled={zoom <= MIN_ZOOM}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 text-xl font-bold text-navy-700 shadow-lg transition hover:bg-white disabled:opacity-50"
          aria-label="縮小"
        >
          -
        </button>
        <button
          onClick={handleZoomReset}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 text-sm text-navy-700 shadow-lg transition hover:bg-white"
          aria-label="リセット"
        >
          ⟲
        </button>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 text-xs text-navy-700 shadow-lg">
        <span>🧭 デフォルメ航路図</span>
        <span className="hidden sm:inline">{Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}
