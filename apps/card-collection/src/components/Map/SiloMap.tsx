"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, ScaleControl, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { SiloCard } from "@/types";
import { useReducedMotion } from "@/hooks";
import { getSiloPosition, getSiloZoom, groupNearbySilos, SiloRegion } from "@/lib/siloMap";

export interface SiloMapProps {
  silos: SiloCard[];
  selectedSiloId: string | null;
  onSiloSelect: (id: string) => void;
  resetVersion: number;
  focusVersion: number;
  regions: SiloRegion[];
  selectedRegionId: string | null;
  onRegionSelect: (id: string) => void;
}

const JAPAN_BOUNDS: L.LatLngBoundsExpression = [[30.7, 129.2], [43.8, 145.5]];

function Facilities({ silos, selectedSiloId, onSiloSelect, resetVersion, focusVersion, regions, selectedRegionId, onRegionSelect }: SiloMapProps) {
  const map = useMap();
  const reducedMotion = useReducedMotion();
  const [, setViewVersion] = useState(0);
  useMapEvents({
    zoomend: () => setViewVersion((value) => value + 1),
    resize: () => setViewVersion((value) => value + 1),
  });

  useEffect(() => {
    map.fitBounds(JAPAN_BOUNDS, { padding: [24, 24], animate: false });
  }, [map, resetVersion]);

  useEffect(() => {
    const selected = silos.find((silo) => silo.id === selectedSiloId);
    if (selected) map.setView(getSiloPosition(selected), getSiloZoom(selected), { animate: !reducedMotion });
  }, [map, selectedSiloId, silos, reducedMotion, focusVersion]);

  useEffect(() => {
    const region = regions.find((item) => item.id === selectedRegionId);
    if (region) map.setView(region.position, 6, { animate: !reducedMotion });
  }, [map, regions, selectedRegionId, reducedMotion, focusVersion]);

  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  const groups = groupNearbySilos(silos, (silo) => {
    const point = map.latLngToLayerPoint(getSiloPosition(silo));
    return [point.x, point.y];
  }, map.getZoom() >= 16 ? 0 : 52);

  return <>{groups.map((group) => {
    const silo = group[0];
    const isCluster = group.length > 1;
    const approximate = !isCluster && getSiloZoom(silo) < 16;
    const selected = group.some((item) => item.id === selectedSiloId);
    const label = isCluster ? `近くの獲得済みサイロ${group.length}施設を拡大` : `${silo.name}を選択${approximate ? "、概略位置" : ""}`;
    const icon = L.divIcon({
      className: "silo-map-icon",
      html: `<span class="silo-map-pin ${isCluster ? "silo-map-cluster" : ""} ${approximate ? "silo-map-approximate" : ""} ${selected ? "is-selected" : ""}" aria-hidden="true">${isCluster ? group.length : approximate ? "≈" : "✓"}</span>`,
      iconSize: [44, 44], iconAnchor: [22, 22],
    });
    return <Marker key={group.map((item) => item.id).join("-")}
      position={getSiloPosition(silo)} icon={icon} title={label} keyboard
      zIndexOffset={selected ? 1000 : 0}
      eventHandlers={{
        add: (event) => {
          const element = (event.target as L.Marker).getElement();
          element?.setAttribute("role", "button");
          element?.setAttribute("aria-label", label);
          element?.setAttribute("data-testid", isCluster ? "silo-cluster" : "silo-marker");
          element?.setAttribute("data-silo-id", silo.id);
          element?.setAttribute("data-lat", String(getSiloPosition(silo)[0]));
          element?.setAttribute("data-lng", String(getSiloPosition(silo)[1]));
        },
        click: () => {
          if (isCluster) map.fitBounds(group.map(getSiloPosition), { padding: [52, 52], maxZoom: 16, animate: !reducedMotion });
          else onSiloSelect(silo.id);
        },
      }}>
      <Tooltip direction="top" offset={[0, -20]}>{isCluster ? `獲得済み ${group.length}施設 · タップで拡大` : `${silo.name}${approximate ? "（概略位置）" : ""}`}</Tooltip>
    </Marker>;
  })}
    {regions.map((region) => <Marker key={region.id} position={region.position}
      title={`${region.name}の未獲得サイロ、残り${region.remaining}施設`} keyboard
      icon={L.divIcon({ className: "silo-map-icon", html: '<span class="silo-map-pin silo-map-region" aria-hidden="true">?</span>', iconSize: [44, 44], iconAnchor: [22, 22] })}
      eventHandlers={{
        add: (event) => {
          const element = (event.target as L.Marker).getElement();
          element?.setAttribute("role", "button");
          element?.setAttribute("aria-label", `${region.name}の未獲得サイロ、残り${region.remaining}施設`);
          element?.setAttribute("data-testid", "silo-region");
          element?.setAttribute("data-region-id", region.id);
        },
        click: () => onRegionSelect(region.id),
      }}><Tooltip direction="top">{region.name} · 未獲得{region.remaining}施設</Tooltip></Marker>)}
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
