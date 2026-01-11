"use client";

import { SiloCard } from "@/types";
import { getRarityStyles } from "@/lib/styles";

interface SiloPopupProps {
  silo: SiloCard;
}

export default function SiloPopup({ silo }: SiloPopupProps) {
  const rarityStyles = getRarityStyles(silo.rarity);

  return (
    <div className="min-w-[200px] p-1">
      <div className="flex items-start gap-2 mb-2">
        <h3 className="font-display text-base font-bold text-concrete-900 leading-tight">
          {silo.name}
        </h3>
        <span
          className={`shrink-0 px-1.5 py-0.5 rounded text-xs ${rarityStyles.badge}`}
        >
          {rarityStyles.label}
        </span>
      </div>

      <p className="text-xs text-concrete-600 mb-2">{silo.location}</p>

      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-concrete-500">収容量</span>
          <span className="text-concrete-700 font-medium">{silo.capacity}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-concrete-500">設立</span>
          <span className="text-concrete-700 font-medium">
            {silo.establishedYear}年
          </span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-concrete-200">
        <p className="text-xs text-concrete-500">取扱穀物</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {silo.grains.map((grain) => (
            <span
              key={grain}
              className="px-1.5 py-0.5 bg-gold-100 text-gold-700 rounded text-xs"
            >
              {grain}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
