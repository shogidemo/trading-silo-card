"use client";

import { useGame } from "@/context/GameContext";
import { DELIVERY_METHODS, getDeliverySpec } from "@/game/delivery";
import { ports } from "@/data";
import { CargoIcon } from "@/components/Icons";

export default function DeliveryPanel() {
  const { state, createDelivery } = useGame();

  const visibleDemands = state.visibleDemands;
  const siloStates = state.siloStates;

  return (
    <div className="game-panel p-4">
      <h3 className="text-game-body font-bold text-retro-navy flex items-center gap-2 mb-3">
        <CargoIcon size={18} />
        配送計画
      </h3>

      {visibleDemands.length === 0 ? (
        <p className="text-game-small text-retro-navy-lighter">
          需要が表示されるまで待機しましょう。
        </p>
      ) : (
        <div className="space-y-4">
          {visibleDemands.map((demand) => {
            const remaining = demand.amount - demand.fulfilledAmount;
            const originPorts = ports.filter((port) => {
              const silo = siloStates[port.id];
              return silo && (silo.stock[demand.grainId] ?? 0) > 0;
            });

            return (
              <div key={demand.id} className="bg-cream-dark rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-game-body font-bold text-retro-navy">
                      {demand.destinationName}
                    </p>
                    <p className="text-game-small text-retro-navy-lighter">
                      {demand.grainName} 残り {remaining.toLocaleString()}t
                    </p>
                  </div>
                  <span className="badge-game badge-game-gold text-game-small py-0.5">
                    期限 T{demand.deadline}
                  </span>
                </div>

                {originPorts.length === 0 ? (
                  <p className="text-game-small text-retro-navy">
                    配送可能な在庫がありません。
                  </p>
                ) : (
                  <div className="space-y-2">
                    {originPorts.map((port) => {
                      const silo = siloStates[port.id];
                      const availableStock = silo?.stock[demand.grainId] ?? 0;

                      return (
                        <div key={`${demand.id}-${port.id}`} className="rounded bg-cream p-2">
                          <p className="text-game-small font-bold text-retro-navy mb-2">
                            出荷元: {port.name}（在庫 {availableStock.toLocaleString()}t）
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(DELIVERY_METHODS).map(([method, spec]) => {
                              const amount = Math.min(spec.amount, remaining, availableStock);
                              const disabled = amount <= 0;
                              const label = `${spec.label} ${amount.toLocaleString()}t (${spec.turns}T)`;
                              return (
                                <button
                                  key={method}
                                  onClick={() =>
                                    createDelivery(demand.id, port.id, method as "truck" | "coastal_ship")
                                  }
                                  disabled={disabled}
                                  className={`btn-game btn-game-secondary text-game-small py-1 px-2 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                  {label} ¥{spec.cost.toLocaleString()}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {state.activeDeliveries.length > 0 && (
        <div className="mt-4">
          <h4 className="text-game-small font-bold text-retro-navy mb-2">
            進行中の配送
          </h4>
          <div className="space-y-2">
            {state.activeDeliveries.map((delivery) => {
              const method = getDeliverySpec(delivery.method);
              const originPort = ports.find((p) => p.id === delivery.originPortId);
              const destinationPort = ports.find((p) => p.id === delivery.destinationId);
              return (
                <div key={delivery.id} className="bg-cream rounded p-2 text-game-small text-retro-navy">
                  <div className="flex items-center justify-between">
                    <span>
                      {originPort?.name ?? "--"} → {destinationPort?.name ?? "--"}
                    </span>
                    <span className="font-bold">残り {delivery.remainingTurns}T</span>
                  </div>
                  <div className="mt-1 text-retro-navy-lighter">
                    {method.label} {delivery.amount.toLocaleString()}t / {delivery.grainName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
