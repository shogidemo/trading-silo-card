"use client";

import { motion } from "framer-motion";
import { useGame, ScoreResult } from "@/context/GameContext";
import Link from "next/link";

const rankColors: Record<ScoreResult["rank"], string> = {
  S: "text-yellow-500",
  A: "text-red-500",
  B: "text-blue-500",
  C: "text-green-500",
  D: "text-gray-500",
};

const rankDescriptions: Record<ScoreResult["rank"], string> = {
  S: "伝説の商人！",
  A: "優秀な航海士！",
  B: "一人前の船長！",
  C: "見習い商人",
  D: "もう一度挑戦しよう",
};

const endReasonText: Record<ScoreResult["endReason"], string> = {
  turn_limit: "ターン上限に達しました",
  fuel_empty: "燃料が尽きました",
  manual: "ゲームを終了しました",
};

export default function GameResult() {
  const { state, resetGame } = useGame();
  const { scoreResult, completedMissions, turn } = state;

  if (!scoreResult) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-ocean-600 to-ocean-700 text-white p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">ゲーム終了</h2>
          <p className="text-ocean-100">{endReasonText[scoreResult.endReason]}</p>
        </div>

        {/* ランク表示 */}
        <div className="p-8 text-center border-b">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className={`text-8xl font-bold ${rankColors[scoreResult.rank]} mb-2`}
          >
            {scoreResult.rank}
          </motion.div>
          <p className="text-lg text-gray-600">{rankDescriptions[scoreResult.rank]}</p>
        </div>

        {/* スコア詳細 */}
        <div className="p-6 space-y-4">
          {/* 最終所持金 */}
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="font-semibold text-gray-700">最終所持金</span>
            <span className="text-xl font-bold text-green-600">
              &#xA5;{scoreResult.finalMoney.toLocaleString()}
            </span>
          </div>

          {/* 詳細 */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">プレイターン</span>
              <span className="font-medium">{turn - 1} / {state.maxTurns}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">完了ミッション</span>
              <span className="font-medium text-blue-600">
                {scoreResult.missionsCompleted}件
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ミッション報酬</span>
              <span className="font-medium text-green-600">
                +&#xA5;{scoreResult.totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ボーナス獲得</span>
              <span className="font-medium text-amber-600">
                {scoreResult.bonusCount}回
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">燃料費</span>
              <span className="font-medium text-red-600">
                -&#xA5;{scoreResult.totalFuelCost.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 完了ミッションリスト */}
          {completedMissions.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">
                完了したミッション
              </h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {completedMissions.map((cm, i) => {
                  const missionReward =
                    cm.mission.reward +
                    (cm.bonusEarned ? cm.mission.bonusReward || 0 : 0);
                  return (
                    <div
                      key={i}
                      className="text-xs p-2 bg-gray-50 rounded flex justify-between items-center"
                    >
                      <span className="truncate flex-1">{cm.mission.title}</span>
                      <span className="text-green-600 ml-2 whitespace-nowrap">
                        &#xA5;{missionReward.toLocaleString()}
                        {cm.bonusEarned && (
                          <span className="text-amber-500">+&#x1F31F;</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className="p-4 bg-gray-50 flex gap-3">
          <Link
            href="/"
            className="flex-1 py-3 text-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            タイトルへ
          </Link>
          <button
            onClick={resetGame}
            className="flex-1 py-3 bg-ocean-600 hover:bg-ocean-700 text-white font-semibold rounded-lg transition-colors"
          >
            もう一度プレイ
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
