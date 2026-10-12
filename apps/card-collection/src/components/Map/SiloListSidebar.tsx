"use client";

import { siloLocations } from "@/data/siloLocations";
import { SiloCard } from "@/types";

interface SiloListSidebarProps {
  silos: SiloCard[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  collectedIds: string[];
  collectedOnly: boolean;
}

export default function SiloListSidebar({ silos, selectedId, onSelect, collectedIds, collectedOnly }: SiloListSidebarProps) {
  return <section className="silo-map-list" aria-labelledby="silo-list-title" data-testid="silo-sidebar">
    <div className="silo-map-list-heading">
      <h3 id="silo-list-title">{collectedOnly ? "獲得済みの施設" : "すべての施設"}</h3><span>{silos.length}施設</span>
    </div>
    {silos.length === 0 ? <p className="p-5 text-sm text-concrete-600">獲得済みのサイロがありません。クイズに正解すると、この地図で所在地を確認できます。</p> :
      <ul className="silo-map-list-scroll">{[...silos].sort((a, b) => b.coordinates.lat - a.coordinates.lat).map((silo) =>
        <li key={silo.id}><button type="button" onClick={() => onSelect(silo.id)}
          className={`silo-map-list-item ${selectedId === silo.id ? "is-selected" : ""}`}
          aria-label={`${silo.name}を選択`} aria-describedby={`silo-state-${silo.id}`} aria-pressed={selectedId === silo.id}>
          <span className="silo-map-list-check" aria-hidden="true">{collectedIds.includes(silo.id) ? "✓" : "○"}</span>
          <span className="min-w-0"><span className="block font-bold leading-relaxed">{silo.name}</span><span id={`silo-state-${silo.id}`} className="block text-xs mt-1 opacity-75">{collectedIds.includes(silo.id) ? "獲得済み" : "未獲得"} · {silo.location}{siloLocations[silo.id]?.status !== "site-point" && " · 地点確認中"}</span></span>
          <span className="text-xs shrink-0">{siloLocations[silo.id]?.status === "site-point" ? "地図で見る" : "詳細を見る"}</span>
        </button></li>)}</ul>}
  </section>;
}
