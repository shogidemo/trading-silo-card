"use client";

import dynamic from "next/dynamic";

const SiloMap = dynamic(() => import("./SiloMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-concrete-100">
      <span className="text-concrete-500">地図を読み込み中...</span>
    </div>
  ),
});

interface SiloMapClientProps {
  selectedSiloId?: string | null;
  onSiloSelect?: (id: string) => void;
}

export default function SiloMapClient({
  selectedSiloId,
  onSiloSelect,
}: SiloMapClientProps) {
  return <SiloMap selectedSiloId={selectedSiloId} onSiloSelect={onSiloSelect} />;
}
