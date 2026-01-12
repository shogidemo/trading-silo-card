"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";

export default function MissionPanel() {
  const {
    state,
    acceptMission,
    completeMission,
    canCompleteMission,
    getCurrentPort,
  } = useGame();

  const { availableMissions, activeMission, completedMissions } = state;
  const currentPort = getCurrentPort();
  const canComplete = canCompleteMission();

  // ボーナス残りターンを計算
  const getBonusRemainingTurns = () => {
    if (!activeMission || !activeMission.bonusTurns) return null;
    const turnsElapsed = state.turn - activeMission.acceptedAtTurn;
    const remaining = activeMission.bonusTurns - turnsElapsed;
    return remaining > 0 ? remaining : 0;
  };

  const bonusRemaining = getBonusRemainingTurns();

  return (
    <div className="space-y-4">
      {/* アクティブなミッション */}
      {activeMission && (
        <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-amber-800 flex items-center gap-2">
              <span>&#x1F4E6;</span>
              受注中のミッション
            </h3>
            {bonusRemaining !== null && bonusRemaining > 0 && (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                ボーナス: 残り{bonusRemaining}ターン
              </span>
            )}
            {bonusRemaining === 0 && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                ボーナス期限切れ
              </span>
            )}
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-gray-800">{activeMission.title}</p>
            <p className="text-sm text-gray-600">{activeMission.description}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                {activeMission.fromPortName} &#x2192; {activeMission.toPortName}
              </span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                {activeMission.grainName} {activeMission.amount}t
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                報酬: &#xA5;{activeMission.reward.toLocaleString()}
                {activeMission.bonusReward && (
                  <span className="text-green-600">
                    (+&#xA5;{activeMission.bonusReward.toLocaleString()})
                  </span>
                )}
              </span>
            </div>

            {/* 現在地が出発港の場合の案内 */}
            {currentPort?.id === activeMission.fromPortId &&
              !state.player.cargo.some(
                (c) => c.grainId === activeMission.grainId
              ) && (
                <p className="text-sm text-blue-600 mt-2">
                  &#x2139;&#xFE0F; ここで{activeMission.grainName}を
                  {activeMission.amount}t積み込んでください
                </p>
              )}

            {/* 現在地が目的港の場合 */}
            {currentPort?.id === activeMission.toPortId && (
              <div className="mt-3">
                {canComplete ? (
                  <button
                    onClick={completeMission}
                    className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>&#x2705;</span>
                    ミッション完了！
                    <span className="text-sm">
                      (&#xA5;
                      {(
                        activeMission.reward +
                        (bonusRemaining && bonusRemaining > 0
                          ? activeMission.bonusReward || 0
                          : 0)
                      ).toLocaleString()}
                      獲得)
                    </span>
                  </button>
                ) : (
                  <p className="text-sm text-red-600">
                    &#x26A0;&#xFE0F; {activeMission.grainName}が
                    {activeMission.amount}t必要です
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 利用可能なミッション */}
      {!activeMission && availableMissions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <span>&#x1F4CB;</span>
            受注可能なミッション
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
                    className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors whitespace-nowrap"
                  >
                    受注
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                    {mission.fromPortName} &#x2192; {mission.toPortName}
                  </span>
                  <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded">
                    {mission.grainName} {mission.amount}t
                  </span>
                  <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded">
                    &#xA5;{mission.reward.toLocaleString()}
                    {mission.bonusReward && (
                      <span className="text-green-500">
                        {" "}
                        (+&#xA5;{mission.bonusReward.toLocaleString()})
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
        </div>
      )}

      {/* ミッションがない場合 */}
      {!activeMission && availableMissions.length === 0 && (
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-500">利用可能なミッションがありません</p>
        </div>
      )}

      {/* 完了ミッション数 */}
      {completedMissions.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            &#x1F3C6; 完了したミッション: {completedMissions.length}件
            <span className="ml-2 text-green-600">
              (合計: &#xA5;{state.totalMissionReward.toLocaleString()})
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
