import { SiloCard } from "@/types";

export const silos: SiloCard[] = [
  {
    id: "silo-kanto",
    category: "silo",
    name: "関東グレーンターミナル",
    description:
      "茨城県鹿島港にある日本一の穀物取扱量を誇るサイロ。年間約400万トンを取り扱う。",
    imageUrl: "/images/silos/kanto-grain-terminal.jpg",
    location: "茨城県神栖市",
    coordinates: { lat: 35.8889, lng: 140.6653 },
    capacity: "約50万トン",
    grains: ["トウモロコシ", "大豆", "小麦", "マイロ"],
    establishedYear: 1986,
    operator: "関東グレーンターミナル株式会社",
  },
  {
    id: "silo-tohoku",
    category: "silo",
    name: "東北グレーンターミナル",
    description:
      "青森県八戸港にある東北最大級の飼料穀物サイロ。6社の飼料メーカーが集積。",
    imageUrl: "/images/silos/tohoku-grain-terminal.jpg",
    location: "青森県八戸市",
    coordinates: { lat: 40.5276, lng: 141.5488 },
    capacity: "約12万トン",
    grains: ["トウモロコシ", "大豆", "マイロ"],
    establishedYear: 1982,
    operator: "東北グレーンターミナル株式会社",
  },
  {
    id: "silo-nihon",
    category: "silo",
    name: "日本サイロ千葉事業所",
    description:
      "東日本における大型グレーンターミナル。122本・13.5万トンの大規模収容力を誇る。",
    imageUrl: "/images/silos/nihon-silo-chiba.webp",
    location: "千葉県千葉市",
    coordinates: { lat: 35.5784, lng: 140.1024 },
    capacity: "約13.5万トン",
    grains: ["トウモロコシ", "大豆", "小麦"],
    establishedYear: 1967,
    operator: "日本サイロ株式会社",
  },
  {
    id: "silo-toyo",
    category: "silo",
    name: "東洋グレーンターミナル",
    description:
      "関東グレーングループ2番目のサイロ。中京地区初の輸入大豆粕専用サイロを保有。",
    imageUrl: "/images/silos/toyo-grain-terminal.jpg",
    location: "愛知県知多市",
    coordinates: { lat: 35.0063, lng: 136.8714 },
    capacity: "約8万トン",
    grains: ["小麦", "大豆", "大豆粕"],
    establishedYear: 1972,
    operator: "東洋グレーンターミナル株式会社",
  },
  {
    id: "silo-hakata",
    category: "silo",
    name: "博多港サイロ",
    description:
      "1964年設立。九州の食を支える穀物サイロのリーディングカンパニー。",
    imageUrl: "/images/silos/hakata-port-silo.jpg",
    location: "福岡県福岡市",
    coordinates: { lat: 33.6152, lng: 130.4062 },
    capacity: "約6万トン",
    grains: ["小麦", "大豆", "トウモロコシ"],
    establishedYear: 1964,
    operator: "博多港サイロ株式会社",
  },
];
