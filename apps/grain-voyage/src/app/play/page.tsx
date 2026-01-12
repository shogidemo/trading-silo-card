"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GameProvider, useGame } from "@/context/GameContext";
import { GameMapClient } from "@/components/Map";
import { Dice } from "@/components/Dice";
import { PortActionPanel } from "@/components/PortAction";
import { ports, routeCells } from "@/data";

// ゲームUI本体
function GamePlayContent() {
  const {
    state,
    startGame,
    rollDice,
    selectCell,
    enterPortAction,
    endTurn,
    getReachableCellIds,
    canMoveTo,
    getCurrentPort,
    getCurrentCell,
    isAtPort,
  } = useGame();

  const searchParams = useSearchParams();
  const companyId = searchParams.get("company") || "momiji";

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
        return "サイコロを振って移動先を決めましょう";
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
      // 航路上の場合はルート名を表示
      return `${currentCell.routeId} (マス ${currentCell.index})`;
    }
    return "---";
  };

  // 到達可能な港のリストを取得
  const getReachablePorts = () => {
    const portList: { portId: string; cellId: string }[] = [];
    for (const cellId of reachableCellIds) {
      const cell = routeCells.find((c) => c.id === cellId);
      if (cell?.type === "port" && cell.portId) {
        portList.push({ portId: cell.portId, cellId: cell.id });
      }
    }
    return portList;
  };

  const reachablePorts = getReachablePorts();

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-ocean-200 px-4 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-navy-500 hover:text-navy-700"
            >
              ← 終了
            </Link>
            <h1 className="font-display text-lg text-navy-900">穀物航路</h1>
          </div>
          <div className="flex items-center gap-6 text-sm">
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
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="flex-1 flex">
        {/* マップ */}
        <div className="flex-1 relative">
          <GameMapClient
            currentCellId={state.player.currentCellId}
            reachableCellIds={reachableCellIds}
            onCellSelect={handleCellSelect}
            showCells={true}
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

        {/* 右サイドパネル */}
        <aside className="w-80 bg-white border-l border-ocean-200 flex flex-col">
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

          {/* フェーズメッセージ */}
          <div className="p-4 bg-ocean-50 border-b border-ocean-100">
            <motion.p
              key={state.phase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-navy-700"
            >
              {getPhaseMessage()}
            </motion.p>
          </div>

          {/* サイコロエリア */}
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            {state.phase === "idle" && (
              <Dice onRoll={handleDiceRoll} size="lg" />
            )}

            {state.phase === "selecting_destination" && (
              <div className="text-center">
                <div className="text-6xl font-display text-ocean-600 mb-4">
                  {state.lastDiceValue}
                </div>
                <p className="text-navy-600 mb-2">
                  残り <span className="font-bold">{state.remainingMoves}</span> マス
                </p>
                <p className="text-xs text-navy-400 mb-4">
                  マップ上の青いマスをクリックして移動
                </p>
                {reachableCellIds.length === 0 && (
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
          </div>

          {/* 移動履歴 */}
          <div className="p-4 border-t border-ocean-100 max-h-40 overflow-y-auto">
            <h3 className="text-sm text-navy-500 mb-2">移動履歴</h3>
            <div className="flex flex-wrap gap-1">
              {state.moveHistory.slice(-10).map((cellId, index) => {
                const cell = routeCells.find((c) => c.id === cellId);
                const port = cell?.type === "port" && cell.portId
                  ? ports.find((p) => p.id === cell.portId)
                  : null;

                const isLast = index === state.moveHistory.slice(-10).length - 1;

                return (
                  <span
                    key={`${cellId}-${index}`}
                    className={`text-xs px-2 py-1 rounded ${
                      isLast
                        ? "bg-ocean-100 text-ocean-700"
                        : port
                          ? "bg-gold-100 text-gold-700"
                          : "bg-navy-100 text-navy-600"
                    }`}
                  >
                    {port ? `⚓${port.name.replace("港", "")}` : `🚢${cell?.index || "?"}`}
                  </span>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
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
