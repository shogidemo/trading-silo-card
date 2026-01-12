"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, LayersControl, useMap } from "react-leaflet";
import { silos } from "@/data";
import { useCollection } from "@/context/CollectionContext";
import SiloMarker from "./SiloMarker";

// 定数
const INITIAL_CENTER: [number, number] = [36.5, 138.0];
const INITIAL_ZOOM = 5;

// タイルURL・帰属表示
const OSM_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const SATELLITE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const SATELLITE_ATTRIBUTION =
  "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";

interface SiloMapProps {
  selectedSiloId?: string | null;
  onSiloSelect?: (id: string) => void;
}

function FlyToSilo({ siloId }: { siloId: string | null | undefined }) {
  const map = useMap();

  useEffect(() => {
    if (siloId) {
      const silo = silos.find((s) => s.id === siloId);
      if (silo) {
        map.flyTo([silo.coordinates.lat, silo.coordinates.lng], 10, {
          duration: 1,
        });
      }
    }
  }, [siloId, map]);

  return null;
}

function MapControls() {
  const map = useMap();

  const handleResetView = () => {
    map.flyTo(INITIAL_CENTER, INITIAL_ZOOM, { duration: 1 });
  };

  return (
    <div className="leaflet-top leaflet-left" style={{ marginTop: "80px" }}>
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={handleResetView}
          className="reset-view-button"
          title="日本全体を表示"
          aria-label="日本全体を表示"
        >
          🗾
        </button>
      </div>
    </div>
  );
}

export default function SiloMap({ selectedSiloId, onSiloSelect }: SiloMapProps) {
  const { hasCard } = useCollection();

  return (
    <MapContainer
      center={INITIAL_CENTER}
      zoom={INITIAL_ZOOM}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="地図">
          <TileLayer url={OSM_URL} attribution={OSM_ATTRIBUTION} />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="航空写真">
          <TileLayer
            url={SATELLITE_URL}
            attribution={SATELLITE_ATTRIBUTION}
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      <MapControls />
      <FlyToSilo siloId={selectedSiloId} />
      {silos.map((silo) => (
        <SiloMarker
          key={silo.id}
          silo={silo}
          isCollected={hasCard(silo.id)}
          isSelected={selectedSiloId === silo.id}
          onSelect={onSiloSelect}
        />
      ))}
    </MapContainer>
  );
}
