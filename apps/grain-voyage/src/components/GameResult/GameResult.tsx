"use client";

import { useMemo } from "react";
import { useGame } from "@/context/GameContext";
import Link from "next/link";
import { TargetIcon, CoinIcon, CheckIcon, AlertIcon } from "@/components/Icons";

const rankDescriptions: Record<string, string> = {
  S: "達人ディスパッチャー！",
  A: "優秀なオペレーター！",
  B: "一人前の担当者！",
  C: "もう少し改善できそう",
  D: "再挑戦しよう",
};

function getRank(score: number) {
  if (score >= 5000000) return "S";
  if (score >= 3000000) return "A";
  if (score >= 1000000) return "B";
  if (score >= 0) return "C";
  return "D";
}

export default function GameResult() {
  const { state, resetGame } = useGame();

  const score = useMemo(() => {
    return (
      state.totalReward +
      state.totalBonus -
      state.totalDemurrageCharge -
      state.totalDeliveryCost -
      state.totalPenalty
    );
  }, [
    state.totalReward,
    state.totalBonus,
    state.totalDemurrageCharge,
    state.totalDeliveryCost,
    state.totalPenalty,
  ]);

  const rank = getRank(score);

  return (
    <div className="fixed inset-0 bg-retro-navy/70 flex items-center justify-center z-50 p-4">
      <div className="game-panel max-w-md w-full overflow-hidden">
        <div className="bg-retro-navy text-white p-4 text-center">
          <h2 className="text-game-heading font-bold mb-1 flex items-center justify-center gap-2">
            <TargetIcon size={24} />
            全需要完了！
          </h2>
          <p className="text-game-small text-cream-dark">
            配送オペレーション終了
          </p>
        </div>

        <div className="p-6 text-center border-b-4 border-retro-navy bg-cream-dark">
          <div className="text-7xl font-display font-bold text-gold-dark mb-2">
            {rank}
          </div>
          <p className="text-game-body text-retro-navy font-bold">
            {rankDescriptions[rank]}
          </p>
        </div>

        <div className="p-4 space-y-3">
          <div className="game-panel-gold p-3 flex justify-between items-center">
            <span className="text-game-body font-bold text-retro-navy flex items-center gap-2">
              <CoinIcon size={18} />
              最終スコア
            </span>
            <span className="text-game-heading font-bold text-gold-dark">
              ¥{score.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2 text-game-small">
            <div className="flex justify-between items-center p-2 bg-cream-dark rounded">
              <span className="text-retro-navy">配送報酬</span>
              <span className="font-bold text-seagreen">
                +¥{state.totalReward.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-cream-dark rounded">
              <span className="text-retro-navy">期限内ボーナス</span>
              <span className="font-bold text-gold-dark">
                +¥{state.totalBonus.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-cream-dark rounded">
              <span className="text-retro-navy">滞船料</span>
              <span className="font-bold text-vermillion">
                -¥{state.totalDemurrageCharge.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-cream-dark rounded">
              <span className="text-retro-navy">配送コスト</span>
              <span className="font-bold text-vermillion">
                -¥{state.totalDeliveryCost.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-cream-dark rounded">
              <span className="text-retro-navy">期限超過ペナルティ</span>
              <span className="font-bold text-vermillion">
                -¥{state.totalPenalty.toLocaleString()}
              </span>
            </div>
          </div>

          {state.completedDemands.length > 0 && (
            <div className="mt-3 pt-3 border-t-2 border-retro-navy">
              <h4 className="text-game-small font-bold text-retro-navy mb-2 flex items-center gap-1">
                <CheckIcon size={14} />
                完了した需要
              </h4>
              <div className="space-y-1 max-h-28 overflow-y-auto">
                {state.completedDemands.map((entry, index) => {
                  const totalReward = entry.demand.reward + entry.earlyBonus - entry.penalty;
                  return (
                    <div
                      key={`${entry.demand.id}-${index}`}
                      className="text-game-small p-2 bg-cream rounded flex justify-between items-center"
                    >
                      <span className="truncate flex-1 text-retro-navy">
                        {entry.demand.destinationName}
                      </span>
                      <span className="text-seagreen font-bold ml-2 whitespace-nowrap">
                        ¥{totalReward.toLocaleString()}
                        {entry.earlyBonus > 0 && (
                          <span className="text-gold-dark ml-1">★</span>
                        )}
                        {entry.penalty > 0 && (
                          <span className="text-vermillion ml-1">!</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {state.totalDemurrageCharge > 0 && (
            <div className="mt-3 text-game-small text-retro-navy flex items-center gap-2">
              <AlertIcon size={14} />
              滞船料が発生しました。次回は荷役と配送を優先しましょう。
            </div>
          )}
        </div>

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
