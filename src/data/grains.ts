import { GrainCard } from "@/types";

export const grains: GrainCard[] = [
  {
    id: "grain-wheat",
    category: "grain",
    name: "小麦",
    description:
      "世界三大穀物の一つ。パン、麺類、菓子など幅広い食品の原料となる。",
    imageUrl: "/images/grains/wheat.jpg",
    imageAttribution: {
      label: "Wheat close-up (Wikimedia Commons)",
      url: "https://commons.wikimedia.org/wiki/File:Wheat_close-up.JPG",
    },
    origins: ["アメリカ", "カナダ", "オーストラリア", "フランス"],
    uses: ["パン", "麺類", "菓子", "醤油", "味噌"],
    nutrients: ["炭水化物", "タンパク質", "食物繊維", "ビタミンB群"],
    annualProduction: "約7.8億トン（世界）",
    trivia:
      "日本で消費される小麦の約85%は輸入品。国産小麦は主に北海道で生産される。",
  },
  {
    id: "grain-soybean",
    category: "grain",
    name: "大豆",
    description:
      "「畑の肉」と呼ばれる高タンパク作物。日本食文化に欠かせない食材。",
    imageUrl: "/images/grains/soybean.jpg",
    imageAttribution: {
      label: "Soybean Pods (Wikimedia Commons)",
      url: "https://commons.wikimedia.org/wiki/File:Soybean_Pods_(10059842724).jpg",
    },
    origins: ["アメリカ", "ブラジル", "アルゼンチン", "中国"],
    uses: ["豆腐", "納豆", "醤油", "味噌", "食用油", "飼料"],
    nutrients: ["タンパク質", "脂質", "イソフラボン", "食物繊維"],
    annualProduction: "約3.5億トン（世界）",
    trivia:
      "大豆の約7割は家畜の飼料として使用される。日本の自給率はわずか約6%。",
  },
  {
    id: "grain-corn",
    category: "grain",
    name: "トウモロコシ",
    description:
      "世界で最も生産量が多い穀物。食用から工業用まで幅広く利用される。",
    imageUrl: "/images/grains/corn.jpg",
    imageAttribution: {
      label: "Corncobs (Wikimedia Commons)",
      url: "https://commons.wikimedia.org/wiki/File:Corncobs.jpg",
    },
    origins: ["アメリカ", "ブラジル", "アルゼンチン", "ウクライナ"],
    uses: ["飼料", "コーンスターチ", "バイオエタノール", "食用油"],
    nutrients: ["炭水化物", "食物繊維", "ビタミンB1", "カリウム"],
    annualProduction: "約12億トン（世界）",
    trivia:
      "アメリカ産トウモロコシの約40%はバイオエタノール生産に使用されている。",
  },
  {
    id: "grain-rice",
    category: "grain",
    name: "米",
    description: "アジアの主食。日本人の食卓に欠かせない穀物。",
    imageUrl: "/images/grains/rice.jpg",
    imageAttribution: {
      label: "A bowl of rice (Wikimedia Commons)",
      url: "https://commons.wikimedia.org/wiki/File:A_bowl_of_rice.jpg",
    },
    origins: ["中国", "インド", "インドネシア", "日本"],
    uses: ["主食", "日本酒", "米粉", "餅", "煎餅"],
    nutrients: ["炭水化物", "タンパク質", "ビタミンB1", "マグネシウム"],
    annualProduction: "約5億トン（世界）",
    trivia:
      "日本の米の自給率は約97%。品種改良により、コシヒカリなど300種以上が栽培されている。",
  },
  {
    id: "grain-barley",
    category: "grain",
    name: "大麦",
    description: "ビールや麦茶の原料として知られる古代からの穀物。",
    imageUrl: "/images/grains/barley.jpg",
    imageAttribution: {
      label: "Barley ears (Wikimedia Commons)",
      url: "https://commons.wikimedia.org/wiki/File:Barley_ears.jpg",
    },
    origins: ["ロシア", "ドイツ", "フランス", "カナダ"],
    uses: ["ビール", "麦茶", "麦飯", "麦味噌", "ウイスキー"],
    nutrients: ["食物繊維", "β-グルカン", "ビタミンB群", "ミネラル"],
    annualProduction: "約1.5億トン（世界）",
    trivia: "大麦は人類が最初に栽培した穀物の一つ。約1万年前から栽培されている。",
  },
  {
    id: "grain-sorghum",
    category: "grain",
    name: "ソルガム",
    description:
      "世界5大穀物の一つ。マイロとも呼ばれ、飼料用途が多い乾燥に強い穀物。",
    imageUrl: "/images/grains/sorghum.jpg",
    imageAttribution: {
      label: "Sorghum bicolor (Wikimedia Commons)",
      url: "https://commons.wikimedia.org/wiki/File:Sorghum_bicolor03.jpg",
    },
    origins: ["アメリカ", "ナイジェリア", "スーダン", "エチオピア"],
    uses: ["飼料", "食用（アフリカ・インド）", "バイオエタノール", "醸造"],
    nutrients: ["炭水化物", "タンパク質", "食物繊維", "鉄分"],
    annualProduction: "約6,000万トン（世界）",
    trivia:
      "アフリカ原産で約5,000年前から栽培。グルテンフリーのため、小麦アレルギーの代替穀物としても注目。",
  },
  {
    id: "grain-canola",
    category: "grain",
    name: "菜種",
    description:
      "キャノーラ油の原料となる油糧種子。日本の食用油の主要原料。",
    imageUrl: "/images/grains/canola.jpg",
    imageAttribution: {
      label: "Canola field (Wikimedia Commons)",
      url: "https://commons.wikimedia.org/wiki/File:Canola_field_in_Hokkaido.jpg",
    },
    origins: ["カナダ", "オーストラリア", "中国", "ドイツ"],
    uses: ["食用油", "マーガリン", "バイオディーゼル", "飼料（油粕）"],
    nutrients: ["オレイン酸", "リノール酸", "ビタミンE", "オメガ3脂肪酸"],
    annualProduction: "約7,500万トン（世界）",
    trivia:
      "キャノーラ（Canola）は「Canadian Oil Low Acid」の略。1970年代にカナダで品種改良された。",
  },
];
