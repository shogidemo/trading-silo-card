"use client";

import Link from "next/link";
import { useCollection } from "@/context/CollectionContext";
import { CATEGORY_INFO } from "@/types";

export default function Home() {
  const { getProgress, getCategoryProgress, state } = useCollection();
  const progress = getProgress();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* ヒーローセクション */}
      <section className="text-center mb-12">
        <div className="text-6xl mb-4">🌾🏭📦</div>
        <h2 className="text-3xl font-bold text-earth-800 mb-4">
          穀物の世界を学ぼう
        </h2>
        <p className="text-earth-600 mb-6 max-w-md mx-auto">
          クイズに答えてカードをゲット！
          <br />
          サイロ、穀物、商社について楽しく学べます。
        </p>
        <Link
          href="/quiz"
          className="inline-block bg-leaf-600 hover:bg-leaf-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all hover:scale-105"
        >
          クイズに挑戦する
        </Link>
      </section>

      {/* 全体進捗 */}
      <section className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-bold text-earth-700 mb-4">
          コレクション進捗
        </h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="h-4 bg-earth-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-wheat-500 to-leaf-500 transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
          <span className="text-xl font-bold text-earth-700">
            {progress.percentage}%
          </span>
        </div>
        <p className="text-earth-600">
          <span className="font-bold text-2xl text-leaf-600">
            {progress.collected}
          </span>
          <span className="mx-2">/</span>
          <span className="text-xl">{progress.total}</span>
          <span className="ml-2">枚獲得</span>
        </p>
        {state.totalQuizAttempts > 0 && (
          <p className="text-sm text-earth-500 mt-2">
            正答率: {Math.round((state.correctAnswers / state.totalQuizAttempts) * 100)}%
            ({state.correctAnswers}/{state.totalQuizAttempts})
          </p>
        )}
      </section>

      {/* カテゴリ別進捗 */}
      <section className="mb-8">
        <h3 className="text-lg font-bold text-earth-700 mb-4">カテゴリ別</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORY_INFO.map((category) => {
            const catProgress = getCategoryProgress(category.id);
            return (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <h4 className="font-bold text-earth-700">{category.name}</h4>
                    <p className="text-xs text-earth-500">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-earth-100 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full bg-${category.color}-500 transition-all duration-500`}
                    style={{ width: `${catProgress.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-earth-600">
                  {catProgress.collected} / {catProgress.total} 枚
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* アクションボタン */}
      <section className="grid grid-cols-2 gap-4">
        <Link
          href="/quiz"
          className="bg-gradient-to-r from-wheat-500 to-wheat-600 text-white rounded-xl p-6 text-center hover:from-wheat-600 hover:to-wheat-700 transition-all shadow-md"
        >
          <span className="text-3xl block mb-2">❓</span>
          <span className="font-bold">クイズで学ぶ</span>
        </Link>
        <Link
          href="/collection"
          className="bg-gradient-to-r from-silo-500 to-silo-600 text-white rounded-xl p-6 text-center hover:from-silo-600 hover:to-silo-700 transition-all shadow-md"
        >
          <span className="text-3xl block mb-2">📚</span>
          <span className="font-bold">コレクション</span>
        </Link>
      </section>
    </div>
  );
}
