"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCollection } from "@/context/CollectionContext";
import { CATEGORY_INFO, CardCategory, Card, Quiz } from "@/types";
import { quizzes } from "@/data/quizzes";
import { grains } from "@/data/grains";
import { traders } from "@/data/traders";
import { silos } from "@/data/silos";
import CardReveal from "@/components/Card/CardReveal";

type QuizState = "select" | "quiz" | "result" | "reveal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 12 },
  },
};

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>("select");
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | null>(
    null
  );
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [earnedCard, setEarnedCard] = useState<Card | null>(null);

  const {
    addCard,
    hasCard,
    incrementQuizAttempts,
    incrementCorrectAnswers,
    getCategoryProgress,
  } = useCollection();

  const allCards = useMemo(
    () => [...grains, ...traders, ...silos],
    []
  );

  const getRandomQuiz = (category: CardCategory) => {
    const categoryQuizzes = quizzes.filter((q) => q.category === category);
    const uncollectedQuizzes = categoryQuizzes.filter(
      (q) => !hasCard(q.cardId)
    );
    const availableQuizzes =
      uncollectedQuizzes.length > 0 ? uncollectedQuizzes : categoryQuizzes;

    const randomIndex = Math.floor(Math.random() * availableQuizzes.length);
    return availableQuizzes[randomIndex];
  };

  const handleCategorySelect = (category: CardCategory) => {
    setSelectedCategory(category);
    const quiz = getRandomQuiz(category);
    setCurrentQuiz(quiz);
    setQuizState("quiz");
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    incrementQuizAttempts();

    const correct = currentQuiz!.options[answerIndex].isCorrect;
    setIsCorrect(correct);

    if (correct) {
      incrementCorrectAnswers();
      const card = allCards.find((c) => c.id === currentQuiz!.cardId);
      if (card && !hasCard(card.id)) {
        addCard(card.id);
        setEarnedCard(card);
      }
    }

    setTimeout(() => {
      setQuizState("result");
    }, 1000);
  };

  const handleShowCard = () => {
    if (earnedCard) {
      setQuizState("reveal");
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsCorrect(false);
    setEarnedCard(null);
    setCurrentQuiz(null);
    setSelectedCategory(null);
    setQuizState("select");
  };

  const getCategoryColors = (id: CardCategory) => {
    const colors = {
      silo: {
        gradient: "from-slate-600 to-slate-700",
        bg: "bg-slate-100",
        text: "text-slate-700",
        border: "border-slate-300",
      },
      grain: {
        gradient: "from-gold-500 to-gold-600",
        bg: "bg-gold-50",
        text: "text-gold-700",
        border: "border-gold-300",
      },
      trader: {
        gradient: "from-concrete-600 to-concrete-700",
        bg: "bg-concrete-100",
        text: "text-concrete-700",
        border: "border-concrete-300",
      },
    };
    return colors[id];
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <AnimatePresence mode="wait">
        {/* カテゴリ選択 */}
        {quizState === "select" && (
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
                クイズに正解してカードをゲットしよう
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {CATEGORY_INFO.map((category) => {
                const progress = getCategoryProgress(category.id);
                const colors = getCategoryColors(category.id);
                return (
                  <motion.button
                    key={category.id}
                    variants={itemVariants}
                    onClick={() => handleCategorySelect(category.id)}
                    className="group vintage-border rounded-2xl overflow-hidden bg-concrete-50 text-left transition-all duration-300 hover:shadow-xl"
                    whileHover={{ y: -8 }}
                  >
                    {/* カテゴリヘッダー */}
                    <div className={`bg-gradient-to-br ${colors.gradient} p-5 text-white`}>
                      <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">
                        {category.icon}
                      </span>
                      <h3 className="font-display text-xl">{category.name}</h3>
                      <p className="text-xs opacity-80 uppercase tracking-wider">
                        {category.nameEn}
                      </p>
                    </div>

                    {/* カテゴリ詳細 */}
                    <div className="p-5">
                      <p className="text-sm text-concrete-600 mb-4">
                        {category.description}
                      </p>

                      {/* プログレス */}
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
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* クイズ出題 */}
        {quizState === "quiz" && currentQuiz && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="vintage-border bg-concrete-50 rounded-2xl overflow-hidden mb-6">
              {/* クイズヘッダー */}
              <div className={`bg-gradient-to-r ${getCategoryColors(selectedCategory!).gradient} p-5 text-white`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {CATEGORY_INFO.find((c) => c.id === selectedCategory)?.icon}
                  </span>
                  <div>
                    <span className="text-xs opacity-80 uppercase tracking-wider block">
                      {CATEGORY_INFO.find((c) => c.id === selectedCategory)?.nameEn} Quiz
                    </span>
                    <span className="font-display">
                      {CATEGORY_INFO.find((c) => c.id === selectedCategory)?.name}クイズ
                    </span>
                  </div>
                </div>
              </div>

              {/* 質問 */}
              <div className="p-6">
                <h3 className="font-display text-xl sm:text-2xl text-concrete-900 mb-8 leading-relaxed">
                  {currentQuiz.question}
                </h3>

                {/* 選択肢 */}
                <div className="space-y-3">
                  {currentQuiz.options.map((option, index) => {
                    let styleClass = "bg-white border-concrete-200 hover:border-gold-400 hover:bg-gold-50";
                    let labelClass = "bg-concrete-200 text-concrete-600";

                    if (selectedAnswer !== null) {
                      if (option.isCorrect) {
                        styleClass = "bg-harvest-50 border-harvest-500";
                        labelClass = "bg-harvest-500 text-white";
                      } else if (index === selectedAnswer && !option.isCorrect) {
                        styleClass = "bg-rust-50 border-rust-500";
                        labelClass = "bg-rust-500 text-white";
                      }
                    }

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${styleClass} ${
                          selectedAnswer === null ? "cursor-pointer" : "cursor-default"
                        }`}
                        whileHover={selectedAnswer === null ? { x: 8 } : {}}
                        whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-bold flex-shrink-0 ${labelClass}`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-concrete-800 pt-1">
                          {option.text}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 結果表示 */}
        {quizState === "result" && currentQuiz && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* 結果バナー */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className={`text-center mb-8 p-10 rounded-2xl vintage-border ${
                isCorrect
                  ? "bg-gradient-to-br from-harvest-50 to-gold-50"
                  : "bg-gradient-to-br from-concrete-100 to-concrete-50"
              }`}
            >
              <motion.span
                className="text-7xl block mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                {isCorrect ? "🎉" : "😢"}
              </motion.span>
              <h3 className={`font-display text-3xl mb-2 ${
                isCorrect ? "text-harvest-700" : "text-concrete-600"
              }`}>
                {isCorrect ? "正解！" : "残念..."}
              </h3>
              {earnedCard && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gold-600 font-display text-lg"
                >
                  新しいカードを獲得しました！
                </motion.p>
              )}
            </motion.div>

            {/* 解説 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="vintage-border bg-concrete-50 rounded-2xl p-6 mb-6"
            >
              <h4 className="font-display text-lg text-concrete-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                解説
              </h4>
              <p className="text-concrete-700 leading-relaxed">{currentQuiz.explanation}</p>
            </motion.div>

            {/* アクションボタン */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4"
            >
              {earnedCard && (
                <button
                  onClick={handleShowCard}
                  className="flex-1 bg-gold-500 hover:bg-gold-600 text-gold-900 font-display text-lg py-4 px-6 rounded-xl shadow-lg transition-all btn-bounce"
                >
                  カードを見る
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 bg-concrete-900 hover:bg-concrete-800 text-gold-400 font-display text-lg py-4 px-6 rounded-xl shadow-lg transition-all btn-bounce"
              >
                次のクイズへ
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* カード獲得演出 */}
        {quizState === "reveal" && earnedCard && (
          <CardReveal card={earnedCard} onClose={handleNext} />
        )}
      </AnimatePresence>
    </div>
  );
}
