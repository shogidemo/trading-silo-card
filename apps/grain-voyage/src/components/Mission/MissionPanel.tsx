"use client";

import { useGame } from "@/context/GameContext";
import { CargoIcon, CheckIcon, AlertIcon, TargetIcon, CoinIcon } from "@/components/Icons";

export default function MissionPanel() {
  const {
    state,
    acceptMission,
    completeMission,
    canCompleteMission,
    getCurrentPort,
    refreshMissions,
  } = useGame();

  const { availableMissions, activeMission, completedMissions } = state;
  const currentPort = getCurrentPort();
  const canComplete = canCompleteMission();
  const hasAvailableMissions = availableMissions.length > 0;

  const getBonusRemainingTurns = () => {
    if (!activeMission || activeMission.bonusTurns === undefined) return null;
    const turnsElapsed = state.turn - activeMission.acceptedAtTurn;
    return activeMission.bonusTurns - turnsElapsed;
  };

  const bonusRemaining = getBonusRemainingTurns();
  const hasBonus = bonusRemaining !== null;
  const isBonusActive = hasBonus && bonusRemaining >= 0;
  const isLastBonusTurn = isBonusActive && bonusRemaining === 0;

  return (
    <div className="space-y-3">
      {/* Active mission */}
      {activeMission && (
        <div className="game-panel-gold p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-game-body font-bold text-retro-navy flex items-center gap-2">
              <CargoIcon size={18} />
              受注中
            </h3>
            {isBonusActive && (
              <span className="badge-game badge-game-seagreen text-game-small py-0.5">
                ボーナス残り{bonusRemaining}ターン
                {isLastBonusTurn ? " (今回まで)" : ""}
              </span>
            )}
            {hasBonus && !isBonusActive && (
              <span className="badge-game text-game-small py-0.5" style={{ background: "#e0e0e0", borderColor: "#9e9e9e", color: "#616161" }}>
                期限切れ
              </span>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-game-body font-bold text-retro-navy">{activeMission.title}</p>
            <p className="text-game-small text-retro-navy">{activeMission.description}</p>
            <div className="flex flex-wrap gap-2">
              <span className="badge-game badge-game-seagreen text-game-small py-0.5">
                {activeMission.fromPortName} → {activeMission.toPortName}
              </span>
              <span className="badge-game badge-game-vermillion text-game-small py-0.5">
                {activeMission.grainName} {activeMission.amount}t
              </span>
            </div>
            <div className="flex items-center gap-1 text-game-small text-retro-navy">
              <CoinIcon size={14} />
              報酬: ¥{activeMission.reward.toLocaleString()}
              {activeMission.bonusReward && (
                <span className="text-seagreen">
                  (+¥{activeMission.bonusReward.toLocaleString()})
                </span>
              )}
            </div>

            {/* Hint at origin port */}
            {currentPort?.id === activeMission.fromPortId &&
              !state.player.cargo.some(
                (c) => c.grainId === activeMission.grainId
              ) && (
                <p className="text-game-small text-seagreen font-bold mt-2">
                  ここで{activeMission.grainName}を{activeMission.amount}t積み込んでください
                </p>
              )}

            {/* Complete button at destination */}
            {currentPort?.id === activeMission.toPortId && (
              <div className="mt-3">
                {canComplete ? (
                  <button
                    onClick={completeMission}
                    className="btn-game btn-game-gold w-full py-2 flex items-center justify-center gap-2"
                  >
                    <CheckIcon size={18} />
                    ミッション完了！
                    <span className="text-game-small">
                      (¥{(activeMission.reward + (isBonusActive ? activeMission.bonusReward || 0 : 0)).toLocaleString()})
                    </span>
                  </button>
                ) : (
                  <p className="text-game-small text-vermillion font-bold flex items-center gap-1">
                    <AlertIcon size={14} />
                    {activeMission.grainName}が{activeMission.amount}t必要です
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Available missions */}
      {!activeMission && hasAvailableMissions && (
        <div className="space-y-2">
          <h3 className="text-game-body font-bold text-retro-navy flex items-center gap-2">
            <TargetIcon size={18} />
            受注可能なミッション
          </h3>
          {availableMissions.map((mission) => (
            <div
              key={mission.id}
              className="game-panel p-3"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 mr-2">
                  <p className="text-game-body font-bold text-retro-navy">
                    {mission.title}
                  </p>
                  <p className="text-game-small text-retro-navy-lighter">
                    {mission.description}
                  </p>
                </div>
                <button
                  onClick={() => acceptMission(mission.id)}
                  className="btn-game btn-game-primary py-1 px-3 text-game-small"
                >
                  受注
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="badge-game badge-game-seagreen text-game-small py-0.5">
                  {mission.fromPortName} → {mission.toPortName}
                </span>
                <span className="badge-game badge-game-vermillion text-game-small py-0.5">
                  {mission.grainName} {mission.amount}t
                </span>
                <span className="badge-game badge-game-gold text-game-small py-0.5">
                  ¥{mission.reward.toLocaleString()}
                  {mission.bonusReward && (
                    <span> (+¥{mission.bonusReward.toLocaleString()})</span>
                  )}
                </span>
              </div>
              {mission.bonusTurns && (
                <p className="text-game-small text-seagreen mt-1">
                  {mission.bonusTurns}ターン以内でボーナス獲得！
                </p>
              )}
            </div>
          ))}
          <button
            onClick={refreshMissions}
            className="btn-game btn-game-secondary w-full py-2 text-game-small"
          >
            ミッションを更新
          </button>
        </div>
      )}

      {/* No missions */}
      {!activeMission && availableMissions.length === 0 && (
        <div className="game-panel-highlight p-4 text-center">
          <p className="text-game-body text-retro-navy">利用可能なミッションがありません</p>
          <button
            onClick={refreshMissions}
            className="btn-game btn-game-secondary mt-3 text-game-small"
          >
            ミッションを更新
          </button>
        </div>
      )}

      {/* Completed missions count */}
      {completedMissions.length > 0 && (
        <div className="divider-game my-2" />
      )}
      {completedMissions.length > 0 && (
        <p className="text-game-small text-retro-navy flex items-center gap-2">
          <CheckIcon size={14} className="text-seagreen" />
          完了: {completedMissions.length}件
          <span className="badge-game badge-game-gold py-0.5">
            合計 ¥{state.totalMissionReward.toLocaleString()}
          </span>
        </p>
      )}
    </div>
  );
}
