"use client";

import { motion } from "framer-motion";
import { Quiz, Card } from "@/types";

interface QuizResultProps {
  quiz: Quiz;
  isCorrect: boolean;
  earnedCard: Card | null;
  isChallengeMode: boolean;
  isReviewMode: boolean;
  currentQuestionIndex: number;
  reviewQuizzesLength: number;
  challengeQuestionsLength: number;
  facilityProgress: { answered: number; total: number };
  onShowCard: () => void;
  onNext: () => void;
}

export default function QuizResult({
  quiz,
  isCorrect,
  earnedCard,
  isChallengeMode,
  isReviewMode,
  currentQuestionIndex,
  reviewQuizzesLength,
  challengeQuestionsLength,
  facilityProgress,
  onShowCard,
  onNext,
}: QuizResultProps) {
  const getNextButtonText = () => {
    if (isChallengeMode || isReviewMode) {
      const totalQuestions = isReviewMode
        ? reviewQuizzesLength
        : challengeQuestionsLength;
      return currentQuestionIndex + 1 < totalQuestions
        ? "次の問題へ"
        : "結果を見る";
    }
    return "次のクイズへ";
  };

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="mb-8"
      >
        {isCorrect ? (
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-harvest-400 to-harvest-600 shadow-xl">
            <span className="text-5xl">🎉</span>
          </div>
        ) : (
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-rust-400 to-rust-600 shadow-xl">
            <span className="text-5xl">😢</span>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-display text-4xl text-concrete-900 mb-4">
          {isCorrect ? "正解！" : "不正解..."}
        </h3>
        {isCorrect && earnedCard && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold-400 to-harvest-500 text-gold-900 font-display shadow-lg mb-4"
          >
            <span className="text-xl">✨</span>
            NEW CARD!
            <span className="text-xl">✨</span>
          </motion.div>
        )}
        {isCorrect && !earnedCard && (
          <p className="text-sm text-concrete-500 mb-4">
            この施設のカードはすでに獲得済みです
          </p>
        )}

        {/* 不正解時に正解を表示 */}
        {!isCorrect && (
          <div className="mb-4 p-4 bg-harvest-50 border border-harvest-200 rounded-xl inline-block">
            <p className="text-harvest-800 font-display">
              正解:{" "}
              <span className="font-bold">
                {quiz.options.find((o) => o.isCorrect)?.text}
              </span>
            </p>
          </div>
        )}

        <div className="bg-concrete-50 rounded-2xl p-6 mb-8 max-w-lg mx-auto">
          <p className="text-concrete-700 leading-relaxed">{quiz.explanation}</p>
          {quiz.sources.length > 0 && (
            <div className="mt-4 text-left">
              <p className="text-xs font-display text-concrete-600">根拠資料</p>
              <ul className="mt-2 space-y-1">
                {quiz.sources.map((source) => (
                  <li key={`${source.url}-${source.title}`} className="text-xs">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-concrete-600 hover:text-concrete-800 underline underline-offset-4 break-words"
                    >
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs text-concrete-500 mt-3">
            この施設の理解度: {facilityProgress.answered} / {facilityProgress.total}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {earnedCard && (
            <motion.button
              onClick={onShowCard}
              className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-gold-900 font-display text-lg py-4 px-8 rounded-xl shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                <span>🎴</span>
                カードを見る
              </span>
            </motion.button>
          )}
          <motion.button
            onClick={onNext}
            className="bg-concrete-900 hover:bg-concrete-800 text-gold-400 font-display text-lg py-4 px-8 rounded-xl shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {getNextButtonText()}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
