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
  selectedPortId?: string | null;
  shipPortId?: string | null;
  onPortSelect?: (id: string) => void;
}

export default function GameMapClient({
  selectedPortId,
  shipPortId,
  onPortSelect,
}: GameMapClientProps) {
  return (
    <GameMap
      selectedPortId={selectedPortId}
      shipPortId={shipPortId}
      onPortSelect={onPortSelect}
    />
  );
}
