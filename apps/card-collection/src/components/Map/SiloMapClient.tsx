"use client";

import dynamic from "next/dynamic";
import type { SiloMapProps } from "./SiloMap";

const SiloMap = dynamic(() => import("./SiloMap"), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center bg-sky-50" role="status">地図を読み込み中…</div>,
});

export default function SiloMapClient(props: SiloMapProps) {
  return <SiloMap {...props} />;
}
