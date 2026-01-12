"use client";

import { Polyline, Tooltip } from "react-leaflet";
import { Route, Port } from "@/types";

interface RouteLayerProps {
  route: Route;
  ports: Port[];
  isHighlighted?: boolean;
}

export default function RouteLayer({
  route,
  ports,
  isHighlighted = false,
}: RouteLayerProps) {
  const fromPort = ports.find((p) => p.id === route.from);
  const toPort = ports.find((p) => p.id === route.to);

  if (!fromPort || !toPort) return null;

  const positions: [number, number][] = [
    [fromPort.coordinates.lat, fromPort.coordinates.lng],
    [toPort.coordinates.lat, toPort.coordinates.lng],
  ];

  // 航路タイプと状態によって色を変える
  const color = isHighlighted
    ? "#0ea5e9" // ocean-500
    : route.type === "main"
      ? "#64748b" // navy-500
      : "#94a3b8"; // navy-400

  const weight = isHighlighted ? 4 : route.type === "main" ? 3 : 2;
  const dashArray = route.type === "branch" ? "8, 4" : undefined;

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color,
        weight,
        opacity: isHighlighted ? 1 : 0.7,
        dashArray,
      }}
    >
      <Tooltip sticky>
        <div className="text-center">
          <span className="font-medium">{route.distance}マス</span>
          <br />
          <span className="text-xs text-gray-500">
            {fromPort.name} ↔ {toPort.name}
          </span>
        </div>
      </Tooltip>
    </Polyline>
  );
}
