"use client";

import { useEffect, useMemo, useState } from "react";
import { useGame } from "@/context/GameContext";
import { CargoIcon } from "@/components/Icons";
import { ports } from "@/data";

export default function UnloadingPanel() {
  const { state, unloadFromShip, getAvailableUnloading, getAvailableSiloSpace } = useGame();
  const ship = state.currentShip;
  const port = ship ? ports.find((p) => p.id === ship.portId) : null;

  const maxUnloadable = useMemo(() => {
    if (!ship || !port) return 0;
    return Math.max(
      0,
      Math.min(
        ship.remainingCargo,
        getAvailableUnloading(),
        getAvailableSiloSpace()
      )
    );
  }, [ship, port, getAvailableUnloading, getAvailableSiloSpace]);

  const [amount, setAmount] = useState(0);

  useEffect(() => {
    setAmount((prev) => {
      if (maxUnloadable <= 0) return 0;
      if (prev <= 0 || prev > maxUnloadable) return maxUnloadable;
      return prev;
    });
  }, [maxUnloadable]);

  if (!ship || !port) {
    return (
      <div className="game-panel p-4">
        <h3 className="text-game-body font-bold text-retro-navy flex items-center gap-2">
          <CargoIcon size={18} />
          荷揚げ
        </h3>
        <p className="text-game-small text-retro-navy-lighter mt-2">
          現在荷揚げ可能な船はありません。
        </p>
      </div>
    );
  }

  const handleUnload = () => {
    if (amount <= 0) return;
    unloadFromShip(amount);
  };

  return (
    <div className="game-panel p-4">
      <h3 className="text-game-body font-bold text-retro-navy flex items-center gap-2 mb-3">
        <CargoIcon size={18} />
        荷揚げ
      </h3>
      <div className="space-y-3 text-game-small text-retro-navy">
        <div className="flex items-center justify-between">
          <span>入港</span>
          <span className="font-bold">{port.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>残積載量</span>
          <span className="font-bold">{ship.remainingCargo.toLocaleString()}t</span>
        </div>
        <div className="flex items-center justify-between">
          <span>本ターン残り荷役</span>
          <span className="font-bold">{getAvailableUnloading().toLocaleString()}t</span>
        </div>
        <div className="flex items-center justify-between">
          <span>サイロ空き</span>
          <span className="font-bold">{getAvailableSiloSpace().toLocaleString()}t</span>
        </div>
        <div>
          <label className="text-game-small font-bold text-retro-navy">荷揚げ量</label>
          <input
            type="number"
            min={0}
            max={maxUnloadable}
            step={500}
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            className="mt-2 w-full rounded border-2 border-retro-navy px-3 py-2 text-game-body"
          />
          <p className="text-game-small text-retro-navy-lighter mt-1">
            最大 {maxUnloadable.toLocaleString()}t
          </p>
        </div>
        <button
          onClick={handleUnload}
          disabled={amount <= 0 || maxUnloadable <= 0}
          className={`btn-game btn-game-gold w-full py-2 ${amount <= 0 || maxUnloadable <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          荷揚げ実行
        </button>
      </div>
    </div>
  );
}
