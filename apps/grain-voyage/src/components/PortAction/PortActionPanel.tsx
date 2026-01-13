"use client";

import { useGame } from "@/context/GameContext";
import CargoPanel from "./CargoPanel";
import { AnchorIcon, FuelIcon, CargoIcon, CoinIcon, ShipIcon } from "@/components/Icons";

interface PortActionPanelProps {
  onDepart: () => void;
}

export default function PortActionPanel({ onDepart }: PortActionPanelProps) {
  const { state, getCurrentPort, refuel, getCurrentCargoAmount, FUEL_COST_PER_UNIT } = useGame();
  const port = getCurrentPort();

  if (!port) return null;

  const { player } = state;
  const fuelNeeded = player.maxFuel - player.fuel;
  const maxAffordable = Math.floor(player.money / FUEL_COST_PER_UNIT);
  const maxRefuel = Math.min(fuelNeeded, maxAffordable);

  const handleRefuel = (amount: number) => {
    refuel(amount);
  };

  const refuelOptions = [10, 20, 50, maxRefuel].filter(
    (v, i, arr) => v > 0 && v <= maxRefuel && arr.indexOf(v) === i
  );

  return (
    <div className="space-y-4">
      {/* Port header */}
      <div className="game-panel-gold p-3">
        <h2 className="text-game-heading font-bold text-retro-navy flex items-center gap-2">
          <AnchorIcon size={24} />
          {port.name}
        </h2>
        <p className="text-game-small text-retro-navy">
          受入能力: {port.capacity.toLocaleString()}t/ターン
        </p>
      </div>

      {/* Ship status */}
      <div className="game-panel p-3">
        <h3 className="text-game-body font-bold text-retro-navy mb-3 flex items-center gap-2">
          <ShipIcon size={18} />
          船の状態
        </h3>
        <div className="space-y-3">
          {/* Fuel bar */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-game-small text-retro-navy flex items-center gap-1">
                <FuelIcon size={14} />
                燃料
              </span>
              <span className="text-game-small font-bold text-retro-navy">
                {player.fuel}/{player.maxFuel}
              </span>
            </div>
            <div className="progress-game">
              <div
                className="progress-game-fill progress-game-fill-gold"
                style={{ width: `${(player.fuel / player.maxFuel) * 100}%` }}
              />
            </div>
          </div>

          {/* Cargo */}
          <div className="flex justify-between items-center">
            <span className="text-game-small text-retro-navy flex items-center gap-1">
              <CargoIcon size={14} />
              積載量
            </span>
            <span className="badge-game badge-game-seagreen text-game-small py-0.5">
              {getCurrentCargoAmount()}/{player.maxCapacity}t
            </span>
          </div>

          {/* Money */}
          <div className="flex justify-between items-center">
            <span className="text-game-small text-retro-navy flex items-center gap-1">
              <CoinIcon size={14} />
              所持金
            </span>
            <span className="badge-game badge-game-gold text-game-small py-0.5">
              ¥{player.money.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Refuel section */}
      <div className="game-panel p-3">
        <h3 className="text-game-body font-bold text-retro-navy mb-2 flex items-center gap-2">
          <FuelIcon size={18} />
          燃料補給
          <span className="text-game-small font-normal">({FUEL_COST_PER_UNIT}円/1燃料)</span>
        </h3>
        {fuelNeeded === 0 ? (
          <p className="text-game-small text-seagreen font-bold">燃料は満タンです！</p>
        ) : maxAffordable === 0 ? (
          <p className="text-game-small text-vermillion font-bold">お金が足りません</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {refuelOptions.map((amount) => (
              <button
                key={amount}
                onClick={() => handleRefuel(amount)}
                className="btn-game btn-game-gold py-1.5 px-3 text-game-small"
              >
                +{amount} (¥{(amount * FUEL_COST_PER_UNIT).toLocaleString()})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cargo section */}
      <div className="game-panel p-3">
        <CargoPanel portId={port.id} />
      </div>

      {/* Depart button */}
      <button
        onClick={onDepart}
        className="btn-game btn-game-primary w-full py-3 text-game-body flex items-center justify-center gap-2"
      >
        <ShipIcon size={20} />
        出発する
      </button>
    </div>
  );
}
