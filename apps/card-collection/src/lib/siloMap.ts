import { SiloCard } from "@/types";
import { siloLocations } from "../data/siloLocations";

// 地図専用の補正。航海ゲームと共有するカード座標は変更しない。
export function getSiloPosition(silo: SiloCard): [number, number] | null {
  const location = siloLocations[silo.id];
  const coordinates = location?.status === "site-point" ? location.coordinates : undefined;
  return coordinates ? [coordinates.lat, coordinates.lng] : null;
}

export function getSiloZoom(silo: SiloCard): number {
  return getSiloPosition(silo) ? 16 : 6;
}

function distanceMeters(a: SiloCard, b: SiloCard): number {
  const first = getSiloPosition(a), second = getSiloPosition(b);
  if (!first || !second) return Infinity;
  const radians = Math.PI / 180;
  const h = Math.sin((second[0] - first[0]) * radians / 2) ** 2 +
    Math.cos(first[0] * radians) * Math.cos(second[0] * radians) *
    Math.sin((second[1] - first[1]) * radians / 2) ** 2;
  return 12742000 * Math.asin(Math.min(1, Math.sqrt(h)));
}

// 小縮尺で重なる施設だけをまとめる。施設の座標そのものは移動しない。
export function groupNearbySilos(
  silos: SiloCard[], project: (silo: SiloCard) => [number, number], radius: number
): SiloCard[][] {
  const groups: SiloCard[][] = [];
  for (const silo of silos) {
    const point = project(silo);
    const group = radius > 0 ? groups.find((items) => {
      const center = project(items[0]);
      return items.every((item) => item.location === silo.location && distanceMeters(item, silo) <= 2000) &&
        Math.hypot(point[0] - center[0], point[1] - center[1]) < radius;
    }) : undefined;
    if (group) group.push(silo);
    else groups.push([silo]);
  }
  return groups;
}

export interface SiloRegion {
  id: string;
  name: string;
  position: [number, number];
  remaining: number;
}

const REGIONS = [
  { id: "hokkaido", name: "北海道", position: [43, 142.4], prefectures: ["北海道"] },
  { id: "tohoku", name: "東北", position: [39.5, 140.5], prefectures: ["青森県", "岩手県"] },
  { id: "kanto", name: "関東", position: [36.1, 139.8], prefectures: ["茨城県", "千葉県"] },
  { id: "hokuriku", name: "北陸・新潟", position: [37.2, 138.5], prefectures: ["新潟県"] },
  { id: "tokai", name: "東海", position: [35.2, 137.2], prefectures: ["愛知県"] },
  { id: "kansai", name: "近畿", position: [34.8, 135.4], prefectures: ["兵庫県"] },
  { id: "chugoku", name: "中国", position: [34.8, 133.3], prefectures: ["岡山県"] },
  { id: "kyushu", name: "九州", position: [32.4, 130.9], prefectures: ["福岡県", "熊本県", "鹿児島県"] },
] as const;

// 未獲得施設は地域の代表地点だけを返す。施設名・ID・実座標をUIへ渡さない。
export function getUncollectedRegions(silos: SiloCard[], collectedIds: string[]): SiloRegion[] {
  return REGIONS.map((region) => ({
    id: region.id, name: region.name, position: [...region.position] as [number, number],
    remaining: silos.filter((silo) => !collectedIds.includes(silo.id) && region.prefectures.some((prefecture) => silo.location.startsWith(prefecture))).length,
  })).filter((region) => region.remaining > 0);
}
