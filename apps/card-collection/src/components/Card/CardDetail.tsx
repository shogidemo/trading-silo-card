"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card } from "@/types";
import { CATEGORY_INFO } from "@/constants";
import { useModalAccessibility } from "@/hooks";
import { useCollection } from "@/context/CollectionContext";
import { siloLocations } from "@/data/siloLocations";
import CardArtwork from "./CardArtwork";

interface CardDetailProps { card: Card; onClose: () => void; onStartQuiz?: () => void; }

export default function CardDetail({ card, onClose, onStartQuiz }: CardDetailProps) {
  const { modalRef, handleKeyDown } = useModalAccessibility(true, onClose);
  const { hasCard } = useCollection();
  const collected = hasCard(card.id);
  const location = card.category === "silo" ? siloLocations[card.id] : undefined;
  const titleId = `card-detail-title-${card.id}`;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, []);
  const facts: [string, string][] = card.category === "silo" ? [
    ["所在地", location?.address ?? card.location], ["貯蔵能力", card.capacity], ["設立年", `${card.establishedYear}年`],
    ["取扱穀物", card.grains.join("、")], ["運営", card.operator],
  ] : card.category === "grain" ? [
    ["主要産地", card.origins.join("、")], ["主な用途", card.uses.join("、")],
    ["栄養素", card.nutrients.join("、")], ["世界年間生産量", card.annualProduction], ["トリビア", card.trivia],
  ] : [
    ["設立年", `${card.foundedYear}年`], ["本社所在地", card.headquarters], ["主要取扱品目", card.mainProducts.join("、")],
    ["グローバル展開", card.globalPresence.join("、")], ["特徴・強み", card.specialty],
  ];
  return <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onKeyDown={handleKeyDown} onClick={onClose} className="atlas-modal-backdrop">
    <div className="atlas-detail" onClick={event => event.stopPropagation()}>
      <div className="atlas-detail-top"><span className="atlas-eyebrow">{CATEGORY_INFO.find(category => category.id === card.category)?.name}カード</span><button type="button" className="atlas-text-link" onClick={onClose} aria-label="詳細を閉じる">閉じる</button></div>
      <div className="atlas-detail-header" data-testid="card-detail-header"><h2 id={titleId}>{card.name}</h2><span className={`atlas-badge ${collected ? "is-collected" : ""}`}>{collected ? "✓ 獲得済み" : "○ 未獲得"}</span></div>
      <div className="atlas-detail-art"><CardArtwork card={card} /></div>
      <p className="atlas-muted">オリジナル図解・社名テキスト。施設の実際の外観を再現した図ではありません。</p>
      <p className="atlas-detail-description">{card.description}</p>
      <dl className="atlas-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      {location && <p className="atlas-location-note">{location.positionKind === "official-facility" ? "公式施設案内に対応する事務所・受付側の地点です。サイロ本体の位置は未確定です。" : location.status === "site-point" ? "公式施設案内と航空写真を照合した施設内の地点です。" : "サイロの位置を確認中です。概略地点のピンは表示しません。"}
        {location.sourceUrl && <> <a className="atlas-text-link" href={location.sourceUrl} target="_blank" rel="noopener noreferrer">公式の所在地案内</a></>}
      </p>}
      <div className="atlas-detail-actions">
        {card.category === "silo" && <Link className="atlas-primary" href={`/map?silo=${card.id}`} onClick={onClose}>地図で見る</Link>}
        <Link className={card.category === "silo" ? "atlas-secondary" : "atlas-primary"} href={`/quiz?cardId=${card.id}`} onClick={event => { if (onStartQuiz) { event.preventDefault(); onStartQuiz(); } else onClose(); }}>{collected ? "このカードでもう1問" : "クイズでこのカードを集める"}</Link>
        <button type="button" className="atlas-secondary" onClick={onClose}>元の画面へ戻る</button>
      </div>
      <p className="atlas-muted">非公認の学習コンテンツです。企業の協賛・推奨を示すものではありません。</p>
    </div>
  </div>;
}
