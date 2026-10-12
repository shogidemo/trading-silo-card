"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, ScaleControl, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { SiloCard } from "@/types";
import { useReducedMotion } from "@/hooks";
import { getSiloPosition, getSiloZoom, groupNearbySilos } from "@/lib/siloMap";

export interface SiloMapProps {
  silos: SiloCard[];
  selectedSiloId: string | null;
  onSiloSelect: (id: string) => void;
  resetVersion: number;
  focusVersion: number;
  collectedIds: string[];
  showCollectedOnly: boolean;
}

const JAPAN_BOUNDS: L.LatLngBoundsExpression = [[30.7, 129.2], [43.8, 145.5]];

function Facilities({ silos, selectedSiloId, onSiloSelect, resetVersion, focusVersion, collectedIds, showCollectedOnly }: SiloMapProps) {
  const map = useMap();
  const reducedMotion = useReducedMotion();
  const [, setViewVersion] = useState(0);
  useMapEvents({
    zoomend: () => setViewVersion((value) => value + 1),
    resize: () => setViewVersion((value) => value + 1),
  });

  useEffect(() => {
    map.invalidateSize();
    const selected = silos.find((silo) => silo.id === selectedSiloId);
    const position = selected && getSiloPosition(selected);
    const positions = silos.map(getSiloPosition).filter((point): point is [number, number] => point !== null);
    if (position && selected) map.setView(position, getSiloZoom(selected), { animate: !reducedMotion });
    else if (showCollectedOnly && positions.length > 0) map.fitBounds(positions, { padding: [32, 32], maxZoom: 16, animate: !reducedMotion });
    else map.fitBounds(JAPAN_BOUNDS, { padding: [24, 24], animate: false });
  }, [map, selectedSiloId, silos, showCollectedOnly, reducedMotion, resetVersion, focusVersion]);

  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  const located = silos.filter((silo) => getSiloPosition(silo));
  const groups = groupNearbySilos(located.filter((silo) => silo.id !== selectedSiloId), (silo) => {
    const point = map.latLngToLayerPoint(getSiloPosition(silo)!);
    return [point.x, point.y];
  }, map.getZoom() >= 16 ? 0 : 52);
  const selectedFacility = located.find((silo) => silo.id === selectedSiloId);
  if (selectedFacility) groups.push([selectedFacility]);

  return <>{groups.map((group) => {
    const silo = group[0];
    const isCluster = group.length > 1;
    const positions = group.map((item) => getSiloPosition(item)!);
    const position: [number, number] = [positions.reduce((sum, point) => sum + point[0], 0) / positions.length, positions.reduce((sum, point) => sum + point[1], 0) / positions.length];
    const selected = group.some((item) => item.id === selectedSiloId);
    const collectedCount = group.filter((item) => collectedIds.includes(item.id)).length;
    const isCollected = collectedIds.includes(silo.id);
    const label = isCluster ? `近くのサイロ${group.length}施設を拡大、獲得済み${collectedCount}施設` : `${silo.name}を選択、${isCollected ? "獲得済み" : "未獲得"}`;
    const icon = L.divIcon({
      className: "silo-map-icon",
      html: `<span class="silo-map-pin ${isCluster ? "silo-map-cluster" : ""} ${collectedCount === 0 ? "is-uncollected" : ""} ${selected ? "is-selected" : ""}" aria-hidden="true">${isCluster ? `${group.length}施設<br><small>✓${collectedCount} · 拡大</small>` : isCollected ? "✓" : "○"}</span>`,
      iconSize: [44, 44], iconAnchor: [22, 22],
    });
    return <Marker key={group.map((item) => item.id).join("-")}
      position={position} icon={icon} title={label} keyboard
      zIndexOffset={selected ? 1000 : 0}
      eventHandlers={{
        add: (event) => {
          const element = (event.target as L.Marker).getElement();
          element?.setAttribute("role", "button");
          element?.setAttribute("aria-label", label);
          element?.setAttribute("data-testid", isCluster ? "silo-cluster" : "silo-marker");
          element?.setAttribute("data-facility-count", String(group.length));
          element?.setAttribute("data-collected-count", String(collectedCount));
          if (!isCluster) {
            element?.setAttribute("data-collected", String(isCollected));
            element?.setAttribute("data-silo-id", silo.id);
            element?.setAttribute("data-lat", String(position[0]));
            element?.setAttribute("data-lng", String(position[1]));
          }
        },
        click: () => {
          if (isCluster) map.fitBounds(positions, { padding: [52, 52], maxZoom: 16, animate: !reducedMotion });
          else onSiloSelect(silo.id);
        },
      }}>
      <Tooltip direction="top" offset={[0, -20]}>{isCluster ? `${group.length}施設 · 獲得済み${collectedCount}施設 · タップで拡大` : `${silo.name}（${isCollected ? "獲得済み" : "未獲得"}）`}</Tooltip>
    </Marker>;
  })}

  </>;
}

export default function SiloMap(props: SiloMapProps) {
  const [tileFailed, setTileFailed] = useState(false);
  const [retryVersion, setRetryVersion] = useState(0);
  return <div className="silo-map-surface h-full relative" data-testid="silo-map">
    <MapContainer bounds={JAPAN_BOUNDS} boundsOptions={{ padding: [24, 24] }}
      minZoom={4} maxZoom={18} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer key={retryVersion} url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        eventHandlers={{ tileerror: () => setTileFailed(true) }} />
      <ScaleControl position="bottomleft" imperial={false} />
      <Facilities {...props} />
    </MapContainer>
    {tileFailed && <div role="status" className="silo-map-notice">
      <span>背景地図を読み込めません。施設一覧から所在地と詳細を確認できます。</span>
      <button type="button" onClick={() => { setTileFailed(false); setRetryVersion((value) => value + 1); }}>再読み込み</button>
    </div>}
  </div>;
}
