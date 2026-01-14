"use client";

import { useGame } from "@/context/GameContext";
import { calculateDemurrageCharge } from "@/game/demurrage";
import { ShipIcon, AnchorIcon, AlertIcon } from "@/components/Icons";
import { ports } from "@/data";

export default function ShipStatus() {
  const { state } = useGame();
  const ship = state.currentShip;

  if (!ship) {
    return (
      <div className="game-panel p-4">
        <h3 className="text-game-body font-bold text-retro-navy flex items-center gap-2">
          <ShipIcon size={18} />
          船の状態
        </h3>
        <p className="text-game-small text-retro-navy-lighter mt-2">
          次の船の到着を待っています。
        </p>
      </div>
    );
  }

  const port = ports.find((p) => p.id === ship.portId);
  const demurrage = calculateDemurrageCharge(ship.berthingTurn, ship.freeTime);
  const demurrageLabel = demurrage > 0
    ? `¥${demurrage.toLocaleString()}/ターン`
    : "発生なし";

  return (
    <div className="game-panel p-4">
      <h3 className="text-game-body font-bold text-retro-navy flex items-center gap-2 mb-3">
        <ShipIcon size={18} />
        船の状態
      </h3>
      <div className="space-y-3 text-game-small text-retro-navy">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <AnchorIcon size={14} />
            入港先
          </span>
          <span className="font-bold">{port?.name ?? "--"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>穀物</span>
          <span className="font-bold">{ship.grainName}</span>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span>残積載量</span>
            <span className="font-bold">
              {ship.remainingCargo.toLocaleString()} / {ship.totalCargo.toLocaleString()}t
            </span>
          </div>
          <div className="progress-game">
            <div
              className="progress-game-fill progress-game-fill-seagreen"
              style={{
                width: `${
                  (ship.remainingCargo / ship.totalCargo) * 100
                }%`,
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>滞船ターン</span>
          <span className="font-bold">
            {ship.berthingTurn} / {ship.freeTime}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <AlertIcon size={14} />
            滞船料
          </span>
          <span className={`font-bold ${demurrage > 0 ? "text-vermillion" : "text-seagreen"}`}>
            {demurrageLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
