import { TraderCard } from "@/types";

export const traders: TraderCard[] = [
  {
    id: "trader-marubeni",
    category: "trader",
    name: "丸紅",
    description:
      "日本を代表する総合商社。穀物取扱では国内トップクラスの実績を持つ。",
    rarity: "legendary",
    foundedYear: 1858,
    headquarters: "東京都千代田区",
    mainProducts: ["小麦", "大豆", "トウモロコシ", "コーヒー豆"],
    globalPresence: ["北米", "南米", "オーストラリア", "アジア"],
    specialty:
      "米国ガビロン社買収により、穀物メジャーに匹敵する集荷・輸出能力を獲得",
  },
  {
    id: "trader-mitsui",
    category: "trader",
    name: "三井物産",
    description:
      "日本初の総合商社。鉄鉱石、原油と並び穀物は重要な取扱品目の一つ。",
    rarity: "legendary",
    foundedYear: 1876,
    headquarters: "東京都千代田区",
    mainProducts: ["小麦", "大豆", "菜種", "パーム油"],
    globalPresence: ["北米", "南米", "東南アジア", "オセアニア"],
    specialty: "ブラジルでの大豆事業、オーストラリアでの小麦事業に強み",
  },
  {
    id: "trader-itochu",
    category: "trader",
    name: "伊藤忠商事",
    description:
      "繊維から発展した総合商社。食料部門は収益の柱の一つ。",
    rarity: "legendary",
    foundedYear: 1858,
    headquarters: "大阪府大阪市・東京都港区",
    mainProducts: ["小麦", "大豆", "砂糖", "果汁"],
    globalPresence: ["北米", "南米", "中国", "東南アジア"],
    specialty: "ファミリーマートを傘下に持ち、川下までのバリューチェーンを構築",
  },
  {
    id: "trader-cargill",
    category: "trader",
    name: "カーギル",
    description:
      "世界最大の穀物メジャー。非上場企業として世界最大の売上を誇る。",
    rarity: "legendary",
    foundedYear: 1865,
    headquarters: "アメリカ・ミネソタ州",
    mainProducts: ["トウモロコシ", "大豆", "小麦", "綿花", "砂糖"],
    globalPresence: ["北米", "南米", "欧州", "アジア", "アフリカ"],
    specialty: "穀物の集荷から加工・販売まで垂直統合したビジネスモデル",
  },
  {
    id: "trader-adm",
    category: "trader",
    name: "ADM",
    description:
      "Archer Daniels Midland。世界有数の穀物加工・食品原料メーカー。",
    rarity: "rare",
    foundedYear: 1902,
    headquarters: "アメリカ・イリノイ州",
    mainProducts: ["大豆", "トウモロコシ", "小麦", "ココア"],
    globalPresence: ["北米", "南米", "欧州", "アジア"],
    specialty: "バイオ燃料（エタノール）生産で世界最大級の規模を持つ",
  },
];
