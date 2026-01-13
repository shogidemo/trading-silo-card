"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { getPortStock, GrainStock } from "@/data";

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

  // 積み込み量の変更
  const handleLoadAmountChange = (grainId: string, value: number) => {
    setLoadAmounts((prev) => ({ ...prev, [grainId]: value }));
  };

  // 荷下ろし量の変更
  const handleUnloadAmountChange = (grainId: string, value: number) => {
    setUnloadAmounts((prev) => ({ ...prev, [grainId]: value }));
  };

  // 積み込み実行
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

  // 荷下ろし実行
  const handleUnload = (grainId: string) => {
    const cargo = player.cargo.find((c) => c.grainId === grainId);
    if (!cargo) return;

    const amount = unloadAmounts[grainId] || cargo.amount;
    const grainInPort = portStock?.grains.find((g) => g.grainId === grainId);
    const sellPrice = grainInPort?.sellPrice || 0;
    const revenue = amount * sellPrice;

    unloadCargo(grainId, amount, revenue);
    setUnloadAmounts((prev) => ({ ...prev, [grainId]: 0 }));
  };

  return (
    <div className="space-y-4">
      {/* 積載状況 */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-700 mb-2">積載状況</h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-3 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{
                width: `${(currentCargoAmount / player.maxCapacity) * 100}%`,
              }}
            />
          </div>
          <span className="text-sm font-medium text-blue-700">
            {currentCargoAmount}/{player.maxCapacity}t
          </span>
        </div>
        {player.cargo.length > 0 ? (
          <div className="space-y-1">
            {player.cargo.map((cargo) => {
              const grainInPort = portStock?.grains.find(
                (g) => g.grainId === cargo.grainId
              );
              const sellPrice = grainInPort?.sellPrice;

              return (
                <div
                  key={cargo.grainId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-blue-800">
                    {cargo.grainName}: {cargo.amount}t
                  </span>
                  {sellPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600">
                        売値: &#xA5;{sellPrice}/t
                      </span>
                      <button
                        onClick={() => handleUnload(cargo.grainId)}
                        className="px-2 py-0.5 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                      >
                        全て売る (&#xA5;{(cargo.amount * sellPrice).toLocaleString()})
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-blue-500">積荷なし</p>
        )}
      </div>

      {/* 購入可能な穀物 */}
      {portStock && portStock.grains.length > 0 && (
        <div className="p-3 bg-amber-50 rounded-lg">
          <h3 className="text-sm font-semibold text-amber-700 mb-2">
            この港で購入できる穀物
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
                <motion.div
                  key={grain.grainId}
                  className="p-2 bg-white rounded border border-amber-200"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-amber-900">
                      {grain.grainName}
                    </span>
                    <span className="text-sm text-amber-600">
                      &#xA5;{grain.buyPrice}/t
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
                      className="flex-1 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
                      disabled={isDisabled}
                    />
                    <span className="text-sm w-12 text-right">{amount}t</span>
                    <button
                      onClick={() => handleLoad(grain)}
                      disabled={!canAfford || !hasCapacity || isDisabled}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        canAfford && hasCapacity && availableCapacity > 0
                          ? "bg-amber-500 hover:bg-amber-600 text-white"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      購入 (&#xA5;{cost.toLocaleString()})
                    </button>
                  </div>
                  {!canAfford && (
                    <p className="text-xs text-red-500 mt-1">お金が足りません</p>
                  )}
                  {!hasCapacity && canAfford && (
                    <p className="text-xs text-red-500 mt-1">積載量が足りません</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* この港で扱いのない穀物の売却 */}
      {player.cargo.some(
        (c) => !portStock?.grains.find((g) => g.grainId === c.grainId)
      ) && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            この港では扱いのない積荷
          </h3>
          <p className="text-xs text-gray-500">
            他の港で売却できます
          </p>
          <div className="mt-1 space-y-1">
            {player.cargo
              .filter((c) => !portStock?.grains.find((g) => g.grainId === c.grainId))
              .map((cargo) => (
                <div key={cargo.grainId} className="text-sm text-gray-600">
                  {cargo.grainName}: {cargo.amount}t
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
