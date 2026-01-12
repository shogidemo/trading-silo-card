import { TraderCard } from "../types";

export const traders: TraderCard[] = [
  {
    id: "trader-marubeni",
    category: "trader",
    name: "丸紅",
    description:
      "日本を代表する総合商社。穀物取扱では国内トップクラスの実績を持つ。",
    imageUrl: "/images/traders/marubeni.svg",
    imageAttribution: {
      label: "Marubeni Logo (Wikimedia Commons)",
      url: "https://commons.wikimedia.org/wiki/File:Marubeni_Logo.svg",
    },
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
    imageUrl: "/images/traders/mitsui.svg",
    imageAttribution: {
      label: "MITSUI Global header-logo image (Wikimedia Commons)",
      url: "https://commons.wikimedia.org/wiki/File:MITSUI_Global_header-logo_image.svg",
    },
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
    imageUrl: "/images/traders/itochu.png",
    imageAttribution: {
      label: "Itochu-Logo (Wikimedia Commons)",
      url: "https://commons.wikimedia.org/wiki/File:Itochu-Logo.svg",
    },
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
    imageUrl: "/images/traders/cargill.svg",
    imageAttribution: {
      label: "Cargill logo (Wikimedia Commons)",
      url: "https://commons.wikimedia.org/wiki/File:Cargill_logo.svg",
    },
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
    imageUrl: "/images/traders/adm.png",
    imageAttribution: {
      label: "Archer Daniels Midland logo (Wikimedia Commons)",
      url: "https://commons.wikimedia.org/wiki/File:Archer_Daniels_Midland_logo.svg",
    },
    foundedYear: 1902,
    headquarters: "アメリカ・イリノイ州",
    mainProducts: ["大豆", "トウモロコシ", "小麦", "ココア"],
    globalPresence: ["北米", "南米", "欧州", "アジア"],
    specialty: "バイオ燃料（エタノール）生産で世界最大級の規模を持つ",
  },
  {
    id: "trader-mitsubishi",
    category: "trader",
    name: "三菱商事",
    description:
      "日本を代表する総合商社。穀物・飼料原料の調達から販売まで幅広く展開。",
    imageUrl: "/images/traders/mitsubishi.svg",
    imageAttribution: {
      label: "Mitsubishi Corporation Logo (Wikimedia Commons)",
      url: "https://commons.wikimedia.org/wiki/File:Mitsubishi_Corporation.svg",
    },
    foundedYear: 1954,
    headquarters: "東京都千代田区",
    mainProducts: ["トウモロコシ", "大豆", "小麦", "飼料原料"],
    globalPresence: ["北米", "南米", "アジア", "オセアニア"],
    specialty: "調達から販売までのサプライチェーン構築に強み",
  },
  {
    id: "trader-sumitomo",
    category: "trader",
    name: "住友商事",
    description:
      "総合商社として食料・穀物の調達から供給までを担う。",
    imageUrl: "/images/traders/sumitomo.svg",
    imageAttribution: {
      label: "Sumitomo Corporation logo (Wikimedia Commons)",
      url: "https://commons.wikimedia.org/wiki/File:Sumitomo_Corporation_logo.svg",
    },
    foundedYear: 1919,
    headquarters: "東京都千代田区",
    mainProducts: ["小麦", "大豆", "トウモロコシ", "砂糖"],
    globalPresence: ["北米", "南米", "アジア", "オセアニア"],
    specialty: "安定供給に向けた調達ネットワークの構築",
  },
  {
    id: "trader-toyota-tsusho",
    category: "trader",
    name: "豊田通商",
    description:
      "自動車関連に加え、食料・穀物のトレーディングも手掛ける総合商社。",
    imageUrl: "/images/traders/toyota-tsusho.svg",
    imageAttribution: {
      label: "Toyota Tsusho Corporation Logo (Wikimedia Commons)",
      url: "https://commons.wikimedia.org/wiki/File:Toyota_Tsusho_Corporation.svg",
    },
    foundedYear: 1948,
    headquarters: "愛知県名古屋市",
    mainProducts: ["トウモロコシ", "大豆", "小麦", "飼料原料"],
    globalPresence: ["北米", "南米", "アジア", "アフリカ"],
    specialty: "アジア・中南米での調達と国内供給に強み",
  },
  {
    id: "trader-sojitz",
    category: "trader",
    name: "双日",
    description:
      "食料・農業分野で原料調達から国内供給までを担う総合商社。",
    imageUrl: "/images/traders/sojitz.svg",
    imageAttribution: {
      label: "Sojitz Corporation Logo (Wikimedia Commons)",
      url: "https://commons.wikimedia.org/wiki/File:Sojitz_Corporation_Logo.svg",
    },
    foundedYear: 2003,
    headquarters: "東京都千代田区",
    mainProducts: ["小麦", "大豆", "トウモロコシ", "飼料原料"],
    globalPresence: ["北米", "南米", "アジア", "オセアニア"],
    specialty: "食品原料の調達と国内サプライチェーンの構築",
  },
  {
    id: "trader-kanematsu",
    category: "trader",
    name: "兼松",
    description:
      "食料・飼料分野に強みを持つ老舗商社。穀物の輸入・供給を担う。",
    imageUrl: "/images/traders/kanematsu.svg",
    imageAttribution: {
      label: "兼松株式会社 公式サイト",
      url: "https://www.kanematsu.co.jp/",
    },
    foundedYear: 1889,
    headquarters: "東京都港区",
    mainProducts: ["小麦", "大豆", "トウモロコシ", "飼料原料"],
    globalPresence: ["北米", "南米", "アジア", "オセアニア"],
    specialty: "飼料原料の安定輸入と国内供給に強み",
  },
  {
    id: "trader-nittetsu",
    category: "trader",
    name: "日鉄物産",
    description:
      "素材分野に加え、食品・穀物などの取引も手掛ける商社。",
    imageUrl: "/images/traders/nittetsu.webp",
    imageAttribution: {
      label: "日鉄物産株式会社 公式サイト",
      url: "https://www.nst.nipponsteel.com/",
    },
    foundedYear: 1950,
    headquarters: "東京都中央区",
    mainProducts: ["小麦", "大豆", "トウモロコシ", "飼料原料"],
    globalPresence: ["北米", "南米", "アジア", "オセアニア"],
    specialty: "食品・飼料原料の調達と安定供給を支える",
  },
];
