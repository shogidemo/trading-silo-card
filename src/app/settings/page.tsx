"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCollection } from "@/context/CollectionContext";
import { containerVariants, itemVariants } from "@/lib";
import { STORAGE_KEY } from "@/constants";
import { CollectionState } from "@/types";
import { useModalAccessibility } from "@/hooks";

export default function SettingsPage() {
  const { state, resetCollection, getProgress, getCategoryAccuracy } =
    useCollection();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [importMessage, setImportMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progress = getProgress();
  const handleCloseResetConfirm = useCallback(
    () => setShowResetConfirm(false),
    [setShowResetConfirm]
  );
  const { modalRef, handleKeyDown } = useModalAccessibility(
    showResetConfirm,
    handleCloseResetConfirm
  );
  const resetTitleId = "reset-confirm-title";

  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `grain-card-collection-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content) as CollectionState;

        // 基本的なバリデーション
        if (
          !imported.collectedCardIds ||
          !Array.isArray(imported.collectedCardIds)
        ) {
          throw new Error("Invalid data format: collectedCardIds is missing");
        }

        // localStorageに保存
        localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));

        setImportStatus("success");
        setImportMessage("データをインポートしました。ページをリロードします...");

        // リロードして新しいデータを反映
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        setImportStatus("error");
        setImportMessage(
          error instanceof Error
            ? `インポートエラー: ${error.message}`
            : "不明なエラーが発生しました"
        );
      }
    };
    reader.readAsText(file);

    // ファイル入力をリセット
    event.target.value = "";
  };

  const handleReset = () => {
    resetCollection();
    setShowResetConfirm(false);
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto px-6 py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
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

      {/* ヘッダー */}
      <motion.div variants={itemVariants} className="mb-10">
        <h1 className="font-display text-3xl sm:text-4xl text-concrete-900 mb-2">
          設定
        </h1>
        <p className="text-concrete-600">
          データの管理とリセットができます
        </p>
      </motion.div>

      {/* 現在の進捗状況 */}
      <motion.section
        variants={itemVariants}
        className="bg-concrete-50 rounded-2xl p-6 mb-8 vintage-border"
      >
        <h2 className="font-display text-xl text-concrete-800 mb-4">
          現在の進捗
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-concrete-500 mb-1">収集カード</p>
            <p className="font-mono text-2xl text-gold-600">
              {progress.collected}/{progress.total}
            </p>
          </div>
          <div>
            <p className="text-sm text-concrete-500 mb-1">正答率</p>
            <p className="font-mono text-2xl text-harvest-600">
              {state.totalQuizAttempts > 0
                ? Math.round(
                    (state.correctAnswers / state.totalQuizAttempts) * 100
                  )
                : 0}
              %
            </p>
          </div>
          <div>
            <p className="text-sm text-concrete-500 mb-1">総回答数</p>
            <p className="font-mono text-2xl text-concrete-700">
              {state.totalQuizAttempts}
            </p>
          </div>
          <div>
            <p className="text-sm text-concrete-500 mb-1">復習待ち</p>
            <p className="font-mono text-2xl text-rose-500">
              {state.wrongAnswerQuizIds.length}
            </p>
          </div>
        </div>

        {/* カテゴリ別正答率 */}
        <div className="mt-6 pt-6 border-t border-concrete-200">
          <h3 className="text-sm font-display text-concrete-600 mb-3">
            カテゴリ別正答率
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {(["silo", "grain", "trader"] as const).map((category) => {
              const accuracy = getCategoryAccuracy(category);
              const labels = {
                silo: { name: "サイロ", icon: "🏭" },
                grain: { name: "穀物", icon: "🌾" },
                trader: { name: "商社", icon: "🏢" },
              };
              return (
                <div key={category} className="text-center">
                  <span className="text-2xl">{labels[category].icon}</span>
                  <p className="font-mono text-lg text-concrete-700">
                    {accuracy}%
                  </p>
                  <p className="text-xs text-concrete-500">
                    {labels[category].name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* データ管理 */}
      <motion.section variants={itemVariants} className="space-y-4">
        <h2 className="font-display text-xl text-concrete-800 mb-4">
          データ管理
        </h2>

        {/* エクスポート */}
        <button
          onClick={handleExport}
          className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-concrete-200 hover:border-gold-300 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📤
            </div>
            <div className="text-left">
              <p className="font-display text-lg text-concrete-800">
                データをエクスポート
              </p>
              <p className="text-sm text-concrete-500">
                JSONファイルとしてダウンロード
              </p>
            </div>
          </div>
          <svg
            className="w-5 h-5 text-concrete-400 group-hover:text-gold-500 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* インポート */}
        <button
          onClick={handleImportClick}
          className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-concrete-200 hover:border-harvest-300 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-harvest-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📥
            </div>
            <div className="text-left">
              <p className="font-display text-lg text-concrete-800">
                データをインポート
              </p>
              <p className="text-sm text-concrete-500">
                以前エクスポートしたデータを復元
              </p>
            </div>
          </div>
          <svg
            className="w-5 h-5 text-concrete-400 group-hover:text-harvest-500 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImportFile}
        />

        {/* インポートステータス */}
        <AnimatePresence>
          {importStatus !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl ${
                importStatus === "success"
                  ? "bg-harvest-50 text-harvest-800 border border-harvest-200"
                  : "bg-rust-50 text-rust-800 border border-rust-200"
              }`}
            >
              {importMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* リセット */}
        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-rust-200 hover:border-rust-400 hover:bg-rust-50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rust-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🗑️
            </div>
            <div className="text-left">
              <p className="font-display text-lg text-rust-700">
                進捗をリセット
              </p>
              <p className="text-sm text-rust-500">
                すべてのデータを削除して最初からやり直す
              </p>
            </div>
          </div>
          <svg
            className="w-5 h-5 text-rust-400 group-hover:text-rust-600 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </motion.section>

      {/* リセット確認モーダル */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            onClick={handleCloseResetConfirm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={resetTitleId}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
            >
              <div className="text-center mb-6">
                <span className="text-6xl block mb-4">⚠️</span>
                <h3
                  id={resetTitleId}
                  className="font-display text-2xl text-concrete-900 mb-2"
                >
                  本当にリセットしますか？
                </h3>
                <p className="text-concrete-600">
                  収集したカード、クイズの記録、復習リストがすべて削除されます。
                  この操作は取り消せません。
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 px-6 rounded-xl border-2 border-concrete-300 text-concrete-700 font-display hover:bg-concrete-50 transition-all"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 px-6 rounded-xl bg-rust-500 text-white font-display hover:bg-rust-600 transition-all"
                >
                  リセットする
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
