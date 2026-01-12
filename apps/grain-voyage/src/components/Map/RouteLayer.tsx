"use client";

import { useMemo } from "react";
import { Polyline, Tooltip } from "react-leaflet";
import { Route, Port } from "@/types";
import { RouteCell } from "@/data";

interface RouteLayerProps {
  route: Route;
  ports: Port[];
  cells?: RouteCell[];
  isHighlighted?: boolean;
}

export default function RouteLayer({
  route,
  ports,
  cells,
  isHighlighted = false,
}: RouteLayerProps) {
  const fromPort = ports.find((p) => p.id === route.from);
  const toPort = ports.find((p) => p.id === route.to);

  if (!fromPort || !toPort) return null;

  // マスの座標を使って曲線を描画（cellsがある場合）
  const positions: [number, number][] = useMemo(() => {
    if (cells && cells.length > 0) {
      // マスの順番でソート
      const sortedCells = [...cells].sort((a, b) => a.index - b.index);
      return sortedCells.map((c) => [c.coordinates.lat, c.coordinates.lng] as [number, number]);
    }
    // フォールバック: waypointsがあれば使用、なければ直線
    if (route.waypoints && route.waypoints.length > 0) {
      return [
        [fromPort.coordinates.lat, fromPort.coordinates.lng] as [number, number],
        ...route.waypoints.map((wp) => [wp.lat, wp.lng] as [number, number]),
        [toPort.coordinates.lat, toPort.coordinates.lng] as [number, number],
      ];
    }
    return [
      [fromPort.coordinates.lat, fromPort.coordinates.lng],
      [toPort.coordinates.lat, toPort.coordinates.lng],
    ];
  }, [cells, fromPort, toPort, route.waypoints]);

  // 航路の色（白い縁取りで視認性向上）
  const mainColor = isHighlighted ? "#0ea5e9" : "#1e40af"; // ocean-500 or blue-800
  const outlineColor = "#ffffff";

  const mainWeight = isHighlighted ? 4 : 3;
  const outlineWeight = mainWeight + 3;

  return (
    <>
      {/* 白い縁取り（下レイヤー） */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: outlineColor,
          weight: outlineWeight,
          opacity: 0.9,
          lineCap: "round",
          lineJoin: "round",
        }}
      />

      {/* メインの航路線（上レイヤー） */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: mainColor,
          weight: mainWeight,
          opacity: isHighlighted ? 1 : 0.8,
          lineCap: "round",
          lineJoin: "round",
        }}
      >
        <Tooltip sticky>
          <div className="text-center">
            <span className="text-sm text-gray-700">
              {fromPort.name.replace("港", "")} ↔ {toPort.name.replace("港", "")}
            </span>
          </div>
        </Tooltip>
      </Polyline>
    </>
  );
}
