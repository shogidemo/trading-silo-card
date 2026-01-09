import { SiloCard } from "@/types";

export const silos: SiloCard[] = [
  {
    id: "silo-kashima",
    category: "silo",
    name: "鹿島グレーンターミナル",
    description:
      "茨城県にある日本有数の穀物輸入基地。大型船舶の接岸が可能な深水港。",
    rarity: "rare",
    location: "茨城県神栖市",
    capacity: "約30万トン",
    grains: ["トウモロコシ", "大豆", "小麦"],
    establishedYear: 1975,
    operator: "鹿島埠頭株式会社",
  },
  {
    id: "silo-chiba",
    category: "silo",
    name: "千葉グレーンセンター",
    description:
      "首都圏への穀物供給を担う重要拠点。飼料用穀物の取扱いが中心。",
    rarity: "common",
    location: "千葉県千葉市",
    capacity: "約15万トン",
    grains: ["トウモロコシ", "大豆", "マイロ"],
    establishedYear: 1968,
    operator: "全農グレインターミナル",
  },
  {
    id: "silo-nagoya",
    category: "silo",
    name: "名古屋港グレーンサイロ",
    description:
      "中部地方の穀物物流の要。自動車産業と並ぶ名古屋港の重要機能。",
    rarity: "common",
    location: "愛知県名古屋市",
    capacity: "約20万トン",
    grains: ["小麦", "大豆", "トウモロコシ"],
    establishedYear: 1972,
    operator: "名古屋港管理組合",
  },
  {
    id: "silo-kobe",
    category: "silo",
    name: "神戸グレーンターミナル",
    description:
      "西日本最大級の穀物ターミナル。阪神工業地帯への供給拠点。",
    rarity: "rare",
    location: "兵庫県神戸市",
    capacity: "約25万トン",
    grains: ["小麦", "大麦", "大豆", "トウモロコシ"],
    establishedYear: 1965,
    operator: "神戸穀物ターミナル株式会社",
  },
  {
    id: "silo-hakata",
    category: "silo",
    name: "博多港穀物サイロ",
    description:
      "九州地方への穀物供給を支える。アジアに近い地理的優位性を活かす。",
    rarity: "common",
    location: "福岡県福岡市",
    capacity: "約12万トン",
    grains: ["小麦", "大豆", "トウモロコシ"],
    establishedYear: 1978,
    operator: "博多港ふ頭株式会社",
  },
];
