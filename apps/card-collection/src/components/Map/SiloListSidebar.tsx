"use client";

import Link from "next/link";
import { siloLocations } from "@/data/siloLocations";
import type { SiloRegion } from "@/lib/siloMap";
import { SiloCard } from "@/types";

interface SiloListSidebarProps {
  silos: SiloCard[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  regions: SiloRegion[];
  selectedRegionId: string | null;
  onRegionSelect: (id: string) => void;
}

export default function SiloListSidebar({ silos, selectedId, onSelect, regions, selectedRegionId, onRegionSelect }: SiloListSidebarProps) {
  return <section className="silo-map-list" aria-labelledby="silo-list-title" data-testid="silo-sidebar">
    <div className="silo-map-list-heading">
      <h3 id="silo-list-title">獲得済みの施設</h3><span>{silos.length}施設</span>
    </div>
    {silos.length === 0 ? <p className="p-5 text-sm text-concrete-600">獲得済みのサイロがありません。クイズに正解すると、この地図で所在地を確認できます。</p> :
      <ul className="silo-map-list-scroll">{[...silos].sort((a, b) => b.coordinates.lat - a.coordinates.lat).map((silo) =>
        <li key={silo.id}><button type="button" onClick={() => onSelect(silo.id)}
          className={`silo-map-list-item ${selectedId === silo.id ? "is-selected" : ""}`}
          aria-label={`${silo.name}を選択`} aria-pressed={selectedId === silo.id}>
          <span className="silo-map-list-check" aria-hidden="true">✓</span>
          <span className="min-w-0"><span className="block font-bold leading-relaxed">{silo.name}</span><span className="block text-xs mt-1 opacity-75">{silo.location}{siloLocations[silo.id]?.status !== "official-point" && " · 概略位置"}</span></span>
          <span className="text-xs shrink-0">地図で見る</span>
        </button></li>)}</ul>}
    {regions.length > 0 && <div className="silo-region-list">
      <h3 className="font-display px-4 pt-4 text-base">未獲得の地域</h3>
      <p className="px-4 mt-1 mb-2 text-xs text-concrete-500">獲得すると施設の所在地がわかります。</p>
      <ul>{regions.map((region) => <li key={region.id}><button type="button" className={`silo-map-list-item ${selectedRegionId === region.id ? "is-selected" : ""}`} onClick={() => onRegionSelect(region.id)} aria-pressed={selectedRegionId === region.id}>
        <span aria-hidden="true">?</span><span className="flex-1">{region.name}</span><span className="text-xs">残り{region.remaining}施設</span>
      </button></li>)}</ul>
      <Link href="/quiz?category=silo" className="silo-map-action m-4">サイロのクイズに挑戦</Link>
    </div>}
  </section>;
}
