"use client";

import { useGame } from "@/context/GameContext";
import { TargetIcon } from "@/components/Icons";

export default function DemandPanel() {
  const { state } = useGame();
  const visible = state.visibleDemands;

  return (
    <div className="game-panel p-4">
      <h3 className="text-game-body font-bold text-retro-navy flex items-center gap-2 mb-3">
        <TargetIcon size={18} />
        需要一覧
      </h3>
      {visible.length === 0 ? (
        <p className="text-game-small text-retro-navy-lighter">
          現在表示中の需要はありません。
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((demand) => {
            const remaining = demand.amount - demand.fulfilledAmount;
            const isLate = state.turn > demand.deadline;
            return (
              <div key={demand.id} className="bg-cream-dark rounded p-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-game-body font-bold text-retro-navy">
                    {demand.destinationName}
                  </h4>
                  <span className={`badge-game text-game-small py-0.5 ${isLate ? "badge-game-vermillion" : "badge-game-seagreen"}`}>
                    期限 T{demand.deadline}
                  </span>
                </div>
                <div className="mt-2 text-game-small text-retro-navy space-y-1">
                  <div className="flex items-center justify-between">
                    <span>穀物</span>
                    <span className="font-bold">{demand.grainName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>残量</span>
                    <span className="font-bold">{remaining.toLocaleString()}t</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>報酬</span>
                    <span className="font-bold text-seagreen">¥{demand.reward.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-3 text-game-small text-retro-navy-lighter">
        表示中: {visible.length}件 / 待機: {state.pendingDemands.length}件
      </div>
    </div>
  );
}
