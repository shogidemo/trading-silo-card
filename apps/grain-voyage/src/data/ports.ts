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
    mapPosition: { x: 630, y: 210 },
    capacity: 50000,
    acceptableGrains: ["トウモロコシ", "大豆", "マイロ"],
    currentDemand: {},
    siloIds: ["silo-zenno-kushiro", "silo-tokachi"],
  },
  {
    id: "port-tomakomai",
    name: "苫小牧港",
    coordinates: { lat: 42.641, lng: 141.6947 },
    mapPosition: { x: 545, y: 230 },
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
    mapPosition: { x: 545, y: 310 },
    capacity: 40000,
    acceptableGrains: ["トウモロコシ", "大豆", "マイロ"],
    currentDemand: {},
    siloIds: ["silo-tohoku"],
  },
  {
    id: "port-kamaishi",
    name: "釜石港",
    coordinates: { lat: 39.2725, lng: 141.8857 },
    mapPosition: { x: 545, y: 380 },
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
    mapPosition: { x: 515, y: 485 },
    capacity: 150000,
    acceptableGrains: ["トウモロコシ", "大豆", "小麦", "マイロ"],
    currentDemand: {},
    siloIds: ["silo-kanto", "silo-zenno-kashima", "silo-nihon"],
  },
  // === 北陸・日本海側 ===
  {
    id: "port-niigata",
    name: "新潟港",
    coordinates: { lat: 37.9754, lng: 139.2381 },
    mapPosition: { x: 470, y: 400 },
    capacity: 30000,
    acceptableGrains: ["トウモロコシ", "大豆", "小麦"],
    currentDemand: {},
    siloIds: ["silo-zenno-niigata"],
  },
  // === 中部 ===
  {
    id: "port-kinuura",
    name: "衣浦港",
    coordinates: { lat: 34.9, lng: 136.95 },
    mapPosition: { x: 390, y: 530 },
    capacity: 110000,
    acceptableGrains: ["トウモロコシ", "大豆", "小麦", "大豆粕"],
    currentDemand: {},
    siloIds: ["silo-toyo", "silo-zenno-tokai", "silo-nakanihon"],
  },
  // === 関西 ===
  {
    id: "port-kobe",
    name: "神戸港",
    coordinates: { lat: 34.7025, lng: 135.2718 },
    mapPosition: { x: 330, y: 535 },
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
    mapPosition: { x: 295, y: 545 },
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
    mapPosition: { x: 185, y: 580 },
    capacity: 40000,
    acceptableGrains: ["トウモロコシ", "大豆", "小麦"],
    currentDemand: {},
    siloIds: ["silo-hakata"],
  },
  {
    id: "port-yatsushiro",
    name: "八代港",
    coordinates: { lat: 32.5345, lng: 130.5429 },
    mapPosition: { x: 190, y: 620 },
    capacity: 30000,
    acceptableGrains: ["トウモロコシ", "大豆", "小麦"],
    currentDemand: {},
    siloIds: ["silo-pgc-yatsushiro"],
  },
  {
    id: "port-shibushi",
    name: "志布志港",
    coordinates: { lat: 31.4588, lng: 131.0944 },
    mapPosition: { x: 200, y: 660 },
    capacity: 50000,
    acceptableGrains: ["トウモロコシ", "大豆", "牧草"],
    currentDemand: {},
    siloIds: ["silo-zenno-shibushi"],
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
    ["port-kushiro", "port-tomakomai"].includes(p.id)
  ),
  tohoku: ports.filter((p) =>
    ["port-hachinohe", "port-kamaishi"].includes(p.id)
  ),
  kanto: ports.filter((p) => ["port-kashima"].includes(p.id)),
  hokuriku: ports.filter((p) => ["port-niigata"].includes(p.id)),
  chubu: ports.filter((p) => ["port-kinuura"].includes(p.id)),
  kansai: ports.filter((p) => ["port-kobe"].includes(p.id)),
  chugoku: ports.filter((p) => ["port-mizushima"].includes(p.id)),
  kyushu: ports.filter((p) =>
    ["port-hakata", "port-yatsushiro", "port-shibushi"].includes(p.id)
  ),
};
