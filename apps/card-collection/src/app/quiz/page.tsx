"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCollection } from "@/context/CollectionContext";
import { CardCategory, Card, Quiz } from "@/types";
import { quizzes, allCards } from "@/data";
import {
  selectQuizAvoidingDuplicates,
  getRandomQuizzes,
  shuffleArray,
} from "@/lib";
import { CardReveal } from "@/components/Card";
import {
  CategorySelect,
  QuizQuestion,
  QuizResult,
  ChallengeSummary,
} from "./_components";

type QuizState = "select" | "quiz" | "result" | "reveal" | "challenge-summary";

function QuizPageContent() {
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
    state,
  } = useCollection();

  // 復習モード用state
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
  const [reviewQuizzes, setReviewQuizzes] = useState<Quiz[]>([]);

  const withShuffledOptions = useCallback(
    (quiz: Quiz): Quiz => ({
      ...quiz,
      options: shuffleArray(quiz.options),
    }),
    []
  );

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

  const handleCategorySelect = (category: CardCategory) => {
    setSelectedCategory(category);
    const quiz = getRandomQuiz(category);
    if (quiz) {
      setCurrentQuiz(withShuffledOptions(quiz));
      setQuizState("quiz");
    }
  };

  const handleReviewStart = useCallback(() => {
    const wrongIds = getWrongAnswerQuizIds();
    const wrongQuizzes = quizzes.filter((q) => wrongIds.includes(q.id));

    if (wrongQuizzes.length === 0) return;

    // 最初の問題のカテゴリを設定
    const shuffledQuizzes = wrongQuizzes.map(withShuffledOptions);
    setSelectedCategory(shuffledQuizzes[0].category);
    setIsReviewMode(true);
    setReviewQuizzes(shuffledQuizzes);
    setCurrentQuestionIndex(0);
    setChallengeResults([]);
    setCurrentQuiz(shuffledQuizzes[0]);
    setQuizState("quiz");
  }, [getWrongAnswerQuizIds, withShuffledOptions]);

  // URLクエリパラメータからカテゴリ/カード/復習モードを読み取り、自動でクイズを開始
  useEffect(() => {
    if (initialCategoryProcessed) return;

    const cardIdParam = searchParams.get("cardId");
    if (cardIdParam) {
      const card = allCards.find((c) => c.id === cardIdParam);
      if (card) {
        const cardQuizzes = quizzes.filter((q) => q.cardId === card.id);
        const unansweredQuizzes = cardQuizzes.filter(
          (q) => !isQuizAnswered(q.id)
        );
        const availableQuizzes =
          unansweredQuizzes.length > 0 ? unansweredQuizzes : cardQuizzes;
        const quiz = selectQuizAvoidingDuplicates(availableQuizzes, []);
        if (quiz) {
          setSelectedCategory(card.category);
          setCurrentQuiz(withShuffledOptions(quiz));
          setQuizState("quiz");
          setInitialCategoryProcessed(true);
          return;
        }
      }
    }

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
        setCurrentQuiz(withShuffledOptions(quiz));
        setQuizState("quiz");
        setInitialCategoryProcessed(true);
        return;
      }
    }

    const modeParam = searchParams.get("mode");
    if (modeParam === "review") {
      const wrongIds = getWrongAnswerQuizIds();
      if (wrongIds.length > 0) {
        handleReviewStart();
        setInitialCategoryProcessed(true);
        return;
      }
    }

    setInitialCategoryProcessed(true);
  }, [
    searchParams,
    initialCategoryProcessed,
    hasCard,
    isQuizAnswered,
    getWrongAnswerQuizIds,
    handleReviewStart,
    withShuffledOptions,
  ]);

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
      const shuffledQuizzes = selectedQuizzes.map(withShuffledOptions);
      setChallengeQuestions(shuffledQuizzes);
      setCurrentQuestionIndex(0);
      setChallengeResults([]);
      setCurrentQuiz(shuffledQuizzes[0]);
      setQuizState("quiz");
    }
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

  const resetQuestionState = () => {
    setSelectedAnswer(null);
    setIsCorrect(false);
    setEarnedCard(null);
    setAnnouncement("");
  };

  const handleNext = () => {
    resetQuestionState();

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

  const handleNextSameCategory = () => {
    if (!selectedCategory || isChallengeMode || isReviewMode) {
      handleNext();
      return;
    }

    resetQuestionState();

    const nextQuiz = getRandomQuiz(selectedCategory);
    if (nextQuiz) {
      setCurrentQuiz(withShuffledOptions(nextQuiz));
      setQuizState("quiz");
      return;
    }

    setCurrentQuiz(null);
    setSelectedCategory(null);
    setQuizState("select");
  };

  const handleCloseReveal = () => {
    setQuizState("result");
  };

  const handleSkipAnswered = () => {
    if (!selectedCategory || !currentQuiz || selectedAnswer !== null) return;
    const nextRecent = [...recentQuizIds.slice(-2), currentQuiz.id];
    setRecentQuizIds(nextRecent);
    const nextQuiz = getRandomQuiz(selectedCategory, nextRecent);
    if (nextQuiz && nextQuiz.id !== currentQuiz.id) {
      setCurrentQuiz(withShuffledOptions(nextQuiz));
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
          <CategorySelect
            key="select"
            onCategorySelect={handleCategorySelect}
            onChallengeStart={handleChallengeStart}
            onReviewStart={handleReviewStart}
            getCategoryProgress={getCategoryProgress}
            categoryStats={state.categoryStats}
            wrongAnswerCount={getWrongAnswerQuizIds().length}
          />
        )}

        {/* クイズ出題 */}
        {quizState === "quiz" && currentQuiz && selectedCategory && (
          <QuizQuestion
            key="quiz"
            quiz={currentQuiz}
            selectedCategory={selectedCategory}
            isChallengeMode={isChallengeMode}
            isReviewMode={isReviewMode}
            currentQuestionIndex={currentQuestionIndex}
            challengeQuestionsLength={challengeQuestions.length}
            reviewQuizzesLength={reviewQuizzes.length}
            onAnswer={handleAnswer}
            onSkip={handleSkipAnswered}
            selectedAnswer={selectedAnswer}
            isCorrect={isCorrect}
            isQuizAnswered={isQuizAnswered(currentQuiz.id)}
            facilityProgress={getFacilityProgress(currentQuiz.cardId)}
          />
        )}

        {/* 結果表示 */}
        {quizState === "result" && currentQuiz && (
          <QuizResult
            key="result"
            quiz={currentQuiz}
            isCorrect={isCorrect}
            earnedCard={earnedCard}
            isChallengeMode={isChallengeMode}
            isReviewMode={isReviewMode}
            currentQuestionIndex={currentQuestionIndex}
            reviewQuizzesLength={reviewQuizzes.length}
            challengeQuestionsLength={challengeQuestions.length}
            facilityProgress={getFacilityProgress(currentQuiz.cardId)}
            onShowCard={handleShowCard}
            onNext={handleNext}
            onNextSameCategory={handleNextSameCategory}
          />
        )}

        {/* カード表示 */}
        {quizState === "reveal" && earnedCard && (
          <CardReveal key="reveal" card={earnedCard} onClose={handleCloseReveal} />
        )}

        {/* チャレンジ/復習サマリー */}
        {quizState === "challenge-summary" && (
          <ChallengeSummary
            key="challenge-summary"
            isReviewMode={isReviewMode}
            questions={isReviewMode ? reviewQuizzes : challengeQuestions}
            challengeResults={challengeResults}
            wrongAnswerCount={getWrongAnswerQuizIds().length}
            onRetry={
              isReviewMode
                ? handleReviewStart
                : () => handleChallengeStart(selectedCategory!)
            }
            onEnd={handleChallengeEnd}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-6 py-10 text-center">
          <div className="animate-pulse">読み込み中...</div>
        </div>
      }
    >
      <QuizPageContent />
    </Suspense>
  );
}
