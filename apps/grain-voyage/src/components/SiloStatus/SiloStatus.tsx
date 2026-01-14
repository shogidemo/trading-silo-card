"use client";

import { grains, ports } from "@/data";
import { useGame } from "@/context/GameContext";
import { CargoIcon } from "@/components/Icons";

export default function SiloStatus() {
  const { state } = useGame();

  const activePortIds = new Set<string>();
  if (state.currentShip) {
    activePortIds.add(state.currentShip.portId);
  }
  for (const portId of Object.keys(state.siloStates)) {
    const silo = state.siloStates[portId];
    if (silo.totalStock > 0) {
      activePortIds.add(portId);
    }
  }

  const visiblePorts = ports.filter((port) => activePortIds.has(port.id));

  if (visiblePorts.length === 0) {
    return (
      <div className="game-panel p-4">
        <h3 className="text-game-body font-bold text-retro-navy flex items-center gap-2">
          <CargoIcon size={18} />
          サイロ状態
        </h3>
        <p className="text-game-small text-retro-navy-lighter mt-2">
          サイロ在庫はまだありません。
        </p>
      </div>
    );
  }

  return (
    <div className="game-panel p-4">
      <h3 className="text-game-body font-bold text-retro-navy flex items-center gap-2 mb-3">
        <CargoIcon size={18} />
        サイロ状態
      </h3>
      <div className="space-y-3">
        {visiblePorts.map((port) => {
          const silo = state.siloStates[port.id];
          const utilization = silo ? (silo.totalStock / silo.capacity) * 100 : 0;
          return (
            <div key={port.id} className="bg-cream-dark rounded p-3">
              <div className="flex items-center justify-between text-game-small text-retro-navy">
                <span className="font-bold">{port.name}</span>
                <span>
                  {silo.totalStock.toLocaleString()} / {silo.capacity.toLocaleString()}t
                </span>
              </div>
              <div className="progress-game mt-2">
                <div
                  className="progress-game-fill progress-game-fill-gold"
                  style={{ width: `${Math.min(100, utilization)}%` }}
                />
              </div>
              {Object.keys(silo.stock).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 text-game-small">
                  {Object.entries(silo.stock).map(([grainId, amount]) => {
                    const grainName = grains.find((grain) => grain.id === grainId)?.name ?? grainId;
                    return (
                      <span
                        key={grainId}
                        className="badge-game text-game-small py-0.5"
                        style={{ background: "#fff", borderColor: "#1a237e", color: "#1a237e" }}
                      >
                        {(grainName ?? grainId)} {amount.toLocaleString()}t
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
