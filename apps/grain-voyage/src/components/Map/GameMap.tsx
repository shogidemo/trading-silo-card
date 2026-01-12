"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { ports, routes, getConnectedPorts } from "@/data";
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
  selectedPortId?: string | null;
  shipPortId?: string | null;
  onPortSelect?: (id: string) => void;
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

export default function GameMap({
  selectedPortId,
  shipPortId,
  onPortSelect,
}: GameMapProps) {
  // 選択中の港から接続されている港のIDリスト
  const connectedPortIds = selectedPortId
    ? getConnectedPorts(selectedPortId)
    : [];

  return (
    <MapContainer
      center={INITIAL_CENTER}
      zoom={INITIAL_ZOOM}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer url={OSM_URL} attribution={OSM_ATTRIBUTION} />
      <MapControls />
      <FlyToPort portId={selectedPortId} />

      {/* 航路を描画 */}
      {routes.map((route) => {
        // 選択中の港に接続している航路をハイライト
        const isHighlighted =
          selectedPortId !== null &&
          (route.from === selectedPortId || route.to === selectedPortId);

        return (
          <RouteLayer
            key={route.id}
            route={route}
            ports={ports}
            isHighlighted={isHighlighted}
          />
        );
      })}

      {/* 港マーカーを描画 */}
      {ports.map((port) => (
        <PortMarker
          key={port.id}
          port={port}
          isSelected={selectedPortId === port.id}
          hasShip={shipPortId === port.id}
          onSelect={onPortSelect}
        />
      ))}
    </MapContainer>
  );
}
