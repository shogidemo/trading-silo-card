"use client";

import { useState } from "react";
import Link from "next/link";
import { GameMapClient } from "@/components/Map";
import { ports, routes } from "@/data";

export default function MapPage() {
  const [selectedPortId, setSelectedPortId] = useState<string | null>(null);

  const selectedPort = selectedPortId
    ? ports.find((p) => p.id === selectedPortId)
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-ocean-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-navy-500 hover:text-navy-700 flex items-center gap-1"
            >
              ← 戻る
            </Link>
            <h1 className="font-display text-xl text-navy-900">航路マップ</h1>
          </div>
          <div className="text-sm text-navy-600">
            {ports.length}港 / {routes.length}航路
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* マップ */}
        <div className="flex-1 relative min-h-[55vh] lg:min-h-0">
          <GameMapClient
            selectedPortId={selectedPortId}
            onPortSelect={setSelectedPortId}
          />
        </div>

        {/* サイドパネル */}
        <aside className="w-full bg-white border-t border-ocean-200 overflow-y-auto lg:w-80 lg:border-t-0 lg:border-l">
          {selectedPort ? (
            <div className="p-4">
              <h2 className="font-display text-lg text-navy-900 mb-2">
                {selectedPort.name}
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-navy-500">荷役能力</span>
                  <p className="font-medium">
                    {selectedPort.unloadingCapacity.toLocaleString()}トン/ターン
                  </p>
                </div>
                <div>
                  <span className="text-xs text-navy-500">サイロ容量</span>
                  <p className="font-medium">
                    {selectedPort.siloCapacity.toLocaleString()}トン
                  </p>
                </div>
                <div>
                  <span className="text-xs text-navy-500">取扱穀物</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedPort.acceptableGrains.map((grain) => (
                      <span
                        key={grain}
                        className="px-2 py-1 bg-gold-100 text-gold-800 text-xs rounded"
                      >
                        {grain}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-navy-500">接続先</span>
                  <div className="mt-1 space-y-1">
                    {routes
                      .filter(
                        (r) =>
                          r.from === selectedPortId || r.to === selectedPortId
                      )
                      .map((route) => {
                        const destId =
                          route.from === selectedPortId ? route.to : route.from;
                        const destPort = ports.find((p) => p.id === destId);
                        return (
                          <button
                            key={route.id}
                            onClick={() => setSelectedPortId(destId)}
                            className="w-full text-left p-2 rounded bg-ocean-50 hover:bg-ocean-100 transition-colors"
                          >
                            <span className="font-medium text-navy-900">
                              {destPort?.name}
                            </span>
                            <span className="text-xs text-navy-500 ml-2">
                              {route.distance}マス
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPortId(null)}
                className="mt-4 w-full py-2 text-sm text-navy-600 hover:text-navy-900"
              >
                選択を解除
              </button>
            </div>
          ) : (
            <div className="p-4">
              <h2 className="font-display text-lg text-navy-900 mb-4">港一覧</h2>
              <div className="space-y-1">
                {ports.map((port) => (
                  <button
                    key={port.id}
                    onClick={() => setSelectedPortId(port.id)}
                    className="w-full text-left p-2 rounded hover:bg-ocean-50 transition-colors"
                  >
                    <span className="font-medium text-navy-900">
                      {port.name}
                    </span>
                    <span className="text-xs text-navy-500 ml-2">
                      {port.acceptableGrains.length}種
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
