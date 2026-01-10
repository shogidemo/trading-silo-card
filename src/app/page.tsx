"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCollection } from "@/context/CollectionContext";
import { CATEGORY_INFO } from "@/constants";
import { CardCategory, Card, Quiz } from "@/types";
import { quizzes, allCards } from "@/data";
import { containerVariants, itemVariants, getCategoryColors } from "@/lib";
import CardReveal from "@/components/Card/CardReveal";
import FlipCard from "@/components/Card/FlipCard";

type ViewMode = "home" | "quiz" | "collection";
type QuizState = "select" | "quiz" | "result" | "reveal";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("home");

  return (
    <AnimatePresence mode="wait">
      {viewMode === "home" && (
        <HomeView key="home" onNavigate={setViewMode} />
      )}
      {viewMode === "quiz" && (
        <QuizView key="quiz" onBack={() => setViewMode("home")} />
      )}
      {viewMode === "collection" && (
        <CollectionView key="collection" onBack={() => setViewMode("home")} />
      )}
    </AnimatePresence>
  );
}

// ホームビュー
function HomeView({ onNavigate }: { onNavigate: (mode: ViewMode) => void }) {
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
              <button
                onClick={() => onNavigate("quiz")}
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
              </button>
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
                ? Math.round((state.correctAnswers / state.totalQuizAttempts) * 100)
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
        <button
          onClick={() => onNavigate("quiz")}
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
        </button>

        <button
          onClick={() => onNavigate("collection")}
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
        </button>
      </motion.section>
    </motion.div>
  );
}

