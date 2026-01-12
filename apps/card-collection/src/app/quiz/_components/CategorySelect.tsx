"use client";

import { motion } from "framer-motion";
import { CATEGORY_INFO } from "@/constants";
import { CardCategory } from "@/types";
import { containerVariants, itemVariants, getCategoryColors } from "@/lib";

interface CategorySelectProps {
  onCategorySelect: (category: CardCategory) => void;
  onChallengeStart: (category: CardCategory) => void;
  onReviewStart: () => void;
  getCategoryProgress: (category: CardCategory) => {
    collected: number;
    total: number;
    percentage: number;
  };
  wrongAnswerCount: number;
}

export default function CategorySelect({
  onCategorySelect,
  onChallengeStart,
  onReviewStart,
  getCategoryProgress,
  wrongAnswerCount,
}: CategorySelectProps) {
  return (
    <motion.div
      key="select"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
    >
      <motion.div variants={itemVariants} className="text-center mb-10">
        <h2 className="font-display text-3xl sm:text-4xl text-concrete-900 mb-3">
          カテゴリを選択
        </h2>
        <p className="text-concrete-600">
          同じ施設は「初めての正解」でカードをゲットしよう
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CATEGORY_INFO.map((category) => {
          const progress = getCategoryProgress(category.id);
          const colors = getCategoryColors(category.id);
          return (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className="space-y-2"
            >
              <button
                onClick={() => onCategorySelect(category.id)}
                className="group vintage-border rounded-2xl overflow-hidden bg-concrete-50 text-left transition-all duration-300 hover:shadow-xl w-full"
              >
                <div
                  className={`bg-gradient-to-br ${colors.gradient} p-5 text-white`}
                >
                  <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </span>
                  <h3 className="font-display text-xl">{category.name}</h3>
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
                        className={`h-full bg-gradient-to-r ${colors.gradient}`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm text-concrete-600">
                      {progress.collected}/{progress.total}
                    </span>
                  </div>
                </div>
              </button>
              {/* 3問チャレンジボタン */}
              <button
                onClick={() => onChallengeStart(category.id)}
                className={`w-full py-2 px-4 rounded-xl text-sm font-display transition-all bg-gradient-to-r ${colors.gradient} text-white hover:opacity-90 hover:shadow-md`}
              >
                🔥 3問チャレンジ
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* 復習モードボタン */}
      {wrongAnswerCount > 0 && (
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <button
            onClick={onReviewStart}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-display transition-all bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:opacity-90 hover:shadow-xl shadow-lg"
          >
            <span className="text-2xl">📚</span>
            復習モード
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
              {wrongAnswerCount}問
            </span>
          </button>
          <p className="text-sm text-concrete-500 mt-2">
            間違えた問題を復習して克服しよう
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
