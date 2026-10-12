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

// 「すべて」は未獲得も含める。保存IDは変更しない。
export function getVisibleSilos(silos: SiloCard[], collectedIds: string[], collectedOnly: boolean): SiloCard[] {
  return collectedOnly ? silos.filter((silo) => collectedIds.includes(silo.id)) : silos;
}
