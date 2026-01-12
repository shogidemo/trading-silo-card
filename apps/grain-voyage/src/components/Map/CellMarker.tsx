"use client";

import { useMemo } from "react";
import { CircleMarker, Tooltip } from "react-leaflet";
import { RouteCell } from "@/data";

interface CellMarkerProps {
  cell: RouteCell;
  isReachable?: boolean;
  isCurrentPosition?: boolean;
  onSelect?: (cellId: string) => void;
}

export default function CellMarker({
  cell,
  isReachable = false,
  isCurrentPosition = false,
  onSelect,
}: CellMarkerProps) {
  // 港マスは別コンポーネント（PortMarker）で表示するのでスキップ
  if (cell.type === "port") return null;

  // マスの色
  const color = useMemo(() => {
    if (isCurrentPosition) return "#b8860b"; // gold
    if (isReachable) return "#0ea5e9"; // ocean-500
    return "#94a3b8"; // navy-400
  }, [isCurrentPosition, isReachable]);

  // マスのサイズ
  const radius = isCurrentPosition ? 8 : isReachable ? 6 : 4;

  return (
    <CircleMarker
      center={[cell.coordinates.lat, cell.coordinates.lng]}
      radius={radius}
      pathOptions={{
        fillColor: color,
        fillOpacity: isReachable ? 0.9 : 0.6,
        color: isCurrentPosition ? "#8b6914" : isReachable ? "#0369a1" : "#64748b",
        weight: isCurrentPosition ? 3 : isReachable ? 2 : 1,
      }}
      eventHandlers={{
        click: () => {
          if (isReachable && onSelect) {
            onSelect(cell.id);
          }
        },
      }}
    >
      {isReachable && (
        <Tooltip>
          <span className="text-sm">クリックして移動</span>
        </Tooltip>
      )}
    </CircleMarker>
  );
}
