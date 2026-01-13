"use client";

import GameMap from "./GameMap";

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
