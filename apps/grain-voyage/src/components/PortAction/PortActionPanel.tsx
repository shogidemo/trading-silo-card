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
    <div className="fixed inset-0 bg-retro-navy/70 flex items-center justify-center z-50 p-4">
      <div className="game-panel max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Port header */}
        <div className="bg-retro-navy text-white p-4 flex items-center justify-between shrink-0">
          <h2 className="text-game-heading font-bold flex items-center gap-2">
            <AnchorIcon size={24} />
            {port.name}
          </h2>
          <span className="text-game-small">受入能力: {port.capacity.toLocaleString()}t/ターン</span>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column: Ship status & Refuel */}
            <div className="space-y-4">
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

            </div>

            {/* Right column: Cargo */}
            <div className="space-y-4">
              <div className="game-panel p-3">
                <CargoPanel portId={port.id} />
              </div>
            </div>
          </div>
        </div>

        {/* Depart button - fixed at bottom */}
        <div className="p-4 bg-cream border-t-4 border-retro-navy shrink-0">
          <button
            onClick={onDepart}
            className="btn-game btn-game-primary w-full py-3 text-game-body flex items-center justify-center gap-2"
          >
            <ShipIcon size={20} />
            出発する
          </button>
        </div>
      </div>
    </div>
  );
}
