"use client";

import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import { Port } from "@/types";

interface PortMarkerProps {
  port: Port;
  isSelected?: boolean;
  hasShip?: boolean;
  isReachable?: boolean;
  onSelect?: (id: string) => void;
}

// カスタムマーカーアイコンを作成（Leafletを遅延読み込み）
function createPortIcon(
  isSelected: boolean,
  hasShip: boolean,
  isReachable: boolean
) {
  // SSR時はnullを返す（クライアントでのみ実行）
  if (typeof window === "undefined") return null;

  // Leafletを動的に読み込み
  const L = require("leaflet");

  const size = isSelected || isReachable ? 44 : 36;

  // 色の決定
  let borderColor: string;
  let bgColor: string;
  let glowEffect = "";

  if (hasShip) {
    borderColor = "#b8860b"; // gold
    bgColor = "#fef3c7";
    glowEffect = "box-shadow: 0 0 12px rgba(184, 134, 11, 0.5);";
  } else if (isReachable) {
    borderColor = "#0ea5e9"; // ocean-500
    bgColor = "#e0f2fe"; // ocean-100
    glowEffect = "box-shadow: 0 0 16px rgba(14, 165, 233, 0.6); animation: pulse 1.5s ease-in-out infinite;";
  } else if (isSelected) {
    borderColor = "#0284c7"; // ocean-600
    bgColor = "#ffffff";
  } else {
    borderColor = "#64748b"; // navy-500
    bgColor = "#ffffff";
  }

  return L.divIcon({
    className: "custom-port-marker",
    html: `
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      </style>
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${bgColor};
        border: 3px solid ${borderColor};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size > 40 ? "18px" : "14px"};
        cursor: ${isReachable ? "pointer" : "default"};
        ${glowEffect}
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
  isReachable = false,
  onSelect,
}: PortMarkerProps) {
  const icon = useMemo(
    () => createPortIcon(isSelected, hasShip, isReachable),
    [isSelected, hasShip, isReachable]
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
          {isReachable && (
            <p className="text-xs text-ocean-600 font-medium mb-1">
              クリックして移動
            </p>
          )}
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
