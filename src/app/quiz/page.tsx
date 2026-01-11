"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCollection } from "@/context/CollectionContext";
import { CATEGORY_INFO } from "@/constants";
import { CardCategory, Card, Quiz } from "@/types";
import { quizzes, allCards } from "@/data";
import {
  containerVariants,
  itemVariants,
  getCategoryColors,
  selectQuizAvoidingDuplicates,
  getRandomQuizzes,
} from "@/lib";
import CardReveal from "@/components/Card/CardReveal";

type QuizState = "select" | "quiz" | "result" | "reveal" | "challenge-summary";

export default function QuizPage() {
  const searchParams = useSearchParams();
  const [quizState, setQuizState] = useState<QuizState>("select");
  const [initialCategoryProcessed, setInitialCategoryProcessed] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CardCategory | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [earnedCard, setEarnedCard] = useState<Card | null>(null);
  const [announcement, setAnnouncement] = useState<string>("");
  const [recentQuizIds, setRecentQuizIds] = useState<string[]>([]);
  // チャレンジモード用state
  const [isChallengeMode, setIsChallengeMode] = useState<boolean>(false);
  const [challengeQuestions, setChallengeQuestions] = useState<Quiz[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [challengeResults, setChallengeResults] = useState<boolean[]>([]);

  const {
    addCard,
    hasCard,
    incrementQuizAttempts,
    incrementCorrectAnswers,
    getCategoryProgress,
    addWrongAnswer,
    removeWrongAnswer,
    getWrongAnswerQuizIds,
    addAnsweredQuiz,
    isQuizAnswered,
    getAnsweredQuizIds,
  } = useCollection();

  // 復習モード用state
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
  const [reviewQuizzes, setReviewQuizzes] = useState<Quiz[]>([]);

  const getRandomQuiz = (
    category: CardCategory,
    recentIdsOverride?: string[]
  ) => {
    const categoryQuizzes = quizzes.filter((q) => q.category === category);
    const unansweredQuizzes = categoryQuizzes.filter(
      (q) => !isQuizAnswered(q.id)
    );
    // 未獲得カードのクイズを優先（未回答のみ対象）
    const uncollectedQuizzes = unansweredQuizzes.filter(
      (q) => !hasCard(q.cardId)
    );
    const availableQuizzes =
      uncollectedQuizzes.length > 0
        ? uncollectedQuizzes
        : unansweredQuizzes.length > 0
          ? unansweredQuizzes
          : categoryQuizzes;

    // 直近2-3問を除外してランダム選択
    return selectQuizAvoidingDuplicates(
      availableQuizzes,
      recentIdsOverride ?? recentQuizIds
    );
  };

  // URLクエリパラメータからカテゴリを読み取り、自動でクイズを開始
  useEffect(() => {
    if (initialCategoryProcessed) return;

    const categoryParam = searchParams.get("category");
    if (categoryParam && ["silo", "grain", "trader"].includes(categoryParam)) {
      const category = categoryParam as CardCategory;
      const categoryQuizzes = quizzes.filter((q) => q.category === category);
      const unansweredQuizzes = categoryQuizzes.filter(
        (q) => !isQuizAnswered(q.id)
      );
      const uncollectedQuizzes = unansweredQuizzes.filter(
        (q) => !hasCard(q.cardId)
      );
      const availableQuizzes =
        uncollectedQuizzes.length > 0
          ? uncollectedQuizzes
          : unansweredQuizzes.length > 0
            ? unansweredQuizzes
            : categoryQuizzes;

      const quiz = selectQuizAvoidingDuplicates(availableQuizzes, []);
      if (quiz) {
        setSelectedCategory(category);
        setCurrentQuiz(quiz);
        setQuizState("quiz");
      }
      setInitialCategoryProcessed(true);
    }
  }, [searchParams, initialCategoryProcessed, hasCard, isQuizAnswered]);

  const handleCategorySelect = (category: CardCategory) => {
    setSelectedCategory(category);
    const quiz = getRandomQuiz(category);
    if (quiz) {
      setCurrentQuiz(quiz);
      setQuizState("quiz");
    }
  };

  const handleChallengeStart = (category: CardCategory) => {
    setSelectedCategory(category);
    setIsChallengeMode(true);

    // カテゴリ内から3問ランダム選択
    const categoryQuizzes = quizzes.filter((q) => q.category === category);
    const unansweredQuizzes = categoryQuizzes.filter(
      (q) => !isQuizAnswered(q.id)
    );
    const availableQuizzes =
      unansweredQuizzes.length > 0 ? unansweredQuizzes : categoryQuizzes;
    const selectedQuizzes = getRandomQuizzes(
      availableQuizzes,
      3,
      recentQuizIds
    );

    if (selectedQuizzes.length > 0) {
      setChallengeQuestions(selectedQuizzes);
      setCurrentQuestionIndex(0);
      setChallengeResults([]);
      setCurrentQuiz(selectedQuizzes[0]);
      setQuizState("quiz");
    }
  };

  const handleReviewStart = () => {
    const wrongIds = getWrongAnswerQuizIds();
    const wrongQuizzes = quizzes.filter((q) => wrongIds.includes(q.id));

    if (wrongQuizzes.length === 0) return;

    // 最初の問題のカテゴリを設定
    setSelectedCategory(wrongQuizzes[0].category);
    setIsReviewMode(true);
    setReviewQuizzes(wrongQuizzes);
    setCurrentQuestionIndex(0);
    setChallengeResults([]);
    setCurrentQuiz(wrongQuizzes[0]);
    setQuizState("quiz");
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null || !selectedCategory) return;

    setSelectedAnswer(answerIndex);
    incrementQuizAttempts(selectedCategory);
    addAnsweredQuiz(currentQuiz!.id);

    // クイズIDを履歴に追加（直近3問まで保持）
    setRecentQuizIds((prev) => [...prev.slice(-2), currentQuiz!.id]);

    const correct = currentQuiz!.options[answerIndex].isCorrect;
    setIsCorrect(correct);

    // チャレンジ/復習モードの結果を記録
    if (isChallengeMode || isReviewMode) {
      setChallengeResults((prev) => [...prev, correct]);
    }

    // スクリーンリーダー向けアナウンス
    const correctOption = currentQuiz!.options.find((o) => o.isCorrect);
    if (correct) {
      setAnnouncement("正解です！");
      // 正解したら復習リストから削除
      removeWrongAnswer(currentQuiz!.id);
    } else {
      setAnnouncement(
        `不正解です。正解は「${correctOption?.text}」です。`
      );
      // 不正解なら復習リストに追加
      addWrongAnswer(currentQuiz!.id);
    }

    if (correct) {
      incrementCorrectAnswers(selectedCategory);
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
    setAnnouncement("");

    if (isChallengeMode) {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < challengeQuestions.length) {
        // 次の問題へ
        setCurrentQuestionIndex(nextIndex);
        setCurrentQuiz(challengeQuestions[nextIndex]);
        setQuizState("quiz");
      } else {
        // チャレンジ完了 - サマリー表示
        setQuizState("challenge-summary");
      }
    } else if (isReviewMode) {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < reviewQuizzes.length) {
        // 次の復習問題へ（カテゴリも更新）
        setCurrentQuestionIndex(nextIndex);
        const nextQuiz = reviewQuizzes[nextIndex];
        setCurrentQuiz(nextQuiz);
        setSelectedCategory(nextQuiz.category);
        setQuizState("quiz");
      } else {
        // 復習完了 - サマリー表示
        setQuizState("challenge-summary");
      }
    } else {
      // 通常モード: カテゴリ選択に戻る
      setCurrentQuiz(null);
      setSelectedCategory(null);
      setQuizState("select");
    }
  };

  const handleSkipAnswered = () => {
    if (!selectedCategory || !currentQuiz || selectedAnswer !== null) return;
    const nextRecent = [...recentQuizIds.slice(-2), currentQuiz.id];
    setRecentQuizIds(nextRecent);
    const nextQuiz = getRandomQuiz(selectedCategory, nextRecent);
    if (nextQuiz && nextQuiz.id !== currentQuiz.id) {
      setCurrentQuiz(nextQuiz);
      setQuizState("quiz");
      return;
    }
    // これ以上スキップできるクイズがない場合はカテゴリ選択へ戻る
    setCurrentQuiz(null);
    setSelectedCategory(null);
    setQuizState("select");
  };

  const getFacilityProgress = (cardId: string) => {
    const total = quizzes.filter((q) => q.cardId === cardId).length;
    const answeredIds = getAnsweredQuizIds();
    const answered = quizzes.filter(
      (q) => q.cardId === cardId && answeredIds.includes(q.id)
    ).length;
    return { answered, total };
  };

  const handleChallengeEnd = () => {
    // チャレンジ/復習モードを終了して初期状態に戻る
    setIsChallengeMode(false);
    setIsReviewMode(false);
    setChallengeQuestions([]);
    setReviewQuizzes([]);
    setCurrentQuestionIndex(0);
    setChallengeResults([]);
    setCurrentQuiz(null);
    setSelectedCategory(null);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setEarnedCard(null);
    setAnnouncement("");
    setQuizState("select");
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-6 py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* スクリーンリーダー向けアナウンス */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* 戻るボタン */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-concrete-500 hover:text-concrete-700 transition-colors font-display"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          ホームに戻る
        </Link>
      </motion.div>

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
                      onClick={() => handleCategorySelect(category.id)}
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
                      onClick={() => handleChallengeStart(category.id)}
                      className={`w-full py-2 px-4 rounded-xl text-sm font-display transition-all bg-gradient-to-r ${colors.gradient} text-white hover:opacity-90 hover:shadow-md`}
                    >
                      🔥 3問チャレンジ
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* 復習モードボタン */}
            {getWrongAnswerQuizIds().length > 0 && (
              <motion.div variants={itemVariants} className="mt-8 text-center">
                <button
                  onClick={handleReviewStart}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-display transition-all bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:opacity-90 hover:shadow-xl shadow-lg"
                >
                  <span className="text-2xl">📚</span>
                  復習モード
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                    {getWrongAnswerQuizIds().length}問
                  </span>
                </button>
                <p className="text-sm text-concrete-500 mt-2">
                  間違えた問題を復習して克服しよう
                </p>
              </motion.div>
            )}
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
                  className="inline-flex items-center gap-2 flex-wrap"
                >
                  <div
                    className={`bg-gradient-to-r ${getCategoryColors(selectedCategory!).gradient} text-white px-4 py-2 rounded-full text-sm font-display shadow-lg flex items-center gap-2`}
                  >
                    <span className="text-lg">
                      {
                        CATEGORY_INFO.find((c) => c.id === selectedCategory)
                          ?.icon
                      }
                    </span>
                    {CATEGORY_INFO.find((c) => c.id === selectedCategory)?.name}
                  </div>
                  {/* チャレンジモード問題番号 */}
                  {isChallengeMode && (
                    <div className="bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-mono shadow-md">
                      {currentQuestionIndex + 1} / {challengeQuestions.length}
                    </div>
                  )}
                  {/* 復習モード問題番号 */}
                  {isReviewMode && (
                    <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-mono shadow-md flex items-center gap-1">
                      <span>📚</span>
                      {currentQuestionIndex + 1} / {reviewQuizzes.length}
                    </div>
                  )}
                  {currentQuiz && (
                    <div className="bg-white/80 text-concrete-700 px-3 py-1 rounded-full text-xs font-mono shadow-sm">
                      この施設 {getFacilityProgress(currentQuiz.cardId).answered} /
                      {getFacilityProgress(currentQuiz.cardId).total}
                    </div>
                  )}
                  {!isChallengeMode &&
                    !isReviewMode &&
                    isQuizAnswered(currentQuiz.id) && (
                      <>
                        <div className="bg-concrete-100 text-concrete-700 px-3 py-1 rounded-full text-xs font-display shadow-sm">
                          回答済み
                        </div>
                        <button
                          onClick={handleSkipAnswered}
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
                  {currentQuiz.question}
                </h3>

                <div className="space-y-3">
                  {currentQuiz.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectAnswer = option.isCorrect;
                    const showCorrect =
                      selectedAnswer !== null && isCorrectAnswer;
                    const showWrong =
                      selectedAnswer !== null && isSelected && !isCorrect;
                    const isFaded =
                      selectedAnswer !== null &&
                      !isSelected &&
                      !isCorrectAnswer;

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
                        onClick={() => handleAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={baseClass}
                        whileHover={
                          selectedAnswer === null ? { scale: 1.01 } : {}
                        }
                        whileTap={
                          selectedAnswer === null ? { scale: 0.99 } : {}
                        }
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
        )}

        {/* 結果表示 */}
        {quizState === "result" && currentQuiz && (
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
                      {currentQuiz.options.find((o) => o.isCorrect)?.text}
                    </span>
                  </p>
                </div>
              )}

              <div className="bg-concrete-50 rounded-2xl p-6 mb-8 max-w-lg mx-auto">
                <p className="text-concrete-700 leading-relaxed">
                  {currentQuiz.explanation}
                </p>
                {currentQuiz.sources.length > 0 && (
                  <div className="mt-4 text-left">
                    <p className="text-xs font-display text-concrete-600">
                      根拠資料
                    </p>
                    <ul className="mt-2 space-y-1">
                      {currentQuiz.sources.map((source) => (
                        <li
                          key={`${source.url}-${source.title}`}
                          className="text-xs"
                        >
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
                  この施設の理解度:{" "}
                  {getFacilityProgress(currentQuiz.cardId).answered} /
                  {getFacilityProgress(currentQuiz.cardId).total}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {earnedCard && (
                  <motion.button
                    onClick={handleShowCard}
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
                  onClick={handleNext}
                  className="bg-concrete-900 hover:bg-concrete-800 text-gold-400 font-display text-lg py-4 px-8 rounded-xl shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isChallengeMode || isReviewMode
                    ? currentQuestionIndex + 1 <
                      (isReviewMode
                        ? reviewQuizzes.length
                        : challengeQuestions.length)
                      ? "次の問題へ"
                      : "結果を見る"
                    : "次のクイズへ"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* カード表示 */}
        {quizState === "reveal" && earnedCard && (
          <CardReveal card={earnedCard} onClose={handleNext} />
        )}

        {/* チャレンジ/復習サマリー */}
        {quizState === "challenge-summary" && (
          <motion.div
            key="challenge-summary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            {(() => {
              const questions = isReviewMode
                ? reviewQuizzes
                : challengeQuestions;
              const correctCount = challengeResults.filter((r) => r).length;
              const totalCount = questions.length;
              const isPerfect = correctCount === totalCount;
              const isGood = correctCount >= totalCount / 2;

              return (
                <>
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
                    <h4 className="font-display text-lg text-concrete-800 mb-4">
                      結果一覧
                    </h4>
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
                      getWrongAnswerQuizIds().length > 0 && (
                        <motion.button
                          onClick={handleReviewStart}
                          className="flex-1 bg-gradient-to-r from-rose-400 to-orange-500 hover:from-rose-500 hover:to-orange-600 text-white font-display text-lg py-4 px-6 rounded-xl shadow-lg transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          続けて復習（残り{getWrongAnswerQuizIds().length}問）
                        </motion.button>
                      )
                    ) : (
                      <motion.button
                        onClick={() => handleChallengeStart(selectedCategory!)}
                        className="flex-1 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-gold-900 font-display text-lg py-4 px-6 rounded-xl shadow-lg transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        もう一度チャレンジ
                      </motion.button>
                    )}
                    <motion.button
                      onClick={handleChallengeEnd}
                      className="flex-1 bg-concrete-900 hover:bg-concrete-800 text-gold-400 font-display text-lg py-4 px-6 rounded-xl shadow-lg transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      カテゴリ選択に戻る
                    </motion.button>
                  </motion.div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
