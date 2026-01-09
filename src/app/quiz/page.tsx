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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {/* カテゴリ選択 */}
        {quizState === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-2xl font-bold text-earth-800 mb-6 text-center">
              カテゴリを選択
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CATEGORY_INFO.map((category) => {
                const progress = getCategoryProgress(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 text-left"
                  >
                    <span className="text-4xl block mb-3">{category.icon}</span>
                    <h3 className="text-xl font-bold text-earth-700 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-earth-500 mb-3">
                      {category.description}
                    </p>
                    <p className="text-xs text-earth-400">
                      {progress.collected}/{progress.total} カード獲得済み
                    </p>
                  </button>
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
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">
                  {CATEGORY_INFO.find((c) => c.id === selectedCategory)?.icon}
                </span>
                <span className="text-sm text-earth-500">
                  {CATEGORY_INFO.find((c) => c.id === selectedCategory)?.name}
                  クイズ
                </span>
              </div>
              <h3 className="text-xl font-bold text-earth-800 mb-6">
                {currentQuiz.question}
              </h3>
              <div className="space-y-3">
                {currentQuiz.options.map((option, index) => {
                  let bgColor = "bg-earth-50 hover:bg-earth-100";
                  if (selectedAnswer !== null) {
                    if (option.isCorrect) {
                      bgColor = "bg-leaf-100 border-leaf-500";
                    } else if (index === selectedAnswer && !option.isCorrect) {
                      bgColor = "bg-red-100 border-red-500";
                    }
                  }
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left p-4 rounded-xl border-2 border-transparent transition-all ${bgColor} ${
                        selectedAnswer === null
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                    >
                      <span className="font-medium text-earth-700">
                        {String.fromCharCode(65 + index)}. {option.text}
                      </span>
                    </button>
                  );
                })}
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
            <div
              className={`text-center mb-6 p-8 rounded-2xl ${
                isCorrect
                  ? "bg-gradient-to-r from-leaf-100 to-wheat-100"
                  : "bg-earth-100"
              }`}
            >
              <span className="text-6xl block mb-4">
                {isCorrect ? "🎉" : "😢"}
              </span>
              <h3
                className={`text-2xl font-bold mb-2 ${
                  isCorrect ? "text-leaf-700" : "text-earth-600"
                }`}
              >
                {isCorrect ? "正解！" : "残念..."}
              </h3>
              {earnedCard && (
                <p className="text-leaf-600 font-bold mb-4">
                  新しいカードを獲得しました！
                </p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h4 className="font-bold text-earth-700 mb-2">解説</h4>
              <p className="text-earth-600">{currentQuiz.explanation}</p>
            </div>

            <div className="flex gap-4">
              {earnedCard && (
                <button
                  onClick={handleShowCard}
                  className="flex-1 bg-wheat-500 hover:bg-wheat-600 text-white font-bold py-4 px-6 rounded-xl transition-colors"
                >
                  カードを見る
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 bg-leaf-600 hover:bg-leaf-700 text-white font-bold py-4 px-6 rounded-xl transition-colors"
              >
                次のクイズへ
              </button>
            </div>
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
