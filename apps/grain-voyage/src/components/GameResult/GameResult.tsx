"use client";

import { useGame, ScoreResult } from "@/context/GameContext";
import Link from "next/link";
import { ShipIcon, TargetIcon, CoinIcon, FuelIcon, CheckIcon } from "@/components/Icons";

const rankColors: Record<ScoreResult["rank"], string> = {
  S: "text-gold-dark",
  A: "text-vermillion",
  B: "text-retro-navy",
  C: "text-seagreen",
  D: "text-retro-navy-lighter",
};

const rankBackgrounds: Record<ScoreResult["rank"], string> = {
  S: "bg-gold-light",
  A: "bg-vermillion-light",
  B: "bg-cream-dark",
  C: "bg-seagreen-light",
  D: "bg-cream",
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
    <div className="fixed inset-0 bg-retro-navy/70 flex items-center justify-center z-50 p-4">
      <div className="game-panel max-w-md w-full overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-retro-navy text-white p-4 text-center">
          <h2 className="text-game-heading font-bold mb-1 flex items-center justify-center gap-2">
            <TargetIcon size={24} />
            ゲーム終了
          </h2>
          <p className="text-game-small text-cream-dark">
            {endReasonText[scoreResult.endReason]}
          </p>
        </div>

        {/* ランク表示 */}
        <div className={`p-6 text-center border-b-4 border-retro-navy ${rankBackgrounds[scoreResult.rank]}`}>
          <div className={`text-7xl font-display font-bold ${rankColors[scoreResult.rank]} mb-2`}>
            {scoreResult.rank}
          </div>
          <p className="text-game-body text-retro-navy font-bold">
            {rankDescriptions[scoreResult.rank]}
          </p>
        </div>

        {/* スコア詳細 */}
        <div className="p-4 space-y-3">
          {/* 最終所持金 */}
          <div className="game-panel-gold p-3 flex justify-between items-center">
            <span className="text-game-body font-bold text-retro-navy flex items-center gap-2">
              <CoinIcon size={18} />
              最終所持金
            </span>
            <span className="text-game-heading font-bold text-gold-dark">
              ¥{scoreResult.finalMoney.toLocaleString()}
            </span>
          </div>

          {/* 詳細 */}
          <div className="space-y-2 text-game-small">
            <div className="flex justify-between items-center p-2 bg-cream-dark rounded">
              <span className="text-retro-navy">プレイターン</span>
              <span className="font-bold text-retro-navy">
                {turn - 1} / {state.maxTurns}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-cream-dark rounded">
              <span className="text-retro-navy">完了ミッション</span>
              <span className="font-bold text-seagreen">
                {scoreResult.missionsCompleted}件
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-cream-dark rounded">
              <span className="text-retro-navy">ミッション報酬</span>
              <span className="font-bold text-seagreen">
                +¥{scoreResult.totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-cream-dark rounded">
              <span className="text-retro-navy">ボーナス獲得</span>
              <span className="font-bold text-gold-dark">
                {scoreResult.bonusCount}回
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-cream-dark rounded">
              <span className="text-retro-navy">燃料費</span>
              <span className="font-bold text-vermillion">
                -¥{scoreResult.totalFuelCost.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 完了ミッションリスト */}
          {completedMissions.length > 0 && (
            <div className="mt-3 pt-3 border-t-2 border-retro-navy">
              <h4 className="text-game-small font-bold text-retro-navy mb-2 flex items-center gap-1">
                <CheckIcon size={14} />
                完了したミッション
              </h4>
              <div className="space-y-1 max-h-28 overflow-y-auto">
                {completedMissions.map((cm, i) => {
                  const missionReward =
                    cm.mission.reward +
                    (cm.bonusEarned ? cm.mission.bonusReward || 0 : 0);
                  return (
                    <div
                      key={i}
                      className="text-game-small p-2 bg-cream rounded flex justify-between items-center"
                    >
                      <span className="truncate flex-1 text-retro-navy">
                        {cm.mission.title}
                      </span>
                      <span className="text-seagreen font-bold ml-2 whitespace-nowrap">
                        ¥{missionReward.toLocaleString()}
                        {cm.bonusEarned && (
                          <span className="text-gold-dark ml-1">★</span>
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
        <div className="p-4 bg-cream-dark flex gap-3 border-t-4 border-retro-navy">
          <Link
            href="/"
            className="btn-game btn-game-secondary flex-1 py-3 text-center text-game-body"
          >
            タイトルへ
          </Link>
          <button
            onClick={resetGame}
            className="btn-game btn-game-primary flex-1 py-3 text-game-body"
          >
            もう一度プレイ
          </button>
        </div>
      </div>
    </div>
  );
}
