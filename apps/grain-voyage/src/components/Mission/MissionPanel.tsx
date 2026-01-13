"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { Mission } from "@/data";

interface ActiveMission extends Mission {
  acceptedAtTurn: number;
  cargoLoaded: boolean;
}

interface MissionPanelProps {
  variant?: "sidebar" | "full";
}

export default function MissionPanel({ variant = "full" }: MissionPanelProps) {
  const {
    state,
    acceptMission,
    completeMission,
    getCompletableMissions,
    canAcceptMission,
    getCurrentPort,
    refreshMissions,
  } = useGame();

  const { availableMissions, activeMissions, completedMissions } = state;
  const currentPort = getCurrentPort();
  const completableMissions = getCompletableMissions();
  const hasAvailableMissions = availableMissions.length > 0;

  // ボーナス残りターンを計算
  const getBonusRemainingTurns = (mission: ActiveMission) => {
    if (mission.bonusTurns === undefined) return null;
    const turnsElapsed = state.turn - mission.acceptedAtTurn;
    return mission.bonusTurns - turnsElapsed;
  };

  // サイドバー版（コンパクト）
  if (variant === "sidebar") {
    return (
      <div className="space-y-3 p-3 bg-white/95 rounded-lg shadow-lg text-sm max-h-[60vh] overflow-y-auto">
        <h3 className="font-bold text-gray-700 border-b pb-2">ミッション</h3>

        {/* 受注中ミッション */}
        {activeMissions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700">
                受注中 ({activeMissions.length}/3)
              </span>
            </div>
            {activeMissions.map((mission) => {
              const bonusRemaining = getBonusRemainingTurns(mission);
              const isCompletable = completableMissions.some(
                (m) => m.id === mission.id
              );
              const isBonusActive =
                bonusRemaining !== null && bonusRemaining >= 0;

              return (
                <div
                  key={mission.id}
                  className={`p-2 rounded border ${
                    isCompletable
                      ? "bg-green-50 border-green-300"
                      : "bg-amber-50 border-amber-200"
                  }`}
                >
                  <p className="font-medium text-xs text-gray-800 truncate">
                    {mission.title}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1 text-xs">
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded">
                      {mission.fromPortName} → {mission.toPortName}
                    </span>
                    <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded">
                      {mission.grainName} {mission.amount}t
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-green-600">
                      ¥{mission.reward.toLocaleString()}
                      {isBonusActive && mission.bonusReward && (
                        <span className="text-green-500">
                          {" "}
                          (+¥{mission.bonusReward.toLocaleString()})
                        </span>
                      )}
                    </span>
                    {isBonusActive && (
                      <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded">
                        残{bonusRemaining}T
                      </span>
                    )}
                  </div>
                  {isCompletable && (
                    <button
                      onClick={() => completeMission(mission.id)}
                      className="w-full mt-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                    >
                      完了！
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 区切り線 */}
        {activeMissions.length > 0 && hasAvailableMissions && (
          <hr className="border-gray-200" />
        )}

        {/* 受注可能ミッション */}
        {hasAvailableMissions && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">
                受注可能
              </span>
              {!canAcceptMission() && (
                <span className="text-xs text-red-500">上限</span>
              )}
            </div>
            {availableMissions.map((mission) => (
              <div
                key={mission.id}
                className="p-2 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <p className="font-medium text-xs text-gray-800 truncate flex-1">
                    {mission.title}
                  </p>
                  <button
                    onClick={() => acceptMission(mission.id)}
                    disabled={!canAcceptMission()}
                    className={`ml-2 px-2 py-0.5 text-xs rounded transition-colors ${
                      canAcceptMission()
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    受注
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-1 text-xs">
                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                    {mission.fromPortName} → {mission.toPortName}
                  </span>
                  <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded">
                    ¥{mission.reward.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
            <button
              onClick={refreshMissions}
              className="w-full py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors"
            >
              更新
            </button>
          </div>
        )}

        {/* 完了数 */}
        {completedMissions.length > 0 && (
          <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
            完了: {completedMissions.length}件 (¥
            {state.totalMissionReward.toLocaleString()})
          </div>
        )}
      </div>
    );
  }

  // フル版（港アクション用）
  return (
    <div className="space-y-4">
      {/* 受注中のミッション（複数表示） */}
      {activeMissions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-amber-800 flex items-center gap-2">
            <span>📦</span>
            受注中のミッション ({activeMissions.length}/3)
          </h3>
          {activeMissions.map((mission) => {
            const bonusRemaining = getBonusRemainingTurns(mission);
            const isCompletable = completableMissions.some(
              (m) => m.id === mission.id
            );
            const isBonusActive =
              bonusRemaining !== null && bonusRemaining >= 0;
            const isLastBonusTurn = isBonusActive && bonusRemaining === 0;

            return (
              <div
                key={mission.id}
                className={`p-4 rounded-lg border-2 ${
                  isCompletable
                    ? "bg-green-50 border-green-400"
                    : "bg-amber-50 border-amber-400"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-800">{mission.title}</p>
                  {isBonusActive && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      ボーナス: 残り{bonusRemaining}ターン
                      {isLastBonusTurn ? " (今回まで)" : ""}
                    </span>
                  )}
                  {bonusRemaining !== null && !isBonusActive && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                      ボーナス期限切れ
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {mission.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {mission.fromPortName} → {mission.toPortName}
                  </span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                    {mission.grainName} {mission.amount}t
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                    報酬: ¥{mission.reward.toLocaleString()}
                    {mission.bonusReward && (
                      <span className="text-green-600">
                        (+¥{mission.bonusReward.toLocaleString()})
                      </span>
                    )}
                  </span>
                </div>

                {/* 現在地が出発港の場合の案内 */}
                {currentPort?.id === mission.fromPortId &&
                  !state.player.cargo.some(
                    (c) => c.grainId === mission.grainId
                  ) && (
                    <p className="text-sm text-blue-600 mt-2">
                      ℹ️ ここで{mission.grainName}を{mission.amount}
                      t積み込んでください
                    </p>
                  )}

                {/* 現在地が目的港の場合 */}
                {currentPort?.id === mission.toPortId && (
                  <div className="mt-3">
                    {isCompletable ? (
                      <button
                        onClick={() => completeMission(mission.id)}
                        className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <span>✅</span>
                        ミッション完了！
                        <span className="text-sm">
                          (¥
                          {(
                            mission.reward +
                            (isBonusActive ? mission.bonusReward || 0 : 0)
                          ).toLocaleString()}
                          獲得)
                        </span>
                      </button>
                    ) : (
                      <p className="text-sm text-red-600">
                        ⚠️ {mission.grainName}が{mission.amount}t必要です
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 利用可能なミッション */}
      {hasAvailableMissions && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <span>📋</span>
            受注可能なミッション
            {!canAcceptMission() && (
              <span className="text-xs text-red-500 ml-2">(受注上限)</span>
            )}
          </h3>
          <AnimatePresence>
            {availableMissions.map((mission) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {mission.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {mission.description}
                    </p>
                  </div>
                  <button
                    onClick={() => acceptMission(mission.id)}
                    disabled={!canAcceptMission()}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors whitespace-nowrap ${
                      canAcceptMission()
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    受注
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                    {mission.fromPortName} → {mission.toPortName}
                  </span>
                  <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded">
                    {mission.grainName} {mission.amount}t
                  </span>
                  <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded">
                    ¥{mission.reward.toLocaleString()}
                    {mission.bonusReward && (
                      <span className="text-green-500">
                        {" "}
                        (+¥{mission.bonusReward.toLocaleString()})
                      </span>
                    )}
                  </span>
                  {mission.bonusTurns && (
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded">
                      {mission.bonusTurns}ターン以内でボーナス
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>内容を更新したい場合はミッションを更新できます</span>
            <button
              onClick={refreshMissions}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
            >
              更新
            </button>
          </div>
        </div>
      )}

      {/* ミッションがない場合 */}
      {activeMissions.length === 0 && availableMissions.length === 0 && (
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-500">利用可能なミッションがありません</p>
          <button
            onClick={refreshMissions}
            className="mt-3 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            ミッションを更新
          </button>
        </div>
      )}

      {/* 完了ミッション数 */}
      {completedMissions.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            🏆 完了したミッション: {completedMissions.length}件
            <span className="ml-2 text-green-600">
              (合計: ¥{state.totalMissionReward.toLocaleString()})
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
