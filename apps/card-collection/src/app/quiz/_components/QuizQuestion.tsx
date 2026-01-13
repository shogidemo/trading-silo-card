"use client";

import { motion } from "framer-motion";
import { CATEGORY_INFO } from "@/constants";
import { CardCategory, Quiz } from "@/types";
import { getCategoryColors } from "@/lib";

interface QuizQuestionProps {
  quiz: Quiz;
  selectedCategory: CardCategory;
  isChallengeMode: boolean;
  isReviewMode: boolean;
  currentQuestionIndex: number;
  challengeQuestionsLength: number;
  reviewQuizzesLength: number;
  onAnswer: (answerIndex: number) => void;
  onSkip: () => void;
  selectedAnswer: number | null;
  isCorrect: boolean;
  isQuizAnswered: boolean;
  facilityProgress: { answered: number; total: number };
}

export default function QuizQuestion({
  quiz,
  selectedCategory,
  isChallengeMode,
  isReviewMode,
  currentQuestionIndex,
  challengeQuestionsLength,
  reviewQuizzesLength,
  onAnswer,
  onSkip,
  selectedAnswer,
  isCorrect,
  isQuizAnswered,
  facilityProgress,
}: QuizQuestionProps) {
  const isE2E = process.env.NEXT_PUBLIC_E2E === "1";

  return (
    <motion.div
      key="quiz"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-gold-200/50">
        {/* 装飾的な背景 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gold-100/30 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-harvest-100/30 to-transparent rounded-full blur-3xl -z-10" />

        {/* カテゴリバッジ */}
        <div className="p-6 pb-0">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 flex-wrap"
          >
            <div
              className={`bg-gradient-to-r ${getCategoryColors(selectedCategory).gradient} text-white px-4 py-2 rounded-full text-sm font-display shadow-lg flex items-center gap-2`}
            >
              <span className="text-lg">
                {CATEGORY_INFO.find((c) => c.id === selectedCategory)?.icon}
              </span>
              {CATEGORY_INFO.find((c) => c.id === selectedCategory)?.name}
            </div>
            {/* チャレンジモード問題番号 */}
            {isChallengeMode && (
              <div className="bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-mono shadow-md">
                {currentQuestionIndex + 1} / {challengeQuestionsLength}
              </div>
            )}
            {/* 復習モード問題番号 */}
            {isReviewMode && (
              <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-mono shadow-md flex items-center gap-1">
                <span>📚</span>
                {currentQuestionIndex + 1} / {reviewQuizzesLength}
              </div>
            )}
            <div className="bg-white/80 text-concrete-700 px-3 py-1 rounded-full text-xs font-mono shadow-sm">
              この施設 {facilityProgress.answered} / {facilityProgress.total}
            </div>
            {!isChallengeMode && !isReviewMode && isQuizAnswered && (
              <>
                <div className="bg-concrete-100 text-concrete-700 px-3 py-1 rounded-full text-xs font-display shadow-sm">
                  回答済み
                </div>
                <button
                  onClick={onSkip}
                  className="text-xs font-display text-concrete-600 hover:text-concrete-800 underline underline-offset-4"
                >
                  スキップ
                </button>
              </>
            )}
          </motion.div>
        </div>

        <div className="p-6 sm:p-8">
          <h3 className="font-display text-2xl sm:text-3xl text-concrete-900 mb-8 leading-relaxed">
            {quiz.question}
          </h3>

          <div className="space-y-3">
            {quiz.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = option.isCorrect;
              const showCorrect = selectedAnswer !== null && isCorrectAnswer;
              const showWrong =
                selectedAnswer !== null && isSelected && !isCorrect;
              const isFaded =
                selectedAnswer !== null && !isSelected && !isCorrectAnswer;

              let baseClass =
                "w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between relative overflow-hidden";

              if (showCorrect) {
                baseClass +=
                  " border-harvest-500 bg-harvest-50 text-harvest-800";
              } else if (showWrong) {
                baseClass += " border-rust-500 bg-rust-50 text-rust-800";
              } else if (isFaded) {
                baseClass +=
                  " border-concrete-200 bg-concrete-50 text-concrete-400 opacity-50";
              } else {
                baseClass +=
                  " border-concrete-200 bg-white hover:border-gold-400 hover:bg-gold-50/30";
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => onAnswer(index)}
                  disabled={selectedAnswer !== null}
                  data-testid={`quiz-option-${index}`}
                  data-correct={isE2E ? option.isCorrect : undefined}
                  className={baseClass}
                  whileHover={selectedAnswer === null ? { scale: 1.01 } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.99 } : {}}
                >
                  <span className="font-display text-lg pr-4">
                    {option.text}
                  </span>
                  {showCorrect && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex-shrink-0 w-8 h-8 bg-harvest-500 rounded-full flex items-center justify-center"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="sr-only">正解</span>
                    </motion.span>
                  )}
                  {showWrong && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex-shrink-0 w-8 h-8 bg-rust-500 rounded-full flex items-center justify-center"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="sr-only">不正解</span>
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
