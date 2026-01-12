"use client";

import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import CargoPanel from "./CargoPanel";
import { MissionPanel } from "@/components/Mission";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-4 border border-gray-200"
    >
      {/* 港情報ヘッダー */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">&#x2693;</span>
          {port.name}
        </h2>
        <p className="text-sm text-gray-500">受入能力: {port.capacity.toLocaleString()}t/ターン</p>
      </div>

      {/* 船の状態 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">船の状態</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">燃料</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{ width: `${(player.fuel / player.maxFuel) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">
                {player.fuel}/{player.maxFuel}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">積載量</span>
            <span className="text-sm font-medium text-blue-600">
              {getCurrentCargoAmount()}/{player.maxCapacity}t
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">所持金</span>
            <span className="text-sm font-medium text-green-600">
              &#xA5;{player.money.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 燃料補給セクション */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">
          燃料補給 ({FUEL_COST_PER_UNIT}円/1燃料)
        </h3>
        {fuelNeeded === 0 ? (
          <p className="text-sm text-gray-500">燃料は満タンです</p>
        ) : maxAffordable === 0 ? (
          <p className="text-sm text-red-500">お金が足りません</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {refuelOptions.map((amount) => (
              <button
                key={amount}
                onClick={() => handleRefuel(amount)}
                className="px-3 py-1.5 text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors"
              >
                +{amount} (&#xA5;{(amount * FUEL_COST_PER_UNIT).toLocaleString()})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 積荷セクション */}
      <div className="mb-4">
        <CargoPanel portId={port.id} />
      </div>

      {/* ミッションセクション */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">ミッション</h3>
        <MissionPanel />
      </div>

      {/* 出発ボタン */}
      <button
        onClick={onDepart}
        className="w-full py-3 bg-ocean-600 hover:bg-ocean-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <span>出発する</span>
        <span className="text-lg">&#x1F6A2;</span>
      </button>
    </motion.div>
  );
}
