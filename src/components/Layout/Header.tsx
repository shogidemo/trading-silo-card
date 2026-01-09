"use client";

import Link from "next/link";
import { useCollection } from "@/context/CollectionContext";

export default function Header() {
  const { getProgress } = useCollection();
  const progress = getProgress();

  return (
    <header className="bg-gradient-to-r from-earth-700 to-earth-800 text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <div>
              <h1 className="text-xl font-bold">穀物サイロカード</h1>
              <p className="text-xs text-earth-200">
                学んで集めるカードコレクション
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-earth-200">コレクション</p>
              <p className="font-bold">
                {progress.collected}/{progress.total}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-earth-600 flex items-center justify-center">
              <span className="text-sm font-bold">{progress.percentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
