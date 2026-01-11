"use client";

import { silos } from "@/data";
import { useCollection } from "@/context/CollectionContext";
import { getRarityStyles } from "@/lib/styles";

interface SiloListSidebarProps {
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export default function SiloListSidebar({
  selectedId,
  onSelect,
}: SiloListSidebarProps) {
  const { hasCard, getCategoryProgress } = useCollection();
  const progress = getCategoryProgress("silo");

  return (
    <div className="vintage-border rounded-2xl bg-concrete-50 p-4 h-full overflow-hidden flex flex-col">
      <div className="mb-4">
        <h3 className="font-display text-lg text-concrete-900 mb-1">
          サイロ一覧
        </h3>
        <p className="text-sm text-concrete-500">
          {progress.collected}/{progress.total} 獲得済み
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 -mr-2 pr-2">
        {silos.map((silo) => {
          const isCollected = hasCard(silo.id);
          const isSelected = selectedId === silo.id;
          const rarityStyles = getRarityStyles(silo.rarity);

          return (
            <button
              key={silo.id}
              onClick={() => onSelect?.(silo.id)}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                isSelected
                  ? "bg-slate-600 text-white shadow-md"
                  : isCollected
                    ? "bg-white hover:bg-slate-50 border border-concrete-200"
                    : "bg-concrete-100 hover:bg-concrete-200 border border-concrete-200"
              }`}
            >
              {isCollected ? (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`font-display text-sm ${isSelected ? "text-white" : "text-concrete-900"}`}
                    >
                      {silo.name}
                    </span>
                    <span
                      className={`shrink-0 px-1.5 py-0.5 rounded text-xs ${
                        isSelected ? "bg-white/20 text-white" : rarityStyles.badge
                      }`}
                    >
                      {rarityStyles.stars}
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1 ${isSelected ? "text-white/70" : "text-concrete-500"}`}
                  >
                    {silo.location}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-concrete-400 text-lg">?</span>
                    <span className="font-display text-sm text-concrete-400">
                      ???
                    </span>
                  </div>
                  <p className="text-xs mt-1 text-concrete-400">
                    クイズに正解して獲得しよう
                  </p>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
