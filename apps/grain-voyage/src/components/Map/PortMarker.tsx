"use client";

import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import { Port } from "@/types";

interface PortMarkerProps {
  port: Port;
  isSelected?: boolean;
  hasShip?: boolean;
  onSelect?: (id: string) => void;
}

// カスタムマーカーアイコンを作成（Leafletを遅延読み込み）
function createPortIcon(isSelected: boolean, hasShip: boolean) {
  // SSR時はnullを返す（クライアントでのみ実行）
  if (typeof window === "undefined") return null;

  // Leafletを動的に読み込み
  const L = require("leaflet");

  const size = isSelected ? 40 : 32;
  const borderColor = hasShip ? "#b8860b" : isSelected ? "#0284c7" : "#64748b";
  const bgColor = hasShip ? "#fef3c7" : "#ffffff";

  return L.divIcon({
    className: "custom-port-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${bgColor};
        border: 3px solid ${borderColor};
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        transition: transform 0.2s ease;
        font-size: ${isSelected ? "18px" : "14px"};
        ${isSelected ? "transform: scale(1.1);" : ""}
      ">
        ${hasShip ? "🚢" : "⚓"}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

export default function PortMarker({
  port,
  isSelected = false,
  hasShip = false,
  onSelect,
}: PortMarkerProps) {
  const icon = useMemo(
    () => createPortIcon(isSelected, hasShip),
    [isSelected, hasShip]
  );

  // SSR時やアイコンがない場合はレンダリングしない
  if (!icon) return null;

  return (
    <Marker
      position={[port.coordinates.lat, port.coordinates.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect?.(port.id),
      }}
    >
      <Popup>
        <div className="text-center min-w-[150px]">
          <h3 className="font-bold text-navy-900 mb-1">{port.name}</h3>
          <p className="text-xs text-navy-600 mb-2">
            受入能力: {port.capacity.toLocaleString()}トン/ターン
          </p>
          <div className="flex flex-wrap gap-1 justify-center">
            {port.acceptableGrains.slice(0, 3).map((grain) => (
              <span
                key={grain}
                className="px-1.5 py-0.5 bg-gold-100 text-gold-800 text-xs rounded"
              >
                {grain}
              </span>
            ))}
            {port.acceptableGrains.length > 3 && (
              <span className="px-1.5 py-0.5 bg-navy-100 text-navy-600 text-xs rounded">
                +{port.acceptableGrains.length - 3}
              </span>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
