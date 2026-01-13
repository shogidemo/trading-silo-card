"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { getPortStock, GrainStock } from "@/data";
import { CargoIcon, CoinIcon } from "@/components/Icons";

interface CargoPanelProps {
  portId: string;
}

export default function CargoPanel({ portId }: CargoPanelProps) {
  const {
    state,
    loadCargo,
    unloadCargo,
    getCurrentCargoAmount,
    getAvailableCapacity,
  } = useGame();

  const [loadAmounts, setLoadAmounts] = useState<Record<string, number>>({});
  const [unloadAmounts, setUnloadAmounts] = useState<Record<string, number>>({});

  const portStock = getPortStock(portId);
  const { player } = state;
  const currentCargoAmount = getCurrentCargoAmount();
  const availableCapacity = getAvailableCapacity();

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const handleLoadAmountChange = (grainId: string, value: number) => {
    setLoadAmounts((prev) => ({ ...prev, [grainId]: value }));
  };

  const handleUnloadAmountChange = (grainId: string, value: number) => {
    setUnloadAmounts((prev) => ({ ...prev, [grainId]: value }));
  };

  const handleLoad = (grain: GrainStock) => {
    const maxLoad = Math.min(availableCapacity, 100);
    const useSmallStep = maxLoad > 0 && maxLoad < 10;
    const minLoad = maxLoad <= 0 ? 0 : useSmallStep ? 1 : 10;
    const defaultLoad = maxLoad <= 0 ? 0 : useSmallStep ? maxLoad : minLoad;
    const rawAmount = loadAmounts[grain.grainId] ?? defaultLoad;
    const amount = clamp(rawAmount, minLoad, maxLoad);
    const cost = amount * grain.buyPrice;

    if (amount <= 0) return;
    if (amount > availableCapacity) return;
    if (cost > player.money) return;

    loadCargo(grain.grainId, grain.grainName, amount, cost);

    const nextCapacity = Math.max(availableCapacity - amount, 0);
    const nextUseSmallStep = nextCapacity > 0 && nextCapacity < 10;
    const nextDefault = nextUseSmallStep ? nextCapacity : Math.min(10, nextCapacity);
    setLoadAmounts((prev) => ({ ...prev, [grain.grainId]: nextDefault }));
  };

  const handleUnload = (grainId: string, amountOverride?: number) => {
    const cargo = player.cargo.find((c) => c.grainId === grainId);
    if (!cargo) return;

    const rawAmount = amountOverride ?? unloadAmounts[grainId] ?? cargo.amount;
    const amount = clamp(rawAmount, 1, cargo.amount);
    const grainInPort = portStock?.grains.find((g) => g.grainId === grainId);
    const sellPrice = grainInPort?.sellPrice || 0;
    const revenue = amount * sellPrice;

    unloadCargo(grainId, amount, revenue);
    const remainingAmount = Math.max(cargo.amount - amount, 0);
    setUnloadAmounts((prev) => ({ ...prev, [grainId]: remainingAmount }));
  };

  return (
    <div className="space-y-4">
      {/* Cargo status */}
      <div>
        <h3 className="text-game-body font-bold text-retro-navy mb-2 flex items-center gap-2">
          <CargoIcon size={18} />
          積載状況
        </h3>
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-game-small text-retro-navy">積載量</span>
            <span className="text-game-small font-bold text-retro-navy">
              {currentCargoAmount}/{player.maxCapacity}t
            </span>
          </div>
          <div className="progress-game">
            <div
              className="progress-game-fill progress-game-fill-seagreen"
              style={{ width: `${(currentCargoAmount / player.maxCapacity) * 100}%` }}
            />
          </div>
        </div>
        {player.cargo.length > 0 ? (
          <div className="space-y-2">
            {player.cargo.map((cargo) => {
              const grainInPort = portStock?.grains.find(
                (g) => g.grainId === cargo.grainId
              );
              const sellPrice = grainInPort?.sellPrice;
              const unloadAmount = clamp(
                unloadAmounts[cargo.grainId] ?? cargo.amount,
                1,
                cargo.amount
              );
              const unloadRevenue = sellPrice ? unloadAmount * sellPrice : 0;

              return (
                <div key={cargo.grainId} className="game-panel p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-game-body font-bold text-retro-navy">
                      {cargo.grainName}: {cargo.amount}t
                    </span>
                    {sellPrice && (
                      <span className="text-game-small text-seagreen">
                        売値: ¥{sellPrice}/t
                      </span>
                    )}
                  </div>
                  {sellPrice && (
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={1}
                        max={cargo.amount}
                        step={1}
                        value={unloadAmount}
                        onChange={(e) =>
                          handleUnloadAmountChange(
                            cargo.grainId,
                            Number(e.target.value)
                          )
                        }
                        className="flex-1 h-3 bg-seagreen-light rounded-lg appearance-none cursor-pointer accent-seagreen"
                      />
                      <span className="text-game-small w-12 text-right text-retro-navy">{unloadAmount}t</span>
                      <button
                        onClick={() => handleUnload(cargo.grainId, unloadAmount)}
                        className="btn-game btn-game-gold py-1 px-2 text-game-small"
                      >
                        <CoinIcon size={12} className="mr-1" />
                        売却 ¥{unloadRevenue.toLocaleString()}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-game-small text-retro-navy-lighter">積荷なし</p>
        )}
      </div>

      {/* Available grains to purchase */}
      {portStock && portStock.grains.length > 0 && (
        <div>
          <h3 className="text-game-body font-bold text-retro-navy mb-2">
            購入可能な穀物
          </h3>
          <div className="space-y-2">
            {portStock.grains.map((grain) => {
              const maxLoad = Math.min(availableCapacity, 100);
              const useSmallStep = maxLoad > 0 && maxLoad < 10;
              const minLoad = maxLoad <= 0 ? 0 : useSmallStep ? 1 : 10;
              const stepLoad = maxLoad <= 0 ? 1 : useSmallStep ? 1 : 10;
              const defaultLoad = maxLoad <= 0 ? 0 : useSmallStep ? maxLoad : minLoad;
              const amount = clamp(
                loadAmounts[grain.grainId] ?? defaultLoad,
                minLoad,
                maxLoad
              );
              const cost = amount * grain.buyPrice;
              const canAfford = cost <= player.money;
              const hasCapacity = amount > 0 && amount <= availableCapacity;
              const isDisabled = maxLoad <= 0;

              return (
                <div key={grain.grainId} className="game-panel p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-game-body font-bold text-retro-navy">
                      {grain.grainName}
                    </span>
                    <span className="text-game-small text-gold-dark">
                      ¥{grain.buyPrice}/t
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={minLoad}
                      max={maxLoad}
                      step={stepLoad}
                      value={amount}
                      onChange={(e) =>
                        handleLoadAmountChange(grain.grainId, Number(e.target.value))
                      }
                      className="flex-1 h-3 bg-gold-light rounded-lg appearance-none cursor-pointer accent-gold"
                      disabled={isDisabled}
                    />
                    <span className="text-game-small w-12 text-right text-retro-navy">{amount}t</span>
                    <button
                      onClick={() => handleLoad(grain)}
                      disabled={!canAfford || !hasCapacity || isDisabled}
                      className={`btn-game py-1 px-2 text-game-small ${
                        canAfford && hasCapacity && availableCapacity > 0
                          ? "btn-game-primary"
                          : "btn-game-secondary opacity-50 cursor-not-allowed"
                      }`}
                    >
                      購入 ¥{cost.toLocaleString()}
                    </button>
                  </div>
                  {!canAfford && (
                    <p className="text-game-small text-vermillion mt-1">お金が足りません</p>
                  )}
                  {!hasCapacity && canAfford && (
                    <p className="text-game-small text-vermillion mt-1">積載量が足りません</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cargo not tradeable at this port */}
      {player.cargo.some(
        (c) => !portStock?.grains.find((g) => g.grainId === c.grainId)
      ) && (
        <div className="game-panel-highlight p-2">
          <h3 className="text-game-small font-bold text-retro-navy mb-1">
            この港では扱いのない積荷
          </h3>
          <p className="text-game-small text-retro-navy-lighter mb-1">
            他の港で売却できます
          </p>
          <div className="space-y-1">
            {player.cargo
              .filter((c) => !portStock?.grains.find((g) => g.grainId === c.grainId))
              .map((cargo) => (
                <div key={cargo.grainId} className="text-game-small text-retro-navy">
                  {cargo.grainName}: {cargo.amount}t
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
