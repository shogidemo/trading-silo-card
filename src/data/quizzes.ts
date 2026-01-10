import { Quiz } from "@/types";

export const quizzes: Quiz[] = [
  // 穀物クイズ
  {
    id: "quiz-wheat-1",
    cardId: "grain-wheat",
    category: "grain",
    question: "日本で消費される小麦のうち、輸入品の割合はおよそ何%でしょうか？",
    options: [
      { text: "約50%", isCorrect: false },
      { text: "約65%", isCorrect: false },
      { text: "約85%", isCorrect: true },
      { text: "約95%", isCorrect: false },
    ],
    explanation:
      "日本の小麦自給率は約15%で、残りの約85%は主にアメリカ、カナダ、オーストラリアから輸入されています。",
  },
  {
    id: "quiz-soybean-1",
    cardId: "grain-soybean",
    category: "grain",
    question: "大豆が「畑の肉」と呼ばれる理由は何でしょうか？",
    options: [
      { text: "肉のような食感だから", isCorrect: false },
      { text: "タンパク質が豊富だから", isCorrect: true },
      { text: "肉と同じ価格だから", isCorrect: false },
      { text: "肉の代わりに使われるから", isCorrect: false },
    ],
    explanation:
      "大豆は約35%がタンパク質で構成されており、肉に匹敵する高いタンパク質含有量から「畑の肉」と呼ばれています。",
  },
  {
    id: "quiz-corn-1",
    cardId: "grain-corn",
    category: "grain",
    question: "世界で最も生産量が多い穀物は何でしょうか？",
    options: [
      { text: "小麦", isCorrect: false },
      { text: "米", isCorrect: false },
      { text: "トウモロコシ", isCorrect: true },
      { text: "大麦", isCorrect: false },
    ],
    explanation:
      "トウモロコシは年間約12億トンと、世界で最も生産量が多い穀物です。飼料やバイオ燃料など用途が幅広いことが理由です。",
  },
  {
    id: "quiz-rice-1",
    cardId: "grain-rice",
    category: "grain",
    question: "日本の米の自給率はおよそ何%でしょうか？",
    options: [
      { text: "約70%", isCorrect: false },
      { text: "約85%", isCorrect: false },
      { text: "約97%", isCorrect: true },
      { text: "約100%", isCorrect: false },
    ],
    explanation:
      "日本の米の自給率は約97%と非常に高く、主要穀物の中で最も自給率が高い作物です。",
  },
  {
    id: "quiz-barley-1",
    cardId: "grain-barley",
    category: "grain",
    question: "大麦が原料として使われていないものはどれでしょうか？",
    options: [
      { text: "ビール", isCorrect: false },
      { text: "麦茶", isCorrect: false },
      { text: "日本酒", isCorrect: true },
      { text: "ウイスキー", isCorrect: false },
    ],
    explanation:
      "日本酒は米を原料としています。大麦はビール、麦茶、ウイスキー、焼酎などの原料として使われます。",
  },

  // 商社クイズ
  {
    id: "quiz-marubeni-1",
    cardId: "trader-marubeni",
    category: "trader",
    question:
      "丸紅が買収し、穀物メジャーに匹敵する集荷能力を得た米国企業は？",
    options: [
      { text: "カーギル", isCorrect: false },
      { text: "ガビロン", isCorrect: true },
      { text: "ADM", isCorrect: false },
      { text: "ブンゲ", isCorrect: false },
    ],
    explanation:
      "丸紅は2013年に米国のガビロン社を約2,700億円で買収し、穀物の集荷・輸出能力を大幅に強化しました。",
  },
  {
    id: "quiz-mitsui-1",
    cardId: "trader-mitsui",
    category: "trader",
    question: "三井物産は何年に設立された、日本初の総合商社でしょうか？",
    options: [
      { text: "1858年", isCorrect: false },
      { text: "1876年", isCorrect: true },
      { text: "1900年", isCorrect: false },
      { text: "1920年", isCorrect: false },
    ],
    explanation:
      "三井物産は1876年（明治9年）に設立された、日本で最初の総合商社です。",
  },
  {
    id: "quiz-itochu-1",
    cardId: "trader-itochu",
    category: "trader",
    question: "伊藤忠商事が傘下に持つ、食料バリューチェーンの川下企業は？",
    options: [
      { text: "セブンイレブン", isCorrect: false },
      { text: "ローソン", isCorrect: false },
      { text: "ファミリーマート", isCorrect: true },
      { text: "ミニストップ", isCorrect: false },
    ],
    explanation:
      "伊藤忠商事はファミリーマートを完全子会社化し、穀物調達から小売りまでのバリューチェーンを構築しています。",
  },
  {
    id: "quiz-cargill-1",
    cardId: "trader-cargill",
    category: "trader",
    question: "世界最大の穀物メジャー「カーギル」の特徴として正しいものは？",
    options: [
      { text: "ニューヨーク証券取引所に上場", isCorrect: false },
      { text: "非上場の同族企業", isCorrect: true },
      { text: "国営企業", isCorrect: false },
      { text: "従業員数100人以下", isCorrect: false },
    ],
    explanation:
      "カーギルは非上場の同族企業でありながら、売上高は約15兆円と世界最大の非上場企業の一つです。",
  },
  {
    id: "quiz-adm-1",
    cardId: "trader-adm",
    category: "trader",
    question: "ADMが世界最大級の生産規模を持つ製品は何でしょうか？",
    options: [
      { text: "小麦粉", isCorrect: false },
      { text: "砂糖", isCorrect: false },
      { text: "バイオエタノール", isCorrect: true },
      { text: "大豆油", isCorrect: false },
    ],
    explanation:
      "ADMはトウモロコシを原料としたバイオエタノール生産で世界最大級の規模を誇り、再生可能エネルギー分野でも重要な役割を果たしています。",
  },

  // サイロクイズ
  {
    id: "quiz-tohoku-1",
    cardId: "silo-tohoku",
    category: "silo",
    question: "東北グレーンターミナルがある港はどこでしょうか？",
    options: [
      { text: "仙台港", isCorrect: false },
      { text: "八戸港", isCorrect: true },
      { text: "秋田港", isCorrect: false },
      { text: "酒田港", isCorrect: false },
    ],
    explanation:
      "東北グレーンターミナルは青森県八戸港にあり、東北最大級の飼料穀物サイロとして世界の穀倉地帯と東北の畜産を結んでいます。",
  },
  {
    id: "quiz-nihon-1",
    cardId: "silo-nihon",
    category: "silo",
    question: "日本サイロ千葉事業所のサイロ本数は何本でしょうか？",
    options: [
      { text: "約50本", isCorrect: false },
      { text: "約80本", isCorrect: false },
      { text: "約122本", isCorrect: true },
      { text: "約200本", isCorrect: false },
    ],
    explanation:
      "日本サイロ千葉事業所は122本のサイロを持ち、計13.5万トンの大規模収容力を誇る東日本の主要グレーンターミナルです。",
  },
  {
    id: "quiz-toyo-1",
    cardId: "silo-toyo",
    category: "silo",
    question: "東洋グレーンターミナルが中京地区で初めて導入したものは？",
    options: [
      { text: "自動倉庫システム", isCorrect: false },
      { text: "輸入大豆粕専用サイロ", isCorrect: true },
      { text: "太陽光発電設備", isCorrect: false },
      { text: "AI品質管理", isCorrect: false },
    ],
    explanation:
      "東洋グレーンターミナルは2008年に中京地区初となる輸入大豆粕専用サイロを竣工し、飼料原料の安定供給に貢献しています。",
  },
  {
    id: "quiz-kanto-1",
    cardId: "silo-kanto",
    category: "silo",
    question: "関東グレーンターミナルの特徴として正しいものは？",
    options: [
      { text: "日本最大の穀物取扱量を誇る", isCorrect: true },
      { text: "日本で最も古いサイロ", isCorrect: false },
      { text: "国営のサイロ", isCorrect: false },
      { text: "米専用のサイロ", isCorrect: false },
    ],
    explanation:
      "関東グレーンターミナルは茨城県鹿島港にあり、年間約400万トンの穀物を取り扱う日本一の穀物取扱量を誇るサイロです。",
  },
  {
    id: "quiz-hakata-1",
    cardId: "silo-hakata",
    category: "silo",
    question: "博多港サイロが設立されたのは何年でしょうか？",
    options: [
      { text: "1954年", isCorrect: false },
      { text: "1964年", isCorrect: true },
      { text: "1974年", isCorrect: false },
      { text: "1984年", isCorrect: false },
    ],
    explanation:
      "博多港サイロは1964年に設立され、60年以上にわたり九州の食を支える穀物サイロのリーディングカンパニーとして活躍しています。",
  },
];
