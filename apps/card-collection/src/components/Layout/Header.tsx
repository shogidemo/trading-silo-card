"use client";

import Link from "next/link";
import { useCollection } from "@/context/CollectionContext";

export default function Header() {
  const { getProgress } = useCollection();
  const progress = getProgress();
  return <header className="atlas-header">
    <Link href="/" className="atlas-brand" aria-label="港のアトラス ホーム">◒ 港のアトラス</Link>
    <div className="atlas-header-tools">
      <span className="atlas-count" aria-label={`カード${progress.collected}枚、全${progress.total}枚`}>{progress.collected} / {progress.total}枚</span>
      <Link href="/settings" className="atlas-settings">設定</Link>
    </div>
  </header>;
}
