"use client";

import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { SiloCard } from "@/types";
import SiloPopup from "./SiloPopup";

interface SiloMarkerProps {
  silo: SiloCard;
  isCollected: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export default function SiloMarker({
  silo,
  isCollected,
  isSelected,
  onSelect,
}: SiloMarkerProps) {
  const icon = useMemo(() => {
    if (isCollected) {
      return L.divIcon({
        className: "custom-marker-collected",
        html: `<div class="silo-marker-collected ${isSelected ? "silo-marker-selected" : ""}">
          <img src="${silo.imageUrl}" alt="${silo.name}" class="silo-marker-image" />
        </div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22],
      });
    }

    return L.divIcon({
      className: "custom-marker-uncollected",
      html: `<div class="silo-marker-uncollected">
        <span>?</span>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }, [isCollected, isSelected, silo.imageUrl, silo.name]);

  if (isCollected) {
    return (
      <Marker
        position={[silo.coordinates.lat, silo.coordinates.lng]}
        icon={icon}
        eventHandlers={{
          click: () => onSelect?.(silo.id),
        }}
      >
        <Popup>
          <SiloPopup silo={silo} />
        </Popup>
      </Marker>
    );
  }

  // 未収集マーカーは非インタラクティブ
  return (
    <Marker
      position={[silo.coordinates.lat, silo.coordinates.lng]}
      icon={icon}
      interactive={false}
    />
  );
}
