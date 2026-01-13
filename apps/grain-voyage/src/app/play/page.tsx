"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GameProvider, useGame } from "@/context/GameContext";
import { GameMapClient } from "@/components/Map";
import { Dice } from "@/components/Dice";
import { PortActionPanel } from "@/components/PortAction";
import { GameResult } from "@/components/GameResult";
import { ports, routeCells, routes } from "@/data";

const MIN_SIDEBAR_WIDTH = 280;
const MAX_SIDEBAR_WIDTH = 600;
const DEFAULT_SIDEBAR_WIDTH = 320;

const VALID_COMPANY_IDS = new Set([
  "momiji",
  "mitsuboshi",
  "isetada",
  "global-grain",
]);

// ゲームUI本体
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

  // サイドバーのリサイズ
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
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

  // ゲーム初期化
  useEffect(() => {
    if (state.turn === 0) {
      // 初期位置は鹿島港（日本最大の穀物港）
      startGame(companyId, "port-kashima");
    }
  }, [state.turn, companyId, startGame]);

  const currentPort = getCurrentPort();
  const currentCell = getCurrentCell();
  const reachableCellIds = getReachableCellIds();

  // サイコロを振った時の処理
  const handleDiceRoll = (value: number) => {
    rollDice(value);
  };

  // セルを選択した時の処理
  const handleCellSelect = (cellId: string) => {
    if (state.phase === "selecting_destination" && canMoveTo(cellId)) {
      selectCell(cellId);
    }
  };

  // フェーズに応じた説明テキスト
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
        return `${state.remainingMoves}マス移動できます。移動先をクリックしてください`;
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

  // 現在位置の表示名
  const getCurrentPositionName = () => {
    if (currentPort) {
      return currentPort.name;
    }
    if (currentCell) {
      // 航路上の場合は出発港→到着港の形式で表示
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

  // 到達可能な港のリストを取得（portIdでユニーク化）
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
  const bonusRemainingTurns =
    state.activeMission?.bonusTurns !== undefined
      ? state.activeMission.bonusTurns -
        (state.turn - state.activeMission.acceptedAtTurn)
      : null;
  const isBonusEligible =
    bonusRemainingTurns !== null && bonusRemainingTurns >= 0;
  const shouldConfirmExit = !isGameOver() && state.turn > 1;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* ヘッダー */}
      <header className="flex-shrink-0 z-50 bg-white/90 backdrop-blur-sm border-b border-ocean-200 px-4 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-navy-500 hover:text-navy-700"
              onClick={(event) => {
                if (!shouldConfirmExit) return;
                if (!window.confirm("ゲームを終了してタイトルへ戻りますか？")) {
                  event.preventDefault();
                }
              }}
            >
              ← 終了
            </Link>
            <h1 className="font-display text-lg text-navy-900">穀物航路</h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3 text-xs sm:text-sm">
            <div>
              <span className="text-navy-500">ターン:</span>
              <span className="ml-1 font-bold text-navy-900">
                {state.turn} / {state.maxTurns}
              </span>
            </div>
            <div>
              <span className="text-navy-500">燃料:</span>
              <span className="ml-1 font-bold text-ocean-600">
                {state.player.fuel}
              </span>
            </div>
            <div>
              <span className="text-navy-500">資金:</span>
              <span className="ml-1 font-bold text-gold-600">
                ¥{state.player.money.toLocaleString()}
              </span>
            </div>
            <div className="border-l border-navy-200 pl-4">
              <span className="text-navy-500">積荷:</span>
              <span className="ml-1 font-bold text-orange-600">
                {getCurrentCargoAmount()}/{state.player.maxCapacity}t
              </span>
              {state.player.cargo.length > 0 && (
                <span className="ml-2 text-xs text-navy-400">
                  ({state.player.cargo.map(c => `${c.grainName}${c.amount}t`).join(", ")})
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* マップ */}
        <div className="flex-1 relative min-h-[55vh] lg:min-h-0 overflow-hidden">
          <GameMapClient
            currentCellId={state.player.currentCellId}
            reachableCellIds={reachableCellIds}
            onCellSelect={handleCellSelect}
            showCells={true}
            missionFromPortId={state.activeMission?.fromPortId}
            missionToPortId={state.activeMission?.toPortId}
          />

          {/* 到達可能な港のパネル */}
          {state.phase === "selecting_destination" && reachablePorts.length > 0 && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <p className="text-sm text-navy-600 mb-2">到達可能な港:</p>
              <div className="space-y-1">
                {reachablePorts.map(({ portId, cellId }) => {
                  const port = ports.find((p) => p.id === portId);
                  return (
                    <button
                      key={cellId}
                      onClick={() => handleCellSelect(cellId)}
                      className="w-full text-left px-3 py-2 rounded bg-ocean-50 hover:bg-ocean-100 transition-colors"
                    >
                      <span className="font-medium text-navy-900">
                        ⚓ {port?.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 移動可能マス数の表示 */}
          {state.phase === "selecting_destination" && (
            <div className="absolute bottom-4 left-4 bg-ocean-600 text-white px-4 py-2 rounded-lg shadow-lg">
              <span className="text-lg font-bold">{state.remainingMoves}</span>
              <span className="ml-1 text-sm">マス移動可能</span>
            </div>
          )}
        </div>

        {/* リサイズハンドル（デスクトップのみ） */}
        <div
          className="hidden lg:flex w-1.5 bg-ocean-100 hover:bg-ocean-300 cursor-col-resize items-center justify-center transition-colors"
          onMouseDown={handleResizeStart}
        >
          <div className="w-0.5 h-8 bg-ocean-300 rounded-full" />
        </div>

        {/* 右サイドパネル */}
        <aside
          className="w-full bg-white border-t border-ocean-200 flex flex-col lg:border-t-0 lg:flex-shrink-0 overflow-y-auto"
          style={{ width: sidebarWidth }}
        >
          {/* 現在地情報 */}
          <div className="p-4 border-b border-ocean-100">
            <h2 className="text-sm text-navy-500 mb-1">現在地</h2>
            <p className="font-display text-xl text-navy-900">
              {getCurrentPositionName()}
            </p>
            {!currentPort && currentCell && (
              <p className="text-sm text-navy-500 mt-1">
                🚢 航路上
              </p>
            )}
          </div>

          {/* 受注中ミッション */}
          {state.activeMission && (
            <div className="p-3 bg-amber-50 border-b border-amber-200">
              <h2 className="text-xs text-amber-700 font-semibold mb-1 flex items-center gap-1">
                <span>📦</span> 受注中ミッション
              </h2>
              <p className="text-sm font-bold text-amber-900 truncate">
                {state.activeMission.title}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                  {state.activeMission.fromPortName} → {state.activeMission.toPortName}
                </span>
                <span className="text-amber-600">
                  {state.activeMission.grainName} {state.activeMission.amount}t
                </span>
              </div>
              <div className="mt-1 text-xs text-amber-600">
                報酬: ¥{state.activeMission.reward.toLocaleString()}
                {bonusRemainingTurns !== null && (
                  <span className="ml-1">
                    {isBonusEligible
                      ? `(残り${bonusRemainingTurns}ターンでボーナス${
                          bonusRemainingTurns === 0 ? "・今回まで" : ""
                        })`
                      : "(ボーナス期限切れ)"}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* フェーズメッセージ */}
          <div className="p-4 bg-ocean-50 border-b border-ocean-100">
            <motion.p
              key={state.phase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-navy-700"
              role="status"
              aria-live="polite"
            >
              {getPhaseMessage()}
            </motion.p>
          </div>

          {/* サイコロエリア */}
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            {state.phase === "idle" && canRollDice() && (
              <>
                <Dice onRoll={handleDiceRoll} size="lg" />
                {currentPort && (
                  <button
                    onClick={enterPortAction}
                    className="mt-4 px-4 py-2 rounded-lg border border-ocean-200 text-sm text-navy-700 hover:bg-ocean-50 transition-colors"
                  >
                    港で行動する
                  </button>
                )}
              </>
            )}

            {state.phase === "idle" && !canRollDice() && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-6xl mb-4"
                >
                  ⛽
                </motion.div>
                <p className="text-rust-600 mb-4">燃料が尽きました</p>
                {currentPort && (
                  <button
                    onClick={enterPortAction}
                    className="mb-3 px-6 py-2 border border-ocean-200 text-navy-700 rounded-lg hover:bg-ocean-50 transition-colors"
                  >
                    港で補給する
                  </button>
                )}
                <button
                  onClick={() => endGame("fuel_empty")}
                  className="px-6 py-3 bg-rust-600 text-white rounded-lg font-display hover:bg-rust-700 transition-colors"
                >
                  ゲーム終了
                </button>
              </div>
            )}

            {state.phase === "selecting_destination" && (
              <div className="text-center">
                <div className="text-7xl font-display text-ocean-600 mb-2">
                  {state.lastDiceValue}
                </div>
                {reachableCellIds.length === 0 ? (
                  <div className="mt-4">
                    <p className="text-sm text-rust-600 mb-2">
                      移動可能なマスがありません
                    </p>
                    <button
                      onClick={endTurn}
                      className="px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700"
                    >
                      ターン終了
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-navy-500">
                    移動先を選択
                  </p>
                )}
              </div>
            )}

            {state.phase === "arrived" && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-6xl mb-4"
                >
                  {currentPort ? "⚓" : "🚢"}
                </motion.div>
                <p className="text-navy-600 mb-4">
                  {currentPort
                    ? `${currentPort.name}に到着！`
                    : "移動完了！"}
                </p>
                {currentPort ? (
                  <button
                    onClick={enterPortAction}
                    className="px-6 py-3 bg-ocean-600 text-white rounded-lg font-display hover:bg-ocean-700 transition-colors"
                  >
                    港に入る
                  </button>
                ) : (
                  <button
                    onClick={endTurn}
                    className="px-6 py-3 bg-ocean-600 text-white rounded-lg font-display hover:bg-ocean-700 transition-colors"
                  >
                    ターン終了
                  </button>
                )}
              </div>
            )}

            {state.phase === "port_action" && currentPort && (
              <div className="w-full">
                <PortActionPanel onDepart={endTurn} />
              </div>
            )}

            {state.phase === "game_end" && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-6xl mb-4"
                >
                  🏁
                </motion.div>
                <p className="text-navy-600">結果を確認してください</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ゲーム結果モーダル */}
      {isGameOver() && <GameResult />}
    </div>
  );
}

// ローディング表示
function PlayLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ocean-50">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🚢</div>
        <p className="text-navy-600">ゲームを準備中...</p>
      </div>
    </div>
  );
}

// ページ本体（ProviderとSuspenseでラップ）
export default function PlayPage() {
  return (
    <Suspense fallback={<PlayLoading />}>
      <GameProvider>
        <GamePlayContent />
      </GameProvider>
    </Suspense>
  );
}
