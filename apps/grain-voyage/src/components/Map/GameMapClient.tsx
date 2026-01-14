"use client";

import GameMap from "./GameMap";

interface GameMapClientProps {
  selectedPortId?: string | null;
  shipPortId?: string | null;
  onPortSelect?: (id: string) => void;
  demandPortIds?: string[];
}

export default function GameMapClient({
  selectedPortId,
  shipPortId,
  onPortSelect,
  demandPortIds,
}: GameMapClientProps) {
  return (
    <GameMap
      selectedPortId={selectedPortId}
      shipPortId={shipPortId}
      onPortSelect={onPortSelect}
      demandPortIds={demandPortIds}
    />
  );
}
