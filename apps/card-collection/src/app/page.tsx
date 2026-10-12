"use client";

import Link from "next/link";
import { useState } from "react";
import { useCollection } from "@/context/CollectionContext";
import { silos, allCards } from "@/data";
import HarbourDiagram from "@/components/Atlas/HarbourDiagram";
import { CardDetail } from "@/components/Card";

export default function Home() {
  const { state, hasCard, getProgress, getWrongAnswerQuizIds } = useCollection();
  const [detailOpen, setDetailOpen] = useState(false);
  const kashima = silos.find(silo => silo.id === "silo-kanto")!;
  const ownedKashima = hasCard(kashima.id);
  const collectedSilos = silos.filter(silo => hasCard(silo.id));
  const acquired = [...state.collectedCardIds].reverse().map(id => silos.find(silo => silo.id === id)).find(Boolean);
  const progress = getProgress();
  const wrongCount = getWrongAnswerQuizIds().length;
  return <div className="atlas-home atlas-page">
    <p className="atlas-eyebrow">穀物サイロカード</p>
    <h1>{progress.collected > 0 ? <>集めたカードから、<br />次の港へ。</> : <>港をひらいて、<br />サイロを集めよう。</>}</h1>
    {ownedKashima ? <button type="button" className="atlas-primary" onClick={() => setDetailOpen(true)}>鹿島のカードを振り返る</button> : <Link className="atlas-primary" href={`/quiz?cardId=${kashima.id}`}>鹿島の1問を解く</Link>}
    <HarbourDiagram />
    <div className="atlas-harbour-progress"><strong>集めたサイロ {collectedSilos.length} / {silos.length}</strong>
      {acquired ? <Link href={`/map?silo=${acquired.id}`} className="atlas-text-link">獲得済みの地点へ</Link> : <span className="atlas-muted">鹿島の1問から始めよう</span>}
    </div>
    <div className="atlas-row"><span className="atlas-eyebrow">次に知る港：鹿島</span><span className={`atlas-badge ${ownedKashima ? "is-collected" : ""}`}>{ownedKashima ? "✓ 獲得済み" : "○ 未獲得"}</span></div>
    <div className="atlas-row atlas-port-links"><button type="button" className="atlas-text-link" onClick={() => setDetailOpen(true)}>施設を先に知る</button><Link className="atlas-text-link" href="/map">全{silos.length}施設を探す</Link></div>
    <p className="atlas-muted">0枚でも地図と施設情報を見られます。正解したら、知った施設を自分の図鑑に。</p>
    <section className="atlas-home-learning"><h2>今日は、何を知ろう。</h2><Link className="atlas-secondary" href="/quiz">カテゴリから1問・3問チャレンジ</Link>
      {wrongCount > 0 ? <Link className="atlas-secondary" aria-label={`復習モードを開始（残り${wrongCount}問）`} href="/quiz?mode=review">間違えた問題を復習する（{wrongCount}問）</Link> : <p className="atlas-muted">間違えた問題ができると復習できます。</p>}
      <Link className="atlas-secondary" href="/collection">全{allCards.length}枚の図鑑を開く</Link>
    </section>
    {detailOpen && <CardDetail card={kashima} onClose={() => setDetailOpen(false)} />}
  </div>;
}
