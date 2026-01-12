"use client";

import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, useMap, CircleMarker, Tooltip } from "react-leaflet";
import { ports, routes, routeCells, getCellsForRoute, RouteCell } from "@/data";
import PortMarker from "./PortMarker";
import RouteLayer from "./RouteLayer";

// 定数
const INITIAL_CENTER: [number, number] = [36.5, 136.0];
const INITIAL_ZOOM = 5;

// タイルURL・帰属表示
const OSM_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

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

function FlyToCell({ cellId }: { cellId: string | null | undefined }) {
  const map = useMap();

  useEffect(() => {
    if (cellId) {
      const cell = routeCells.find((c) => c.id === cellId);
      if (cell) {
        map.flyTo([cell.coordinates.lat, cell.coordinates.lng], 8, {
          duration: 0.8,
        });
      }
    }
  }, [cellId, map]);

  return null;
}

function FlyToPort({ portId }: { portId: string | null | undefined }) {
  const map = useMap();

  useEffect(() => {
    if (portId) {
      const port = ports.find((p) => p.id === portId);
      if (port) {
        map.flyTo([port.coordinates.lat, port.coordinates.lng], 8, {
          duration: 1,
        });
      }
    }
  }, [portId, map]);

  return null;
}

function MapControls() {
  const map = useMap();

  const handleResetView = () => {
    map.flyTo(INITIAL_CENTER, INITIAL_ZOOM, { duration: 1 });
  };

  return (
    <div className="leaflet-top leaflet-left" style={{ marginTop: "10px" }}>
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={handleResetView}
          className="w-[30px] h-[30px] bg-white border-none flex items-center justify-center text-lg cursor-pointer hover:bg-gray-100"
          title="日本全体を表示"
          aria-label="日本全体を表示"
        >
          🗾
        </button>
      </div>
    </div>
  );
}

// 中間マスの表示コンポーネント
function CellMarkers({
  currentCellId,
  reachableCellIds,
  onCellSelect,
}: {
  currentCellId?: string | null;
  reachableCellIds?: string[];
  onCellSelect?: (cellId: string) => void;
}) {
  const reachableSet = useMemo(
    () => new Set(reachableCellIds || []),
    [reachableCellIds]
  );

  // 中間マスのみ表示（港マスは PortMarker で表示）
  const intermediateCells = useMemo(
    () => routeCells.filter((c) => c.type === "normal"),
    []
  );

  return (
    <>
      {intermediateCells.map((cell) => {
        const isReachable = reachableSet.has(cell.id);
        const isCurrent = cell.id === currentCellId;

        // マスのサイズと色（視認性向上）
        const radius = isCurrent ? 10 : isReachable ? 9 : 6;
        const fillColor = isCurrent
          ? "#b8860b"
          : isReachable
            ? "#0ea5e9"
            : "#1e40af";  // 濃い青で視認性向上
        const fillOpacity = isCurrent ? 1 : isReachable ? 0.9 : 0.8;

        return (
          <React.Fragment key={cell.id}>
            {/* 白い縁取り（下レイヤー） */}
            <CircleMarker
              center={[cell.coordinates.lat, cell.coordinates.lng]}
              radius={radius + 2}
              pathOptions={{
                fillColor: "#ffffff",
                fillOpacity: 1,
                color: "#ffffff",
                weight: 0,
              }}
            />
            {/* メインのマーカー（上レイヤー） */}
            <CircleMarker
              center={[cell.coordinates.lat, cell.coordinates.lng]}
              radius={radius}
              pathOptions={{
                fillColor,
                fillOpacity,
                color: isCurrent ? "#8b6914" : isReachable ? "#0369a1" : "#1e3a8a",
                weight: isCurrent ? 3 : 2,
              }}
              eventHandlers={{
                click: () => {
                  if (isReachable && onCellSelect) {
                    onCellSelect(cell.id);
                  }
                },
              }}
            >
              {isReachable && (
                <Tooltip>
                  <span className="text-sm font-medium">ここに移動</span>
                </Tooltip>
              )}
            </CircleMarker>
          </React.Fragment>
        );
      })}
    </>
  );
}

// 船の現在位置マーカー
function ShipMarker({ cellId }: { cellId: string }) {
  const cell = routeCells.find((c) => c.id === cellId);
  if (!cell) return null;

  // 港マスの場合は PortMarker の hasShip で表示
  if (cell.type === "port") return null;

  return (
    <CircleMarker
      center={[cell.coordinates.lat, cell.coordinates.lng]}
      radius={12}
      pathOptions={{
        fillColor: "#b8860b",
        fillOpacity: 1,
        color: "#8b6914",
        weight: 3,
      }}
    >
      <Tooltip permanent direction="top" offset={[0, -10]}>
        <span className="text-lg">🚢</span>
      </Tooltip>
    </CircleMarker>
  );
}

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
  // 現在のマスから港IDを取得（PortMarker用）
  const currentPortId = useMemo(() => {
    if (currentCellId) {
      const cell = routeCells.find((c) => c.id === currentCellId);
      if (cell?.type === "port") {
        return cell.portId;
      }
    }
    return shipPortId;
  }, [currentCellId, shipPortId]);

  // 到達可能なマスのセット
  const reachableSet = useMemo(
    () => new Set(reachableCellIds),
    [reachableCellIds]
  );

  // 到達可能な港IDのセット
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

  // 港がクリックされた時の処理
  const handlePortClick = (portId: string) => {
    if (onCellSelect && showCells) {
      // マス制の場合、港に対応するマスIDを見つけて選択
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

  return (
    <MapContainer
      center={INITIAL_CENTER}
      zoom={INITIAL_ZOOM}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer url={OSM_URL} attribution={OSM_ATTRIBUTION} />
      <MapControls />

      {/* カメラ移動 */}
      {showCells ? (
        <FlyToCell cellId={currentCellId} />
      ) : (
        <FlyToPort portId={selectedPortId} />
      )}

      {/* 航路を描画（マスに沿った曲線で） */}
      {routes.map((route) => {
        const cells = getCellsForRoute(route.id);
        const isHighlighted = cells.some((c) => reachableSet.has(c.id));

        return (
          <RouteLayer
            key={route.id}
            route={route}
            ports={ports}
            cells={cells}
            isHighlighted={isHighlighted}
          />
        );
      })}

      {/* 中間マスを表示 */}
      {showCells && (
        <CellMarkers
          currentCellId={currentCellId}
          reachableCellIds={reachableCellIds}
          onCellSelect={onCellSelect}
        />
      )}

      {/* 船の位置（中間マスにいる場合） */}
      {showCells && currentCellId && <ShipMarker cellId={currentCellId} />}

      {/* 港マーカーを描画 */}
      {ports.map((port) => {
        const isReachable = reachablePortIds.has(port.id);
        const isMissionFrom = missionFromPortId === port.id;
        const isMissionTo = missionToPortId === port.id;

        return (
          <PortMarker
            key={port.id}
            port={port}
            isSelected={selectedPortId === port.id}
            hasShip={currentPortId === port.id}
            isReachable={isReachable}
            isMissionFrom={isMissionFrom}
            isMissionTo={isMissionTo}
            onSelect={handlePortClick}
          />
        );
      })}
    </MapContainer>
  );
}
