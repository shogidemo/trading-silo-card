"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SiloMapClient, SiloListSidebar } from "@/components/Map";
import { CardDetail } from "@/components/Card";
import { useCollection } from "@/context/CollectionContext";
import { silos } from "@/data";
import { getUncollectedRegions } from "@/lib/siloMap";
import { siloLocations } from "@/data/siloLocations";

function MapExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useCollection();
  const [resetVersion, setResetVersion] = useState(0);
  const [filter, setFilter] = useState<"all" | "collected">("all");
  const [focusVersion, setFocusVersion] = useState(0);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const collected = useMemo(() => silos.filter((silo) => state.collectedCardIds.includes(silo.id)), [state.collectedCardIds]);
  const regions = useMemo(() => filter === "all" ? getUncollectedRegions(silos, state.collectedCardIds) : [], [filter, state.collectedCardIds]);
  const selectedRegion = regions.find((region) => region.id === selectedRegionId);
  const requestedId = searchParams.get("silo");
  const selected = collected.find((silo) => silo.id === requestedId);
  const location = selected ? siloLocations[selected.id] : undefined;

  const selectSilo = (id: string) => {
    setDetailOpen(false);
    setSelectedRegionId(null);
    setFocusVersion((value) => value + 1);
    router.replace(`/map?silo=${encodeURIComponent(id)}`, { scroll: false });
  };
  const selectRegion = (id: string) => {
    setDetailOpen(false);
    setSelectedRegionId(id);
    setFocusVersion((value) => value + 1);
    router.replace("/map", { scroll: false });
  };
  const resetMap = () => {
    setDetailOpen(false);
    router.replace("/map", { scroll: false });
    setSelectedRegionId(null);
    setResetVersion((value) => value + 1);
  };

  return <div className="silo-explorer max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
    <Link href="/collection" className="inline-flex min-h-11 items-center text-sm text-concrete-600 underline underline-offset-4">カードコレクションに戻る</Link>
    <div className="silo-explorer-heading">
      <div><h2 className="font-display text-2xl sm:text-3xl text-concrete-900">サイロマップ</h2><p className="text-sm text-concrete-600 mt-2">集めたカードから、港とサイロの所在地を見てみよう。</p></div>
      <div className="silo-explorer-progress"><span className="font-bold text-xl">{collected.length}<span className="text-sm font-normal"> / {silos.length}</span></span><span className="text-xs">サイロを獲得</span></div>
    </div>
    <div className="silo-map-toolbar">
      <div className="silo-map-filters" role="group" aria-label="地図の表示対象">
        <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>すべて</button>
        <button type="button" aria-pressed={filter === "collected"} onClick={() => { setFilter("collected"); setSelectedRegionId(null); }}>獲得済み</button>
      </div>
      <button type="button" onClick={resetMap} className="silo-map-action">全国を表示</button>
    </div>
    <div className="silo-explorer-grid">
      <div className="silo-explorer-main min-w-0">
        <div className="silo-explorer-map" role="region" aria-label="獲得済みサイロの所在地を示す地図">
          <SiloMapClient silos={collected} selectedSiloId={selected?.id ?? null} onSiloSelect={selectSilo} resetVersion={resetVersion} focusVersion={focusVersion} regions={regions} selectedRegionId={selectedRegionId} onRegionSelect={selectRegion} />
        </div>
        <section className="silo-selected-detail" aria-labelledby="selected-silo-title" data-testid="silo-selected-detail">
          {selected ? <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0"><p className="text-xs text-harvest-600 mb-1">✓ 獲得済み</p><h3 id="selected-silo-title" className="text-lg font-display">{selected.name}</h3><p className="text-sm text-concrete-600 mt-1">{location?.address ?? selected.location}</p></div>
              <div className="flex flex-wrap gap-2">
                <button className="silo-map-action silo-map-action-primary" type="button" onClick={() => setDetailOpen(true)}>カードの詳細を見る</button>
                <Link className="silo-map-action" href={`/collection#card-${selected.id}`}>コレクションで見る</Link>
              </div>
            </div>
            <p className="text-xs text-concrete-500 leading-relaxed mt-3">{location?.status === "official-point" ? "公式案内図の施設地点を表示しています。" : location?.status === "address-only" ? "所在地は公式案内で確認済みです。ピンは概略位置です。" : "概略位置を表示しています。施設の正確な地点は未確認です。"}
              {location?.sourceUrl && <> <a href={location.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">公式の所在地案内</a></>}
            </p>
          </> : selectedRegion ? <>
            <h3 id="selected-silo-title" className="text-lg font-display">{selectedRegion.name}の未獲得サイロ</h3>
            <p className="text-sm text-concrete-600 mt-2">あと{selectedRegion.remaining}施設。ピンは地域の目安です。カードを獲得すると施設の所在地を表示します。</p>
            <Link className="silo-map-action silo-map-action-primary inline-flex mt-3" href="/quiz?category=silo">サイロのクイズに挑戦</Link>
          </> : <><h3 id="selected-silo-title" className="text-base font-display">施設を選んでみよう</h3><p className="text-sm text-concrete-600 mt-2">ピンや一覧から選ぶと、所在地とカードの詳細を確認できます。</p>
            {requestedId && <p role="status" className="text-sm text-concrete-500 mt-2">この施設は未獲得、または見つかりません。</p>}
            {collected.length === 0 && <Link className="silo-map-action silo-map-action-primary inline-flex mt-3" href="/quiz?category=silo">サイロのクイズに挑戦</Link>}
          </>}
        </section>
      </div>
      <SiloListSidebar silos={collected} selectedId={selected?.id ?? null} onSelect={selectSilo} regions={regions} selectedRegionId={selectedRegionId} onRegionSelect={selectRegion} />
    </div>
    <p className="text-xs text-concrete-500 mt-3 leading-relaxed">✓ 公式地点を確認済み　≈ 獲得済み・概略位置　数字: 近くの獲得施設　?: 未獲得の地域（施設の位置ではありません）</p>
    <p className="text-xs text-concrete-500 mt-2 leading-relaxed">地図の背景にはOpenStreetMapを利用しています。背景を読み込めない場合も一覧とカードの詳細は利用できます。</p>
    {selected && detailOpen && <CardDetail card={selected} onClose={() => setDetailOpen(false)} />}
  </div>;
}

export default function MapPage() {
  return <Suspense fallback={<p className="p-6" role="status">サイロマップを読み込み中…</p>}><MapExplorer /></Suspense>;
}
