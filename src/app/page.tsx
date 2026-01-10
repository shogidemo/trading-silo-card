"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCollection } from "@/context/CollectionContext";
import { CATEGORY_INFO } from "@/constants";
import { containerVariants, itemVariants } from "@/lib";

export default function Home() {
  const { getProgress, getCategoryProgress, state } = useCollection();
  const progress = getProgress();

  return (
    <motion.div
      className="max-w-5xl mx-auto px-6 py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
    >
      {/* ヒーローセクション */}
      <motion.section variants={itemVariants} className="relative mb-16">
        <div className="text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 pointer-events-none select-none">
            <span className="font-display text-[120px] sm:text-[180px] text-gold-100 opacity-60 leading-none">
              穀
            </span>
          </div>

          <div className="relative z-10 pt-16 sm:pt-24">
            <motion.h2
              className="font-display text-4xl sm:text-5xl text-concrete-900 mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              穀物の世界を
              <br />
              <span className="text-gold-600">学ぼう</span>
            </motion.h2>

            <motion.p
              className="text-concrete-600 mb-8 max-w-md mx-auto text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              クイズに答えてカードをゲット。
              <br />
              サイロ、穀物、商社について楽しく学べます。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
            >
              <Link
                href="/quiz"
                className="group inline-flex items-center gap-3 bg-concrete-900 hover:bg-concrete-800 text-gold-400 font-display text-lg py-4 px-10 rounded-full shadow-xl transition-all btn-bounce"
              >
                <span>クイズに挑戦する</span>
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 統計セクション */}
      <motion.section variants={itemVariants} className="mb-12">
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          <div className="text-center">
            <p className="font-mono text-3xl sm:text-4xl font-bold text-gold-600">
              {progress.collected}
            </p>
            <p className="text-xs sm:text-sm text-concrete-500 uppercase tracking-wider mt-1">
              Collected
            </p>
          </div>
          <div className="text-center border-x border-concrete-200">
            <p className="font-mono text-3xl sm:text-4xl font-bold text-harvest-500">
              {progress.total}
            </p>
            <p className="text-xs sm:text-sm text-concrete-500 uppercase tracking-wider mt-1">
              Total Cards
            </p>
          </div>
          <div className="text-center">
            <p className="font-mono text-3xl sm:text-4xl font-bold text-concrete-700">
              {state.totalQuizAttempts > 0
                ? Math.round(
                    (state.correctAnswers / state.totalQuizAttempts) * 100
                  )
                : 0}
              <span className="text-xl">%</span>
            </p>
            <p className="text-xs sm:text-sm text-concrete-500 uppercase tracking-wider mt-1">
              Accuracy
            </p>
          </div>
        </div>
      </motion.section>

      {/* プログレスバー */}
      <motion.section variants={itemVariants} className="mb-12">
        <div className="relative">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-concrete-600 uppercase tracking-wider">
              Collection Progress
            </span>
            <span className="font-mono text-lg font-bold text-gold-600">
              {progress.percentage}%
            </span>
          </div>
          <div className="h-3 bg-concrete-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-harvest-400 via-gold-500 to-gold-400 progress-bar"
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.section>

      {/* カテゴリカード */}
      <motion.section variants={itemVariants} className="mb-12">
        <h3 className="font-display text-2xl text-concrete-800 mb-6">
          カテゴリ
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {CATEGORY_INFO.map((category, index) => {
            const catProgress = getCategoryProgress(category.id);
            const colors = {
              silo: "from-slate-600 to-slate-700",
              grain: "from-gold-500 to-gold-600",
              trader: "from-concrete-600 to-concrete-700",
            };

            return (
              <motion.div
                key={category.id}
                className="group relative vintage-border rounded-2xl overflow-hidden bg-concrete-50 transition-all duration-300 hover:shadow-xl"
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div
                  className={`bg-gradient-to-br ${colors[category.id]} p-5 text-white`}
                >
                  <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </span>
                  <h4 className="font-display text-xl">{category.name}</h4>
                  <p className="text-xs opacity-80 uppercase tracking-wider">
                    {category.nameEn}
                  </p>
                </div>

                <div className="p-5">
                  <p className="text-sm text-concrete-600 mb-4">
                    {category.description}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-concrete-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${colors[category.id]}`}
                        style={{ width: `${catProgress.percentage}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm text-concrete-600">
                      {catProgress.collected}/{catProgress.total}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* アクションボタン */}
      <motion.section variants={itemVariants} className="grid grid-cols-2 gap-5">
        <Link
          href="/quiz"
          className="group relative overflow-hidden rounded-2xl p-8 text-center transition-all btn-bounce"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold-400 to-gold-600" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-gold-500 to-gold-700" />

          <div className="relative z-10">
            <svg
              className="w-10 h-10 mx-auto mb-3 text-gold-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
            <span className="font-display text-xl text-gold-900">
              クイズで学ぶ
            </span>
          </div>
        </Link>

        <Link
          href="/collection"
          className="group relative overflow-hidden rounded-2xl p-8 text-center transition-all btn-bounce"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-concrete-700 to-concrete-900" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-concrete-600 to-concrete-800" />

          <div className="relative z-10">
            <svg
              className="w-10 h-10 mx-auto mb-3 text-gold-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
              />
            </svg>
            <span className="font-display text-xl text-gold-400">
              コレクション
            </span>
          </div>
        </Link>
      </motion.section>

      {/* 設定リンク */}
      <motion.section variants={itemVariants} className="mt-8 text-center">
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-concrete-500 hover:text-concrete-700 transition-colors font-display text-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          設定
        </Link>
      </motion.section>
    </motion.div>
  );
}
