"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { silos } from "@/data";
import { useCollection } from "@/context/CollectionContext";
import SiloMarker from "./SiloMarker";

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

export default function SiloMap({ selectedSiloId, onSiloSelect }: SiloMapProps) {
  const { hasCard } = useCollection();

  return (
    <MapContainer
      center={[36.5, 138.0]}
      zoom={5}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
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
