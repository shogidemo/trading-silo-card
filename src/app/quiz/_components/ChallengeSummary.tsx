"use client";

import { motion } from "framer-motion";
import { Quiz } from "@/types";

interface ChallengeSummaryProps {
  isReviewMode: boolean;
  questions: Quiz[];
  challengeResults: boolean[];
  wrongAnswerCount: number;
  onRetry: () => void;
  onEnd: () => void;
}

export default function ChallengeSummary({
  isReviewMode,
  questions,
  challengeResults,
  wrongAnswerCount,
  onRetry,
  onEnd,
}: ChallengeSummaryProps) {
  const correctCount = challengeResults.filter((r) => r).length;
  const totalCount = questions.length;
  const isPerfect = correctCount === totalCount;
  const isGood = correctCount >= totalCount / 2;

  return (
    <motion.div
      key="challenge-summary"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className={`rounded-3xl shadow-xl p-10 mb-6 ${
          isReviewMode
            ? "bg-gradient-to-br from-rose-50 via-orange-50 to-rose-50"
            : "bg-gradient-to-br from-gold-50 via-harvest-50 to-gold-50"
        }`}
      >
        <motion.span
          className="text-8xl block mb-4 drop-shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          {isPerfect ? "🏆" : isGood ? "🎉" : "💪"}
        </motion.span>
        <h3
          className={`font-display text-4xl mb-2 ${
            isReviewMode ? "text-rose-700" : "text-gold-700"
          }`}
        >
          {isReviewMode ? "復習完了！" : "チャレンジ完了！"}
        </h3>
        <p className="text-2xl font-display text-harvest-600">
          {correctCount} / {totalCount} 正解
        </p>
        {isReviewMode && isPerfect && (
          <p className="text-sm text-rose-600 mt-2">
            すべての復習問題をクリア！
          </p>
        )}
      </motion.div>

      {/* 結果一覧 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-6"
      >
        <h4 className="font-display text-lg text-concrete-800 mb-4">結果一覧</h4>
        <div className="space-y-3">
          {questions.map((quiz, index) => (
            <div
              key={quiz.id}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                challengeResults[index]
                  ? "bg-harvest-50 border border-harvest-200"
                  : "bg-rust-50 border border-rust-200"
              }`}
            >
              <span className="text-xl">
                {challengeResults[index] ? "✓" : "✗"}
              </span>
              <span className="flex-1 text-sm text-left text-concrete-700 truncate">
                {quiz.question}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* アクションボタン */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4"
      >
        {isReviewMode ? (
          // 復習モードの再挑戦ボタン（残りの誤答がある場合のみ）
          wrongAnswerCount > 0 && (
            <motion.button
              onClick={onRetry}
              className="flex-1 bg-gradient-to-r from-rose-400 to-orange-500 hover:from-rose-500 hover:to-orange-600 text-white font-display text-lg py-4 px-6 rounded-xl shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              続けて復習（残り{wrongAnswerCount}問）
            </motion.button>
          )
        ) : (
          <motion.button
            onClick={onRetry}
            className="flex-1 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-gold-900 font-display text-lg py-4 px-6 rounded-xl shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            もう一度チャレンジ
          </motion.button>
        )}
        <motion.button
          onClick={onEnd}
          className="flex-1 bg-concrete-900 hover:bg-concrete-800 text-gold-400 font-display text-lg py-4 px-6 rounded-xl shadow-lg transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          カテゴリ選択に戻る
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
