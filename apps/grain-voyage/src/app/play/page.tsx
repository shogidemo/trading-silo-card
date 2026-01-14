"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { GameProvider, useGame } from "@/context/GameContext";
import { GameMapClient } from "@/components/Map";
import { GameResult } from "@/components/GameResult";
import { ShipStatus } from "@/components/ShipStatus";
import { SiloStatus } from "@/components/SiloStatus";
import { UnloadingPanel } from "@/components/UnloadingPanel";
import { DemandPanel } from "@/components/DemandPanel";
import { DeliveryPanel } from "@/components/DeliveryPanel";
import { TurnIcon, CoinIcon, AlertIcon, TargetIcon } from "@/components/Icons";

function GamePlayContent() {
  const { state, startGame, endTurn, isGameOver } = useGame();

  useEffect(() => {
    if (state.turn === 0) {
      startGame();
    }
  }, [state.turn, startGame]);

  const demandPortIds = state.visibleDemands.map((demand) => demand.destinationId);
  const totalScore =
    state.totalReward +
    state.totalBonus -
    state.totalDemurrageCharge -
    state.totalDeliveryCost -
    state.totalPenalty;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-cream">
      <header className="flex-shrink-0 z-50 game-panel-highlight border-b-0 rounded-none px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="btn-game btn-game-secondary px-3 py-1 text-game-small"
              onClick={(event) => {
                if (!isGameOver() && !window.confirm("ゲームを終了してタイトルへ戻りますか？")) {
                  event.preventDefault();
                }
              }}
            >
              終了
            </Link>
            <h1 className="font-display text-game-heading text-retro-navy">穀物ディスパッチャー</h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3 text-game-small">
            <div className="badge-game badge-game-seagreen">
              <TurnIcon size={16} />
              <span>{state.turn}/{state.maxTurns}</span>
            </div>
            <div className="badge-game badge-game-vermillion">
              <AlertIcon size={16} />
              <span>滞船料 ¥{state.totalDemurrageCharge.toLocaleString()}</span>
            </div>
            <div className="badge-game badge-game-gold">
              <CoinIcon size={16} />
              <span>スコア ¥{totalScore.toLocaleString()}</span>
            </div>
            <div className="badge-game" style={{ background: "#fff", borderColor: "#1a237e", color: "#1a237e" }}>
              <TargetIcon size={16} />
              <span>報酬 ¥{state.totalReward.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-2 gap-2">
        <div className="flex-1 relative min-h-[50vh] lg:min-h-0 overflow-hidden">
          <GameMapClient
            shipPortId={state.currentShip?.portId}
            demandPortIds={demandPortIds}
          />
        </div>

        <aside className="game-panel flex flex-col lg:w-[360px] overflow-y-auto">
          <div className="p-3 border-b-4 border-retro-navy">
            <p className="text-game-small text-retro-navy-lighter">ターン {state.turn}</p>
            <p className="font-display text-game-heading text-retro-navy">配送計画フェーズ</p>
          </div>
          <div className="p-3 space-y-3">
            <ShipStatus />
            <SiloStatus />
            <UnloadingPanel />
            <DemandPanel />
            <DeliveryPanel />
          </div>
          <div className="mt-auto p-3 border-t-4 border-retro-navy">
            <button
              onClick={endTurn}
              className="btn-game btn-game-primary w-full py-3 text-game-body"
            >
              ターン終了
            </button>
          </div>
        </aside>
      </div>

      {isGameOver() && <GameResult />}
    </div>
  );
}

function PlayLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="game-panel p-8 text-center">
        <p className="text-game-heading text-retro-navy">ゲームを準備中...</p>
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<PlayLoading />}>
      <GameProvider>
        <GamePlayContent />
      </GameProvider>
    </Suspense>
  );
}
