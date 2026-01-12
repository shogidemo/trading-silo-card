import { silos } from "@trading-silo/shared";
import { Port } from "@/types";

// サイロデータから港データを生成
// 近接するサイロは1つの港としてまとめる

export const ports: Port[] = [
  // === 北海道 ===
  {
    id: "port-kushiro",
    name: "釧路港",
    coordinates: { lat: 42.9978, lng: 144.3338 },
    capacity: 50000,
    acceptableGrains: ["トウモロコシ", "大豆", "マイロ"],
    currentDemand: {},
    siloIds: ["silo-zenno-kushiro"],
  },
  {
    id: "port-tokachi",
    name: "十勝港（広尾）",
    coordinates: { lat: 42.3035, lng: 143.3273 },
    capacity: 30000,
    acceptableGrains: ["トウモロコシ", "大豆", "マイロ"],
    currentDemand: {},
    siloIds: ["silo-tokachi"],
  },
  {
    id: "port-tomakomai",
    name: "苫小牧港",
    coordinates: { lat: 42.641, lng: 141.6947 },
    capacity: 80000,
    acceptableGrains: ["トウモロコシ", "大豆", "大豆粕", "マイロ"],
    currentDemand: {},
    siloIds: ["silo-tomakomai"],
  },
  // === 東北 ===
  {
    id: "port-hachinohe",
    name: "八戸港",
    coordinates: { lat: 40.5461, lng: 141.5081 },
    capacity: 40000,
    acceptableGrains: ["トウモロコシ", "大豆", "マイロ"],
    currentDemand: {},
    siloIds: ["silo-tohoku"],
  },
  {
    id: "port-kamaishi",
    name: "釜石港",
    coordinates: { lat: 39.2725, lng: 141.8857 },
    capacity: 30000,
    acceptableGrains: ["トウモロコシ", "大豆", "マイロ"],
    currentDemand: {},
    siloIds: ["silo-kamaishi"],
  },
  // === 関東 ===
  {
    id: "port-kashima",
    name: "鹿島港",
    coordinates: { lat: 35.9185, lng: 140.6667 },
    capacity: 150000,
    acceptableGrains: ["トウモロコシ", "大豆", "小麦", "マイロ"],
    currentDemand: {},
    siloIds: ["silo-kanto", "silo-zenno-kashima"],
  },
  {
    id: "port-chiba",
    name: "千葉港",
    coordinates: { lat: 35.6045, lng: 140.0945 },
    capacity: 50000,
    acceptableGrains: ["トウモロコシ", "大豆", "小麦"],
    currentDemand: {},
    siloIds: ["silo-nihon"],
  },
  // === 北陸・日本海側 ===
  {
    id: "port-niigata",
    name: "新潟港",
    coordinates: { lat: 37.9754, lng: 139.2381 },
    capacity: 30000,
    acceptableGrains: ["トウモロコシ", "大豆", "小麦"],
    currentDemand: {},
    siloIds: ["silo-zenno-niigata"],
  },
  // === 中部 ===
  {
    id: "port-chita",
    name: "知多港",
    coordinates: { lat: 35.0041, lng: 136.8516 },
    capacity: 80000,
    acceptableGrains: ["トウモロコシ", "大豆", "小麦", "大豆粕"],
    currentDemand: {},
    siloIds: ["silo-toyo", "silo-zenno-tokai"],
  },
  {
    id: "port-hekinan",
    name: "碧南港",
    coordinates: { lat: 34.8659, lng: 136.9643 },
    capacity: 30000,
    acceptableGrains: ["トウモロコシ"],
    currentDemand: {},
    siloIds: ["silo-nakanihon"],
  },
  // === 関西 ===
  {
    id: "port-kobe",
    name: "神戸港",
    coordinates: { lat: 34.7025, lng: 135.2718 },
    capacity: 60000,
    acceptableGrains: ["トウモロコシ", "大豆", "小麦"],
    currentDemand: {},
    siloIds: ["silo-hanshin", "silo-higashinada"],
  },
  // === 中国 ===
  {
    id: "port-mizushima",
    name: "水島港",
    coordinates: { lat: 34.4914, lng: 133.7299 },
    capacity: 100000,
    acceptableGrains: ["トウモロコシ", "大豆", "小麦", "菜種"],
    currentDemand: {},
    siloIds: ["silo-pgc-west", "silo-zenno-kurashiki", "silo-seto"],
  },
  // === 九州 ===
  {
    id: "port-hakata",
    name: "博多港",
    coordinates: { lat: 33.6057, lng: 130.3913 },
    capacity: 40000,
    acceptableGrains: ["トウモロコシ", "大豆", "小麦"],
    currentDemand: {},
    siloIds: ["silo-hakata"],
  },
  {
    id: "port-yatsushiro",
    name: "八代港",
    coordinates: { lat: 32.5345, lng: 130.5429 },
    capacity: 30000,
    acceptableGrains: ["トウモロコシ", "大豆", "小麦"],
    currentDemand: {},
    siloIds: ["silo-pgc-yatsushiro"],
  },
  {
    id: "port-shibushi",
    name: "志布志港",
    coordinates: { lat: 31.4588, lng: 131.0944 },
    capacity: 50000,
    acceptableGrains: ["トウモロコシ", "大豆", "牧草"],
    currentDemand: {},
    siloIds: ["silo-zenno-shibushi"],
  },
  {
    id: "port-kagoshima",
    name: "鹿児島港",
    coordinates: { lat: 31.5081, lng: 130.5303 },
    capacity: 100000,
    acceptableGrains: ["トウモロコシ", "大豆", "小麦", "糖蜜"],
    currentDemand: {},
    siloIds: ["silo-pgc-south"],
  },
];

// 港IDからサイロ情報を取得するヘルパー
export function getSilosForPort(portId: string) {
  const port = ports.find((p) => p.id === portId);
  if (!port) return [];
  return silos.filter((s) => port.siloIds.includes(s.id));
}

// 港を地域別にグループ化
export const portsByRegion = {
  hokkaido: ports.filter((p) =>
    ["port-kushiro", "port-tokachi", "port-tomakomai"].includes(p.id)
  ),
  tohoku: ports.filter((p) =>
    ["port-hachinohe", "port-kamaishi"].includes(p.id)
  ),
  kanto: ports.filter((p) => ["port-kashima", "port-chiba"].includes(p.id)),
  hokuriku: ports.filter((p) => ["port-niigata"].includes(p.id)),
  chubu: ports.filter((p) => ["port-chita", "port-hekinan"].includes(p.id)),
  kansai: ports.filter((p) => ["port-kobe"].includes(p.id)),
  chugoku: ports.filter((p) => ["port-mizushima"].includes(p.id)),
  kyushu: ports.filter((p) =>
    ["port-hakata", "port-yatsushiro", "port-shibushi", "port-kagoshima"].includes(
      p.id
    )
  ),
};
