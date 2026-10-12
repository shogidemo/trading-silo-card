"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useTransientState } from "@/hooks/useTransientState";
import { useCollection } from "@/context/CollectionContext";
import { CATEGORY_INFO } from "@/constants";
import { Card, CardCategory } from "@/types";
import { allCards } from "@/data";
import { FlipCard, CardDetail } from "@/components/Card";
import CardArtwork from "@/components/Card/CardArtwork";

export default function CollectionPage() {
  const [selectedCategory, setSelectedCategory] = useTransientState<CardCategory | "all">("collection:selectedCategory", "all");
  const [collectionFilter, setCollectionFilter] = useTransientState<"all" | "collected" | "uncollected">("collection:collectionFilter", "all");
  const [filterText, setFilterText] = useTransientState("collection:filterText", "");
  const [search, setSearch] = useTransientState("collection:search", "");
  const [composing, setComposing] = useState(false);
  const [detail, setDetail] = useState<Card | null>(null);
  const { hasCard, getProgress } = useCollection();
  const progress = getProgress();
  const filteredCards = useMemo(() => allCards.filter(card =>
    (selectedCategory === "all" || card.category === selectedCategory) &&
    (collectionFilter === "all" || hasCard(card.id) === (collectionFilter === "collected")) &&
    (!search.trim() || `${card.name} ${card.description}`.toLowerCase().includes(search.trim().toLowerCase()))
  ), [selectedCategory, collectionFilter, search, hasCard]);
  useEffect(() => {
    const showHashTarget = () => {
      const id = window.location.hash.replace(/^#card-/, "");
      if (!allCards.some(card => card.id === id)) return;
      setSelectedCategory("all"); setCollectionFilter("all"); setFilterText(""); setSearch("");
      requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(`card-${id}`)?.scrollIntoView({ block: "center" })));
    };
    showHashTarget();
    window.addEventListener("hashchange", showHashTarget);
    return () => window.removeEventListener("hashchange", showHashTarget);
  }, [setSelectedCategory, setCollectionFilter, setFilterText, setSearch]);
  const clearFilters = () => { setFilterText(""); setSearch(""); setCollectionFilter("all"); setSelectedCategory("all"); };
  return <div className="atlas-collection">
    <Link href="/" className="atlas-text-link">ホームに戻る</Link>
    <p className="atlas-eyebrow">自分の図鑑</p><h2>{progress.collected ? `${progress.collected}枚の知識が、集まった。` : "まだ0枚。ここから集めよう。"}</h2>
    <p className="atlas-muted">全{allCards.length}枚。未獲得のカードも、名前と基本情報を見られます。</p>
    <div className="atlas-chips" role="group" aria-label="カードのカテゴリ" data-testid="category-filter-group">
      <button type="button" data-testid="category-filter-all" aria-pressed={selectedCategory === "all"} onClick={() => setSelectedCategory("all")}>すべて</button>
      {CATEGORY_INFO.map(category => <button key={category.id} type="button" data-testid={`category-filter-${category.id}`} aria-pressed={selectedCategory === category.id} onClick={() => setSelectedCategory(category.id)}>{category.name}</button>)}
    </div>
    <label className="atlas-search-label">カード名を検索<input type="search" value={filterText} placeholder="カード名・キーワード" aria-label="カード名を検索" onCompositionStart={() => setComposing(true)} onCompositionEnd={event => { setComposing(false); setSearch(event.currentTarget.value); }} onChange={event => { setFilterText(event.target.value); if (!composing && !(event.nativeEvent as InputEvent).isComposing) setSearch(event.target.value); }} /></label>
    <div className="atlas-chips" role="group" aria-label="取得状態で絞り込む">
      {(["all", "collected", "uncollected"] as const).map(value => <button key={value} type="button" data-testid={`collection-filter-${value}`} aria-pressed={collectionFilter === value} onClick={() => setCollectionFilter(value)}>{value === "all" ? "すべて" : value === "collected" ? "獲得済み" : "未獲得"}</button>)}
    </div>
    <p className="atlas-muted" aria-live="polite">表示中: {filteredCards.length} / {allCards.length}枚</p>
    <div className="atlas-card-grid">{filteredCards.map(card => {
      const collected = hasCard(card.id);
      return <article key={card.id} id={`card-${card.id}`} className="atlas-collection-card">
        {collected ? <FlipCard card={card} isCollected /> : <button type="button" className="atlas-card-preview" onClick={() => setDetail(card)} aria-label={`${card.name}の基本情報を見る`}><CardArtwork card={card} /></button>}
        <button type="button" className="atlas-card-title" onClick={() => setDetail(card)} aria-label={`${card.name}の詳細を見る`}>{card.name}</button>
        <span className={`atlas-badge ${collected ? "is-collected" : ""}`}>{collected ? "✓ 獲得済み" : "○ 未獲得"}</span>
        {card.category === "silo" && <Link href={`/map?silo=${card.id}`} className="atlas-text-link" aria-label={`${card.name}の地図を見る`}>地図で見る</Link>}
      </article>;
    })}</div>
    {!filteredCards.length && <div className="atlas-empty"><p>該当するカードがありません。</p><button type="button" className="atlas-secondary" onClick={clearFilters}>検索と絞り込みを解除</button></div>}
    {!progress.collected && <Link className="atlas-primary" href="/quiz?cardId=silo-kanto">最初の1問へ</Link>}
    {detail && <CardDetail card={detail} onClose={() => setDetail(null)} />}
  </div>;
}
