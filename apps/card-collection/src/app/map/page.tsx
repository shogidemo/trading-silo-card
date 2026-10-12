"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SiloMapClient, SiloListSidebar } from "@/components/Map";
import { CardDetail } from "@/components/Card";
import { useCollection } from "@/context/CollectionContext";
import { silos } from "@/data";
import { getSiloPosition, getVisibleSilos } from "@/lib/siloMap";
import { useTransientState } from "@/hooks/useTransientState";
import { siloLocations } from "@/data/siloLocations";

function MapExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useCollection();
  const [resetVersion, setResetVersion] = useState(0);
  const [filter, setFilter] = useTransientState<"all" | "collected">("map:filter", "all");
  const [basemap, setBasemap] = useTransientState<"map" | "photo">("map:basemap", "map");
  const [focusVersion, setFocusVersion] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const collected = useMemo(() => silos.filter((silo) => state.collectedCardIds.includes(silo.id)), [state.collectedCardIds]);
  const displayed = useMemo(() => getVisibleSilos(silos, state.collectedCardIds, filter === "collected"), [filter, state.collectedCardIds]);
  const locatedCount = displayed.filter((silo) => getSiloPosition(silo)).length;
  const requestedId = searchParams.get("silo");
  const initialSelectionResolved = useRef(false);
  useEffect(() => {
    if (initialSelectionResolved.current) return;
    initialSelectionResolved.current = true;
    if (requestedId && filter === "collected" && silos.some(silo => silo.id === requestedId) && !state.collectedCardIds.includes(requestedId)) setFilter("all");
  }, [requestedId, filter, state.collectedCardIds, setFilter]);
  const selected = displayed.find((silo) => silo.id === requestedId);
  const location = selected ? siloLocations[selected.id] : undefined;
  const selectedIsCollected = selected ? state.collectedCardIds.includes(selected.id) : false;

  const selectSilo = (id: string) => {
    setDetailOpen(false);
    setFocusVersion((value) => value + 1);
    router.replace(`/map?silo=${encodeURIComponent(id)}`, { scroll: false });
    const bounds = mapRef.current?.getBoundingClientRect();
    if (window.innerWidth < 1024 && bounds && (bounds.top < 0 || bounds.bottom > window.innerHeight)) mapRef.current?.scrollIntoView({ block: "start" });
  };
  const resetMap = () => {
    setDetailOpen(false);
    router.replace("/map", { scroll: false });
    setFilter("all");
    setResetVersion((value) => value + 1);
  };

  return <div className="silo-explorer max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
    <Link href="/collection" className="inline-flex min-h-11 items-center text-sm text-concrete-600 underline underline-offset-4">カードコレクションに戻る</Link>
    <div className="silo-explorer-heading">
      <div><h2 className="font-display text-2xl sm:text-3xl text-concrete-900">サイロマップ</h2><p className="text-sm text-concrete-600 mt-2">未獲得の施設も、港とサイロの所在地を確認できます。</p></div>
      <div className="silo-explorer-progress"><span className="font-bold text-xl">{collected.length}<span className="text-sm font-normal"> / {silos.length}</span></span><span className="text-xs">サイロを獲得</span></div>
    </div>
    <div className="silo-map-toolbar">
      <div className="silo-map-filters" role="group" aria-label="地図の表示対象">
        <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>すべて</button>
        <button type="button" aria-pressed={filter === "collected"} onClick={() => { setFilter("collected"); setDetailOpen(false); router.replace("/map", { scroll: false }); setFocusVersion((value) => value + 1); }}>獲得済み</button>
      </div>
      <div className="silo-map-filters" role="group" aria-label="背景の表示">
        <button type="button" aria-pressed={basemap === "map"} onClick={() => setBasemap("map")}>地図</button>
        <button type="button" aria-pressed={basemap === "photo"} onClick={() => setBasemap("photo")}>航空写真</button>
      </div>
      <button type="button" onClick={resetMap} className="silo-map-action">全国を表示</button>
    </div>
    <div className="silo-explorer-grid">
      <div className="silo-explorer-main min-w-0">
        {displayed.length === 0 && <p role="status" className="silo-map-empty-message">このブラウザには獲得済みのサイロカードがありません。「すべて」で未獲得施設の場所を確認できます。</p>}
        {displayed.length > 0 && locatedCount === 0 && <p role="status" className="silo-map-empty-message">施設の地点を確認中のため、ピンは表示していません。施設一覧から所在地案内とカードの詳細を確認できます。</p>}
        <div ref={mapRef} className="silo-explorer-map" role="region" aria-label="サイロの所在地と収集状況を示す地図">
          <SiloMapClient silos={displayed} selectedSiloId={selected?.id ?? null} onSiloSelect={selectSilo} resetVersion={resetVersion} focusVersion={focusVersion} collectedIds={state.collectedCardIds} showCollectedOnly={filter === "collected"} basemap={basemap} onReturnToMap={() => setBasemap("map")} />
        </div>
        <section className="silo-selected-detail" aria-labelledby="selected-silo-title" data-testid="silo-selected-detail">
          {selected ? <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0"><p className="text-xs text-harvest-600 mb-1">{selectedIsCollected ? "✓ 獲得済み" : "○ 未獲得"}</p><h3 id="selected-silo-title" className="text-lg font-display">{selected.name}</h3><p className="text-sm text-concrete-600 mt-1">{location?.address ?? selected.location}</p></div>
              <div className="flex flex-wrap gap-2">
                <a className="silo-map-action" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location?.address ? `${selected.name} ${location.address}` : selected.location)}`} target="_blank" rel="noopener noreferrer">Googleマップで見る</a>
                <button className="silo-map-action silo-map-action-primary" type="button" onClick={() => setDetailOpen(true)}>{selectedIsCollected ? "カードの詳細を見る" : "施設の詳細を見る"}</button>
                {selectedIsCollected ? <>
                  <Link className="silo-map-action" href={`/collection#card-${selected.id}`}>コレクションで見る</Link>
                </> : <Link className="silo-map-action silo-map-action-primary" href="/quiz?category=silo">クイズでカードを集める</Link>}
              </div>
            </div>
            <p className="text-xs text-concrete-500 leading-relaxed mt-3">{location?.status === "site-point" ? location.positionKind === "official-facility" ? "公式所在地案内の施設地点（事務所・受付側）です。サイロ本体の位置は未確定です。" : "公式施設案内と航空写真を照合した施設内の地点です。" : "サイロ本体の地点を確認中のため、地図にピンは表示していません。"}
              {location?.sourceUrl && <> <a href={location.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">公式の所在地案内</a></>}
              {location?.aerialUrl && <> · <a href={location.aerialUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">所在地の航空写真（国土地理院）</a></>}
            </p>
          </> : <><h3 id="selected-silo-title" className="text-base font-display">施設を選んでみよう</h3><p className="text-sm text-concrete-600 mt-2">ピンや一覧から選ぶと、所在地とカードの詳細を確認できます。</p>
            {requestedId && <p role="status" className="text-sm text-concrete-500 mt-2">この施設は現在の表示対象に含まれていないか、見つかりません。</p>}
            {collected.length === 0 && <Link className="silo-map-action silo-map-action-primary inline-flex mt-3" href="/quiz?category=silo">サイロのクイズに挑戦</Link>}
          </>}
        </section>
      </div>
      <SiloListSidebar silos={displayed} selectedId={selected?.id ?? null} onSelect={selectSilo} collectedIds={state.collectedCardIds} collectedOnly={filter === "collected"} />
    </div>
    <p className="text-xs text-concrete-500 mt-3 leading-relaxed">✓ 獲得済み　○ 未獲得（所在地は確認できます）　「施設 / 拡大」: 同じ港周辺の施設をまとめた表示</p>
    <p className="text-xs text-concrete-500 mt-2 leading-relaxed">通常の地図はOpenStreetMap、施設周辺の航空写真は国土地理院の写真です。航空写真の撮影時期は場所ごとに異なり、船は撮影時に写っている場合だけ見えます。現在の船の位置ではありません。現在表示する写真の撮影日は未確認です。背景を読み込めない場合も施設一覧を利用できます。</p>
    <p className="text-xs text-concrete-500 mt-2 leading-relaxed">所在地は公式施設案内と<a href="https://maps.gsi.go.jp/development/ichiran.html#seamlessphoto" target="_blank" rel="noopener noreferrer" className="underline">地理院タイル（全国最新写真）</a>をもとに作成しています。</p>
    {selected && detailOpen && <CardDetail card={selected} onClose={() => setDetailOpen(false)} />}
  </div>;
}

export default function MapPage() {
  return <Suspense fallback={<p className="p-6" role="status">サイロマップを読み込み中…</p>}><MapExplorer /></Suspense>;
}
