"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GameProvider, useGame } from "@/context/GameContext";
import { GameMapClient } from "@/components/Map";
import { Dice } from "@/components/Dice";
import { PortActionPanel } from "@/components/PortAction";
import { MissionPanel } from "@/components/Mission";
import { GameResult } from "@/components/GameResult";
import { ports, routeCells, routes } from "@/data";
import { FuelIcon, CoinIcon, CargoIcon, TurnIcon, ShipIcon, AnchorIcon, TargetIcon } from "@/components/Icons";

const MIN_SIDEBAR_WIDTH = 280;
const MAX_SIDEBAR_WIDTH = 600;
const DEFAULT_SIDEBAR_WIDTH = 340;

const VALID_COMPANY_IDS = new Set([
  "momiji",
  "mitsuboshi",
  "isetada",
  "global-grain",
]);

function GamePlayContent() {
  const {
    state,
    startGame,
    rollDice,
    selectCell,
    enterPortAction,
    endTurn,
    endGame,
    getReachableCellIds,
    canMoveTo,
    getCurrentPort,
    getCurrentCell,
    isGameOver,
    canRollDice,
    getCurrentCargoAmount,
  } = useGame();

  const searchParams = useSearchParams();
  const companyParam = searchParams.get("company");
  const companyId = companyParam && VALID_COMPANY_IDS.has(companyParam)
    ? companyParam
    : "momiji";

  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeRef.current = { startX: e.clientX, startWidth: sidebarWidth };
  }, [sidebarWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeRef.current) return;
      const delta = resizeRef.current.startX - e.clientX;
      const newWidth = Math.min(
        MAX_SIDEBAR_WIDTH,
        Math.max(MIN_SIDEBAR_WIDTH, resizeRef.current.startWidth + delta)
      );
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeRef.current = null;
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  useEffect(() => {
    if (state.turn === 0) {
      startGame(companyId, "port-kashima");
    }
  }, [state.turn, companyId, startGame]);

  const currentPort = getCurrentPort();
  const currentCell = getCurrentCell();
  const reachableCellIds = getReachableCellIds();

  const handleDiceRoll = (value: number) => {
    rollDice(value);
  };

  const handleCellSelect = (cellId: string) => {
    if (state.phase === "selecting_destination" && canMoveTo(cellId)) {
      selectCell(cellId);
    }
  };

  const getPhaseMessage = () => {
    switch (state.phase) {
      case "idle":
        if (state.player.fuel <= 0) {
          return "燃料が尽きました...";
        }
        return currentPort
          ? "サイコロを振るか、港で行動しましょう"
          : "サイコロを振って移動先を決めましょう";
      case "rolling":
        return "サイコロを振っています...";
      case "selecting_destination":
        return `${state.remainingMoves}マス移動できます。移動先をクリック！`;
      case "arrived":
        return currentPort
          ? "港に到着しました！"
          : "移動完了！ターンを終了してください";
      case "port_action":
        return `${currentPort?.name}で行動中...`;
      case "game_end":
        return "ゲーム終了！";
      default:
        return "";
    }
  };

  const getCurrentPositionName = () => {
    if (currentPort) {
      return currentPort.name;
    }
    if (currentCell) {
      const route = routes.find((r) => r.id === currentCell.routeId);
      if (route) {
        const fromPort = ports.find((p) => p.id === route.from);
        const toPort = ports.find((p) => p.id === route.to);
        if (fromPort && toPort) {
          const fromName = fromPort.name.replace("港", "");
          const toName = toPort.name.replace("港", "");
          return `${fromName}〜${toName}間`;
        }
      }
      return "航行中";
    }
    return "---";
  };

  const getReachablePorts = () => {
    const portMap = new Map<string, { portId: string; cellId: string }>();
    for (const cellId of reachableCellIds) {
      const cell = routeCells.find((c) => c.id === cellId);
      if (cell?.type === "port" && cell.portId && !portMap.has(cell.portId)) {
        portMap.set(cell.portId, { portId: cell.portId, cellId: cell.id });
      }
    }
    return Array.from(portMap.values());
  };

  const reachablePorts = getReachablePorts();
  const shouldConfirmExit = !isGameOver() && state.turn > 1;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-cream">
      {/* Header */}
      <header className="flex-shrink-0 z-50 game-panel-highlight border-b-0 rounded-none px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="btn-game btn-game-secondary px-3 py-1 text-game-small"
              onClick={(event) => {
                if (!shouldConfirmExit) return;
                if (!window.confirm("ゲームを終了してタイトルへ戻りますか？")) {
                  event.preventDefault();
                }
              }}
            >
              終了
            </Link>
            <h1 className="font-display text-game-heading text-retro-navy">穀物航路</h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-4 text-game-small">
            <div className="badge-game badge-game-seagreen">
              <TurnIcon size={16} />
              <span>{state.turn}/{state.maxTurns}</span>
            </div>
            <div className="badge-game" style={{ background: "#ffecb3", borderColor: "#c79100", color: "#1a237e" }}>
              <FuelIcon size={16} />
              <span>{state.player.fuel}</span>
            </div>
            <div className="badge-game badge-game-gold">
              <CoinIcon size={16} />
              <span>¥{state.player.money.toLocaleString()}</span>
            </div>
            <div className="badge-game badge-game-vermillion">
              <CargoIcon size={16} />
              <span>{getCurrentCargoAmount()}/{state.player.maxCapacity}t</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-2 gap-2">
        {/* Map */}
        <div className="flex-1 relative min-h-[50vh] lg:min-h-0 overflow-hidden">
          <GameMapClient
            currentCellId={state.player.currentCellId}
            reachableCellIds={reachableCellIds}
            onCellSelect={handleCellSelect}
            showCells={true}
            missionFromPortId={state.activeMission?.fromPortId}
            missionToPortId={state.activeMission?.toPortId}
          />

          {/* Reachable ports panel */}
          {state.phase === "selecting_destination" && reachablePorts.length > 0 && (
            <div className="absolute top-16 left-4 game-panel p-3">
              <p className="text-game-small text-retro-navy mb-2 font-bold">到達可能な港:</p>
              <div className="space-y-2">
                {reachablePorts.map(({ portId, cellId }) => {
                  const port = ports.find((p) => p.id === portId);
                  return (
                    <button
                      key={cellId}
                      onClick={() => handleCellSelect(cellId)}
                      className="btn-game btn-game-secondary w-full py-2 px-3 text-game-small"
                    >
                      <AnchorIcon size={14} className="mr-1" />
                      {port?.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Remaining moves display */}
          {state.phase === "selecting_destination" && (
            <div className="absolute bottom-16 left-4 game-panel-gold px-4 py-2">
              <span className="text-game-title text-retro-navy font-bold">{state.remainingMoves}</span>
              <span className="ml-1 text-game-small text-retro-navy">マス移動可能</span>
            </div>
          )}
        </div>

        {/* Resize handle (desktop only) */}
        <div
          className="hidden lg:flex w-2 bg-retro-navy rounded cursor-col-resize items-center justify-center"
          onMouseDown={handleResizeStart}
        >
          <div className="w-0.5 h-8 bg-cream rounded-full" />
        </div>

        {/* Right sidebar */}
        <aside
          className="game-panel flex flex-col lg:flex-shrink-0 overflow-hidden min-h-0"
          style={{ width: sidebarWidth }}
        >
          {/* Current location */}
          <div className="p-4 border-b-4 border-retro-navy">
            <h2 className="text-game-small text-retro-navy-lighter mb-1">現在地</h2>
            <p className="font-display text-game-heading text-retro-navy flex items-center gap-2">
              {currentPort ? <AnchorIcon size={20} /> : <ShipIcon size={20} />}
              {getCurrentPositionName()}
            </p>
          </div>

          {/* Missions */}
          <div className="p-3 bg-cream border-b-4 border-retro-navy">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-game-small text-retro-navy font-bold flex items-center gap-1">
                <TargetIcon size={14} />
                ミッション
              </h2>
              {state.activeMission ? (
                <span className="badge-game badge-game-seagreen text-game-small py-0.5">
                  受注中
                </span>
              ) : (
                <span className="badge-game text-game-small py-0.5" style={{ background: "#fff", borderColor: "#1a237e", color: "#1a237e" }}>
                  選択可能
                </span>
              )}
            </div>
            <div className="max-h-[38vh] overflow-y-auto pr-1">
              <MissionPanel />
            </div>
          </div>

          {/* Phase message */}
          <div className="p-3 bg-cream-dark border-b-4 border-retro-navy">
            <p
              className="text-game-body text-retro-navy font-bold"
              role="status"
              aria-live="polite"
            >
              {getPhaseMessage()}
            </p>
          </div>

          {/* Action area */}
          <div className={`flex-1 flex flex-col items-center p-4 overflow-y-auto min-h-0 ${state.phase === "port_action" ? "justify-start" : "justify-center"}`}>
            {state.phase === "idle" && canRollDice() && (
              <>
                <Dice onRoll={handleDiceRoll} onRollingChange={setIsDiceRolling} size="lg" />
                {currentPort && (
                  <button
                    onClick={enterPortAction}
                    disabled={isDiceRolling}
                    className={`btn-game btn-game-secondary mt-4 text-game-body ${isDiceRolling ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    港で行動する
                  </button>
                )}
              </>
            )}

            {state.phase === "idle" && !canRollDice() && (
              <div className="text-center">
                <div className="game-panel-highlight p-6 mb-4">
                  <FuelIcon size={48} className="mx-auto text-vermillion mb-2" />
                  <p className="text-game-heading text-vermillion font-bold">燃料切れ！</p>
                </div>
                {currentPort && (
                  <button
                    onClick={enterPortAction}
                    className="btn-game btn-game-primary mb-3"
                  >
                    港で補給する
                  </button>
                )}
                <button
                  onClick={() => endGame("fuel_empty")}
                  className="btn-game btn-game-danger"
                >
                  ゲーム終了
                </button>
              </div>
            )}

            {state.phase === "selecting_destination" && (
              <div className="text-center">
                <div className="game-panel-gold p-6 mb-4">
                  <p className="text-game-small text-retro-navy">出目</p>
                  <p className="text-6xl font-display text-retro-navy font-bold">
                    {state.lastDiceValue}
                  </p>
                </div>
                {reachableCellIds.length === 0 ? (
                  <div>
                    <p className="text-game-body text-vermillion mb-3">
                      移動可能なマスがありません
                    </p>
                    <button
                      onClick={endTurn}
                      className="btn-game btn-game-primary"
                    >
                      ターン終了
                    </button>
                  </div>
                ) : (
                  <p className="text-game-body text-retro-navy">
                    マップから移動先を選択してください
                  </p>
                )}
              </div>
            )}

            {state.phase === "arrived" && (
              <div className="text-center">
                <div className="game-panel-highlight p-6 mb-4">
                  {currentPort ? (
                    <AnchorIcon size={48} className="mx-auto text-seagreen mb-2" />
                  ) : (
                    <ShipIcon size={48} className="mx-auto text-gold-dark mb-2" />
                  )}
                  <p className="text-game-heading text-retro-navy font-bold">
                    {currentPort ? `${currentPort.name}に到着！` : "移動完了！"}
                  </p>
                </div>
                {currentPort ? (
                  <button
                    onClick={enterPortAction}
                    className="btn-game btn-game-gold"
                  >
                    港に入る
                  </button>
                ) : (
                  <button
                    onClick={endTurn}
                    className="btn-game btn-game-primary"
                  >
                    ターン終了
                  </button>
                )}
              </div>
            )}

            {state.phase === "port_action" && currentPort && (
              <div className="text-center">
                <div className="game-panel-gold p-6">
                  <AnchorIcon size={48} className="mx-auto text-retro-navy mb-2" />
                  <p className="text-game-heading text-retro-navy font-bold">港で作業中</p>
                  <p className="text-game-body text-retro-navy">{currentPort.name}</p>
                </div>
              </div>
            )}

            {state.phase === "game_end" && (
              <div className="text-center">
                <div className="game-panel-gold p-6">
                  <TargetIcon size={48} className="mx-auto text-retro-navy mb-2" />
                  <p className="text-game-heading text-retro-navy font-bold">ゲーム終了！</p>
                  <p className="text-game-body text-retro-navy">結果を確認してください</p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Port action modal */}
      {state.phase === "port_action" && currentPort && (
        <PortActionPanel onDepart={endTurn} />
      )}

      {/* Game result modal */}
      {isGameOver() && <GameResult />}
    </div>
  );
}

function PlayLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="game-panel p-8 text-center">
        <ShipIcon size={64} className="mx-auto text-retro-navy mb-4" />
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
