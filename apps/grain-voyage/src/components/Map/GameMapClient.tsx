"use client";

import dynamic from "next/dynamic";

const GameMap = dynamic(() => import("./GameMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-ocean-50">
      <div className="text-center">
        <div className="text-4xl mb-2 animate-bounce">🚢</div>
        <span className="text-navy-500">航路マップを読み込み中...</span>
      </div>
    </div>
  ),
});

interface GameMapClientProps {
  // 旧API（互換性）
  selectedPortId?: string | null;
  shipPortId?: string | null;
  onPortSelect?: (id: string) => void;
  // 新API（マス制用）
  currentCellId?: string | null;
  reachableCellIds?: string[];
  onCellSelect?: (cellId: string) => void;
  showCells?: boolean;
  // ミッション関連
  missionFromPortId?: string | null;
  missionToPortId?: string | null;
}

export default function GameMapClient({
  selectedPortId,
  shipPortId,
  onPortSelect,
  currentCellId,
  reachableCellIds,
  onCellSelect,
  showCells,
  missionFromPortId,
  missionToPortId,
}: GameMapClientProps) {
  return (
    <GameMap
      selectedPortId={selectedPortId}
      shipPortId={shipPortId}
      onPortSelect={onPortSelect}
      currentCellId={currentCellId}
      reachableCellIds={reachableCellIds}
      onCellSelect={onCellSelect}
      showCells={showCells}
      missionFromPortId={missionFromPortId}
      missionToPortId={missionToPortId}
    />
  );
}
