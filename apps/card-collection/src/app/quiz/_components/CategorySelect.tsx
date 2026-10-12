"use client";

import { CATEGORY_INFO } from "@/constants";
import { CardCategory, CategoryStats } from "@/types";

interface CategorySelectProps {
  onCategorySelect: (category: CardCategory) => void;
  onChallengeStart: (category: CardCategory) => void;
  onReviewStart: () => void;
  getCategoryProgress: (category: CardCategory) => {
    collected: number;
    total: number;
    percentage: number;
  };
  categoryStats: Record<CardCategory, CategoryStats>;
  wrongAnswerCount: number;
}

export default function CategorySelect({ onCategorySelect, onChallengeStart, onReviewStart, getCategoryProgress, categoryStats, wrongAnswerCount }: CategorySelectProps) {
  return <div className="atlas-learn">
    <p className="atlas-eyebrow">今日は、何を知ろう。</p><h2>カテゴリを選択</h2><p className="atlas-muted">1問ずつでも、3問まとめてでも。最初の正解でカードを獲得します。</p>
    <div className="atlas-learn-categories">{CATEGORY_INFO.map(category => {
      const progress = getCategoryProgress(category.id), stats = categoryStats[category.id];
      return <section key={category.id}>
        <button type="button" className="atlas-learn-category" aria-label={`${category.name}を知る`} onClick={() => onCategorySelect(category.id)}>
          <span aria-hidden="true" className="atlas-learn-icon">{category.id === "silo" ? "▥" : category.id === "grain" ? "❧" : "◇"}</span>
          <span><strong>{category.name}を知る</strong><small>{category.description}</small><small>{progress.collected}/{progress.total}枚 · 挑戦 {stats.attempts}回{stats.attempts ? ` · 正答率${Math.round(stats.correct / stats.attempts * 100)}%` : " · 未挑戦"}</small></span>
        </button>
        <button type="button" className="atlas-secondary" aria-label={`${category.name}の3問チャレンジ`} onClick={() => onChallengeStart(category.id)}>3問チャレンジ</button>
      </section>;
    })}</div>
    {wrongAnswerCount > 0 ? <div className="atlas-review-entry"><button type="button" className="atlas-primary" onClick={onReviewStart}>復習モード（{wrongAnswerCount}問）</button><p className="atlas-muted">間違えた問題をもう一度。</p></div> : <p className="atlas-muted">間違えた問題ができると復習できます。</p>}
  </div>;
}