// クイズビュー
function QuizView({ onBack }: { onBack: () => void }) {
  const [quizState, setQuizState] = useState<QuizState>("select");
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | null>(null);
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

  const getRandomQuiz = (category: CardCategory) => {
    const categoryQuizzes = quizzes.filter((q) => q.category === category);
    const uncollectedQuizzes = categoryQuizzes.filter((q) => !hasCard(q.cardId));
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

  return (
    <motion.div
      className="max-w-4xl mx-auto px-6 py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* 戻るボタン */}
      <motion.button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-concrete-500 hover:text-concrete-700 transition-colors font-display"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        ホームに戻る
      </motion.button>

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
                    <div className={`bg-gradient-to-br ${colors.gradient} p-5 text-white`}>
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
            <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-gold-200/50">
              {/* 装飾的な背景 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gold-100/30 to-transparent rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-harvest-100/30 to-transparent rounded-full blur-3xl -z-10" />

              {/* カテゴリバッジ */}
              <div className="p-6 pb-0">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2"
                >
                  <div className={`bg-gradient-to-r ${getCategoryColors(selectedCategory!).gradient} text-white px-4 py-2 rounded-full text-sm font-display shadow-lg flex items-center gap-2`}>
                    <span className="text-lg">
                      {CATEGORY_INFO.find((c) => c.id === selectedCategory)?.icon}
                    </span>
                    {CATEGORY_INFO.find((c) => c.id === selectedCategory)?.name}
                  </div>
                </motion.div>
              </div>

              <div className="p-6 sm:p-8">
                <h3 className="font-display text-2xl sm:text-3xl text-concrete-900 mb-8 leading-relaxed">
                  {currentQuiz.question}
                </h3>

                <div className="space-y-3">
                  {currentQuiz.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectAnswer = option.isCorrect;
                    const showCorrect = selectedAnswer !== null && isCorrectAnswer;
                    const showWrong = selectedAnswer !== null && isSelected && !isCorrect;
                    const isFaded = selectedAnswer !== null && !isSelected && !isCorrectAnswer;

                    let baseClass = "w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between relative overflow-hidden";

                    if (selectedAnswer === null) {
                      baseClass += " bg-gradient-to-r from-concrete-50 to-white border-concrete-200 hover:border-gold-400 hover:shadow-lg cursor-pointer";
                    } else if (showCorrect) {
                      baseClass += " bg-gradient-to-r from-harvest-500 to-harvest-600 border-harvest-400 text-white shadow-xl scale-[1.02]";
                    } else if (showWrong) {
                      baseClass += " bg-gradient-to-r from-rust-500 to-rust-600 border-rust-400 text-white shadow-xl";
                    } else if (isFaded) {
                      baseClass += " bg-concrete-100 border-concrete-200 opacity-40";
                    } else {
                      baseClass += " bg-white border-concrete-200";
                    }

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={baseClass}
                        whileHover={selectedAnswer === null ? { x: 8, scale: 1.01 } : {}}
                        whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: isFaded ? 0.4 : 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        {/* シマーエフェクト（正解時） */}
                        {showCorrect && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: ['-200%', '200%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                          />
                        )}

                        <span className={`pr-4 font-medium relative z-10 ${showCorrect || showWrong ? 'text-white' : 'text-concrete-800'}`}>
                          {option.text}
                        </span>

                        {/* 正解/不正解アイコン */}
                        {showCorrect && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="relative z-10"
                          >
                            <svg className="w-7 h-7 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </motion.div>
                        )}
                        {showWrong && (
                          <motion.div
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="relative z-10"
                          >
                            <svg className="w-7 h-7 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </motion.div>
                        )}
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
              className={`text-center mb-8 p-10 rounded-3xl shadow-xl ${
                isCorrect
                  ? "bg-gradient-to-br from-harvest-50 via-gold-50 to-harvest-50"
                  : "bg-gradient-to-br from-concrete-100 via-concrete-50 to-concrete-100"
              }`}
            >
              <motion.span
                className="text-8xl block mb-4 drop-shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                {isCorrect ? "🎉" : "😢"}
              </motion.span>
              <h3 className={`font-display text-4xl mb-2 ${
                isCorrect ? "text-harvest-700" : "text-concrete-600"
              }`}>
                {isCorrect ? "正解！素晴らしい！" : "残念..."}
              </h3>
              {earnedCard && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gold-600 font-display text-xl"
                >
                  新しいカードを獲得しました！
                </motion.p>
              )}
            </motion.div>

            {/* 解説パネル - Figmaスタイル */}
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
              className="relative overflow-hidden rounded-2xl mb-6"
            >
              <div className={`p-6 border-l-4 rounded-2xl shadow-lg ${
                isCorrect
                  ? "bg-gradient-to-br from-harvest-50 to-gold-50 border-harvest-500"
                  : "bg-gradient-to-br from-concrete-50 to-gold-50/30 border-gold-500"
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl shadow-md ${
                    isCorrect ? "bg-harvest-500" : "bg-gold-500"
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className={`text-xl font-display font-bold mb-2 ${
                      isCorrect ? "text-harvest-800" : "text-concrete-800"
                    }`}>
                      {isCorrect ? "学習ポイント" : "正解を覚えよう"}
                    </div>
                    <p className={`leading-relaxed font-medium ${
                      isCorrect ? "text-harvest-700" : "text-concrete-700"
                    }`}>
                      {currentQuiz.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* アクションボタン */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4"
            >
              {earnedCard && (
                <motion.button
                  onClick={handleShowCard}
                  className="flex-1 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-gold-900 font-display text-lg py-4 px-6 rounded-xl shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  カードを見る
                </motion.button>
              )}
              <motion.button
                onClick={handleNext}
                className="flex-1 bg-concrete-900 hover:bg-concrete-800 text-gold-400 font-display text-lg py-4 px-6 rounded-xl shadow-lg transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                次のクイズへ
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* カード獲得演出 */}
        {quizState === "reveal" && earnedCard && (
          <CardReveal card={earnedCard} onClose={handleNext} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// コレクションビュー
function CollectionView({ onBack }: { onBack: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | "all">("all");
  const { hasCard, getProgress, getCategoryProgress } = useCollection();

  const filteredCards = useMemo(() => {
    if (selectedCategory === "all") return allCards;
    return allCards.filter((card) => card.category === selectedCategory);
  }, [selectedCategory]);

  const progress = getProgress();

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
    >
      {/* 戻るボタン */}
      <motion.button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-concrete-500 hover:text-concrete-700 transition-colors font-display"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        ホームに戻る
      </motion.button>

      {/* ヘッダー */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-3xl sm:text-4xl text-concrete-900">
            コレクション
          </h2>
          <div className="text-right">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-harvest-400 rounded-2xl blur-lg opacity-30" />
              <div className="relative bg-gradient-to-r from-gold-500 to-harvest-500 text-white px-5 py-2 rounded-2xl shadow-lg">
                <p className="font-mono text-2xl font-bold">
                  {progress.collected}
                  <span className="text-white/70 mx-1">/</span>
                  {progress.total}
                </p>
                <p className="text-xs opacity-90 uppercase tracking-wider">
                  cards collected
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="h-3 bg-concrete-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-harvest-400 via-gold-500 to-gold-400 progress-bar"
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="absolute right-0 top-4 font-mono text-sm font-bold text-gold-600">
            {progress.percentage}%
          </span>
        </div>
      </motion.div>

      {/* フィルター - 改善版 */}
      <motion.div variants={itemVariants} className="flex gap-3 mb-10 overflow-x-auto pb-2">
        <motion.button
          onClick={() => setSelectedCategory("all")}
          className={`px-6 py-3 rounded-2xl text-sm font-display whitespace-nowrap transition-all shadow-md ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-gold-500 to-gold-600 text-white"
              : "bg-white text-concrete-600 hover:bg-concrete-50 border-2 border-concrete-200 hover:border-gold-300"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          すべて
          <span className="ml-2 font-mono text-xs opacity-80">
            {progress.collected}/{progress.total}
          </span>
        </motion.button>
        {CATEGORY_INFO.map((category) => {
          const catProgress = getCategoryProgress(category.id);
          const isActive = selectedCategory === category.id;
          const colors = getCategoryColors(category.id);
          return (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-3 rounded-2xl text-sm font-display whitespace-nowrap transition-all shadow-md flex items-center gap-2 ${
                isActive
                  ? `bg-gradient-to-r ${colors.gradient} text-white`
                  : "bg-white text-concrete-600 hover:bg-concrete-50 border-2 border-concrete-200 hover:border-gold-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
              <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${
                isActive ? "bg-white/20" : "bg-concrete-100"
              }`}>
                {catProgress.collected}/{catProgress.total}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* カード一覧 - 改善版 */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
      >
        {filteredCards.map((card) => {
          const isCollected = hasCard(card.id);

          return (
            <motion.div
              key={card.id}
              variants={itemVariants}
              whileHover={isCollected ? { y: -8, scale: 1.03, rotateY: 3 } : {}}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <FlipCard card={card} isCollected={isCollected} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* 空状態 */}
      {filteredCards.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <span className="text-6xl block mb-4 opacity-30">📦</span>
          <p className="text-concrete-500 font-display">
            このカテゴリにはカードがありません
          </p>
        </motion.div>
      )}

      {/* コレクション統計 */}
      <motion.div
        variants={itemVariants}
        className="mt-12 vintage-border rounded-2xl p-6 bg-concrete-50"
      >
        <h3 className="font-display text-xl text-concrete-800 mb-4">
          コレクション統計
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {CATEGORY_INFO.map((category) => {
            const catProgress = getCategoryProgress(category.id);
            const colors = getCategoryColors(category.id);
            return (
              <div key={category.id} className="text-center">
                <span className="text-3xl block mb-2">{category.icon}</span>
                <p className="font-mono text-lg text-concrete-700">
                  {catProgress.collected}/{catProgress.total}
                </p>
                <div className="mt-2 h-1 bg-concrete-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.gradient}`}
                    style={{ width: `${catProgress.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-concrete-500 mt-1 uppercase tracking-wider">
                  {category.nameEn}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
