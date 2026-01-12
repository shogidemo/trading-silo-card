import { Quiz } from "@/types";
import { SOURCES } from "./sources";

export const grainQuizzes: Quiz[] = [
  // 穀物クイズ
  {
    id: "quiz-wheat-1",
    cardId: "grain-wheat",
    category: "grain",
    question: "日本の小麦が主に輸入される地域として適切なのはどれでしょうか？",
    options: [
      { text: "アメリカ・カナダ・オーストラリア", isCorrect: true },
      { text: "メキシコ・チリ・ペルー", isCorrect: false },
      { text: "インド・ネパール・ブータン", isCorrect: false },
      { text: "南アフリカ・エジプト・ナイジェリア", isCorrect: false },
    ],
    explanation:
      "日本の小麦は主にアメリカ・カナダ・オーストラリアなどから輸入され、港湾サイロを経由して製粉・食品工場へ供給されます。",
    sources: [SOURCES.maffWheatImportQa],
  },
  {
    id: "quiz-soybean-1",
    cardId: "grain-soybean",
    category: "grain",
    question: "大豆がサイロに多く集まる背景として正しいものはどれでしょうか？",
    options: [
      { text: "主に繊維製品の原料として使われるため", isCorrect: false },
      { text: "飼料や食品・油に幅広く使われるため", isCorrect: true },
      { text: "冷凍流通が難しく短期消費が前提だから", isCorrect: false },
      { text: "日本国内でほぼ自給できる作物だから", isCorrect: false },
    ],
    explanation:
      "大豆は豆腐・納豆・醤油などの食品に加え、食用油や飼料にも広く使われるため、大型サイロでの安定供給が重要になります。",
    sources: [SOURCES.maffSoybeanSituation],
  },
  {
    id: "quiz-corn-1",
    cardId: "grain-corn",
    category: "grain",
    question: "トウモロコシが港湾サイロで重要な理由として正しいものは？",
    options: [
      { text: "主に高級菓子の原料として使われる", isCorrect: false },
      { text: "日本国内のみで流通する作物だから", isCorrect: false },
      { text: "飼料・加工原料として用途が広い", isCorrect: true },
      { text: "貯蔵期間が極端に短い作物だから", isCorrect: false },
    ],
    explanation:
      "トウモロコシは飼料・コーンスターチ・バイオエタノールなど用途が広く、港湾サイロで大量に扱われる代表的な穀物です。",
    sources: [SOURCES.maffFeedMainIngredients, SOURCES.alicStarchUsage],
  },
  {
    id: "quiz-rice-1",
    cardId: "grain-rice",
    category: "grain",
    question: "米が加工・流通で使われる用途として誤っているものはどれでしょうか？",
    options: [
      { text: "日本酒", isCorrect: false },
      { text: "米粉", isCorrect: false },
      { text: "餅", isCorrect: false },
      { text: "小麦粉", isCorrect: true },
    ],
    explanation:
      "米は主食だけでなく日本酒・米粉・餅など幅広く加工されます。一方、小麦粉の原料は小麦です。",
    sources: [
      SOURCES.japansakeWhatIsSake,
      SOURCES.maffRiceFlour,
      SOURCES.wikipediaMochi,
      SOURCES.wikipediaWheatFlour,
    ],
  },
  {
    id: "quiz-barley-1",
    cardId: "grain-barley",
    category: "grain",
    question: "大麦が原料として使われるものはどれでしょうか？",
    options: [
      { text: "日本酒", isCorrect: false },
      { text: "ビール", isCorrect: true },
      { text: "豆腐", isCorrect: false },
      { text: "納豆", isCorrect: false },
    ],
    explanation:
      "大麦はビールや麦茶、ウイスキーなどの原料として使われ、港湾サイロで保管される主要穀物の一つです。",
    sources: [SOURCES.kirinBeerIngredients],
  },

  // 既存穀物の追加クイズ
  {
    id: "quiz-wheat-2",
    cardId: "grain-wheat",
    category: "grain",
    question: "小麦の品種で、パン用に適したものはどれでしょうか？",
    options: [
      { text: "強力粉（グルテン含有量が多い）", isCorrect: true },
      { text: "薄力粉（グルテン含有量が少ない）", isCorrect: false },
      { text: "中力粉（うどん向き）", isCorrect: false },
      { text: "全粒粉（ふすまを含む）", isCorrect: false },
    ],
    explanation:
      "強力粉はグルテン含有量が多く、パンのふくらみに適しています。薄力粉は菓子向け、中力粉はうどん向けです。",
    sources: [SOURCES.maffWheatSituation],
  },
  {
    id: "quiz-wheat-3",
    cardId: "grain-wheat",
    category: "grain",
    question: "日本の小麦の自給率として最も近いものはどれでしょうか？",
    options: [
      { text: "約15%", isCorrect: true },
      { text: "約50%", isCorrect: false },
      { text: "約75%", isCorrect: false },
      { text: "約97%", isCorrect: false },
    ],
    explanation:
      "日本の小麦の自給率は約15%程度で、大部分を輸入に頼っています。国産小麦は主に北海道で生産されています。",
    sources: [SOURCES.maffWheatImportQa],
  },
  {
    id: "quiz-soybean-2",
    cardId: "grain-soybean",
    category: "grain",
    question: "大豆の世界最大の生産国はどこでしょうか？",
    options: [
      { text: "ブラジル", isCorrect: true },
      { text: "日本", isCorrect: false },
      { text: "インド", isCorrect: false },
      { text: "オーストラリア", isCorrect: false },
    ],
    explanation:
      "ブラジルは世界最大の大豆生産国で、アメリカと並ぶ二大生産国です。広大な農地で大規模栽培が行われています。",
    sources: [SOURCES.maffSoybeanSituation],
  },
  {
    id: "quiz-soybean-3",
    cardId: "grain-soybean",
    category: "grain",
    question: "日本の大豆の自給率として最も近いものはどれでしょうか？",
    options: [
      { text: "約6%", isCorrect: true },
      { text: "約25%", isCorrect: false },
      { text: "約50%", isCorrect: false },
      { text: "約80%", isCorrect: false },
    ],
    explanation:
      "日本の大豆の自給率はわずか約6%で、大部分を輸入に頼っています。国産大豆は豆腐や納豆用として重宝されています。",
    sources: [SOURCES.maffSoybeanSelfSufficiency],
  },
  {
    id: "quiz-corn-2",
    cardId: "grain-corn",
    category: "grain",
    question: "日本で消費されるトウモロコシの主な用途はどれでしょうか？",
    options: [
      { text: "家畜の飼料", isCorrect: true },
      { text: "人間の主食", isCorrect: false },
      { text: "建築材料", isCorrect: false },
      { text: "衣料品の原料", isCorrect: false },
    ],
    explanation:
      "日本で消費されるトウモロコシの大部分は家畜の飼料として使用されます。コーンスターチや食用油にも加工されます。",
    sources: [SOURCES.maffFeedMainIngredients],
  },
  {
    id: "quiz-corn-3",
    cardId: "grain-corn",
    category: "grain",
    question: "トウモロコシの世界最大の生産国はどこでしょうか？",
    options: [
      { text: "アメリカ", isCorrect: true },
      { text: "日本", isCorrect: false },
      { text: "オーストラリア", isCorrect: false },
      { text: "ロシア", isCorrect: false },
    ],
    explanation:
      "アメリカは世界最大のトウモロコシ生産国で、世界生産量の約3分の1を占めています。バイオエタノール原料としても重要です。",
    sources: [SOURCES.maffCornSituation],
  },
  {
    id: "quiz-rice-2",
    cardId: "grain-rice",
    category: "grain",
    question: "日本の米の自給率として最も近いものはどれでしょうか？",
    options: [
      { text: "約97%", isCorrect: true },
      { text: "約50%", isCorrect: false },
      { text: "約15%", isCorrect: false },
      { text: "約6%", isCorrect: false },
    ],
    explanation:
      "日本の米の自給率は約97%と非常に高く、主要穀物の中で唯一自給率が高い作物です。",
    sources: [SOURCES.maffRiceSelfSufficiency],
  },
  {
    id: "quiz-rice-3",
    cardId: "grain-rice",
    category: "grain",
    question: "米の世界最大の生産国はどこでしょうか？",
    options: [
      { text: "中国", isCorrect: true },
      { text: "日本", isCorrect: false },
      { text: "アメリカ", isCorrect: false },
      { text: "ブラジル", isCorrect: false },
    ],
    explanation:
      "中国は世界最大の米生産国で、インドと並ぶ二大生産国です。アジアが世界の米生産の大部分を占めています。",
    sources: [SOURCES.maffRiceSelfSufficiency],
  },
  {
    id: "quiz-barley-2",
    cardId: "grain-barley",
    category: "grain",
    question: "大麦に含まれる健康成分として注目されているものはどれでしょうか？",
    options: [
      { text: "β-グルカン（食物繊維）", isCorrect: true },
      { text: "カプサイシン", isCorrect: false },
      { text: "カフェイン", isCorrect: false },
      { text: "タウリン", isCorrect: false },
    ],
    explanation:
      "大麦に含まれるβ-グルカンは水溶性食物繊維の一種で、コレステロール値の改善や血糖値の上昇抑制に効果があるとされています。",
    sources: [SOURCES.maffBarleySituation],
  },
  {
    id: "quiz-barley-3",
    cardId: "grain-barley",
    category: "grain",
    question: "大麦を主原料とする日本の伝統的な飲料はどれでしょうか？",
    options: [
      { text: "麦茶", isCorrect: true },
      { text: "緑茶", isCorrect: false },
      { text: "抹茶", isCorrect: false },
      { text: "ほうじ茶", isCorrect: false },
    ],
    explanation:
      "麦茶は大麦を焙煎して作られる日本の伝統的な飲料で、夏の水分補給に広く親しまれています。カフェインを含まないのも特徴です。",
    sources: [SOURCES.kirinBeerIngredients],
  },

  // ソルガム（マイロ）クイズ
  {
    id: "quiz-sorghum-1",
    cardId: "grain-sorghum",
    category: "grain",
    question: "ソルガムの別名として日本で使われているものはどれでしょうか？",
    options: [
      { text: "マイロ", isCorrect: true },
      { text: "キビ", isCorrect: false },
      { text: "ヒエ", isCorrect: false },
      { text: "アワ", isCorrect: false },
    ],
    explanation:
      "ソルガムは日本ではマイロとも呼ばれ、飼料用穀物として港湾サイロで多く取り扱われています。",
    sources: [SOURCES.maffSorghumFeed],
  },
  {
    id: "quiz-sorghum-2",
    cardId: "grain-sorghum",
    category: "grain",
    question: "ソルガムの特徴として正しいものはどれでしょうか？",
    options: [
      { text: "乾燥に強く、アフリカ原産の穀物", isCorrect: true },
      { text: "寒冷地で育つ北欧原産の穀物", isCorrect: false },
      { text: "水田で育つアジア原産の穀物", isCorrect: false },
      { text: "高温多湿を好む南米原産の穀物", isCorrect: false },
    ],
    explanation:
      "ソルガムはアフリカ原産で、乾燥に強い特性を持ちます。アフリカやインドでは主食として、日本では主に飼料として利用されます。",
    sources: [SOURCES.faoSorghum],
  },
  {
    id: "quiz-sorghum-3",
    cardId: "grain-sorghum",
    category: "grain",
    question: "ソルガムが小麦アレルギーの代替穀物として注目される理由は？",
    options: [
      { text: "グルテンを含まないため", isCorrect: true },
      { text: "タンパク質が少ないため", isCorrect: false },
      { text: "カロリーが低いため", isCorrect: false },
      { text: "水分含有量が多いため", isCorrect: false },
    ],
    explanation:
      "ソルガムはグルテンを含まないため、小麦アレルギーやセリアック病の方の代替穀物として注目されています。",
    sources: [SOURCES.wikipediaGlutenFree],
  },

  // 菜種（キャノーラ）クイズ
  {
    id: "quiz-canola-1",
    cardId: "grain-canola",
    category: "grain",
    question: "キャノーラ（Canola）という名前の由来として正しいものは？",
    options: [
      { text: "Canadian Oil Low Acidの略", isCorrect: true },
      { text: "カナダの地名から", isCorrect: false },
      { text: "発見者の名前から", isCorrect: false },
      { text: "花の色から", isCorrect: false },
    ],
    explanation:
      "キャノーラは「Canadian Oil Low Acid」の略で、1970年代にカナダで品種改良され、エルカ酸を低減した食用向け品種です。",
    sources: [SOURCES.canolaCouncil],
  },
  {
    id: "quiz-canola-2",
    cardId: "grain-canola",
    category: "grain",
    question: "菜種油の主な用途として正しいものはどれでしょうか？",
    options: [
      { text: "食用油（サラダ油・揚げ油）", isCorrect: true },
      { text: "工業用潤滑油のみ", isCorrect: false },
      { text: "香水の原料", isCorrect: false },
      { text: "医薬品の原料", isCorrect: false },
    ],
    explanation:
      "菜種油は日本で最も多く使われる食用油の一つで、サラダ油や揚げ油として広く利用されています。",
    sources: [SOURCES.maffCanolaSituation],
  },
  {
    id: "quiz-canola-3",
    cardId: "grain-canola",
    category: "grain",
    question: "菜種の世界最大の生産国はどこでしょうか？",
    options: [
      { text: "カナダ", isCorrect: true },
      { text: "日本", isCorrect: false },
      { text: "ブラジル", isCorrect: false },
      { text: "アメリカ", isCorrect: false },
    ],
    explanation:
      "カナダは世界最大の菜種（キャノーラ）生産国で、広大な農地で大規模栽培が行われています。日本もカナダから多く輸入しています。",
    sources: [SOURCES.canolaCouncil],
  },
];
