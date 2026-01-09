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
    id: "quiz-kashima-1",
    cardId: "silo-kashima",
    category: "silo",
    question: "鹿島グレーンターミナルの貯蔵能力はおよそ何万トンでしょうか？",
    options: [
      { text: "約10万トン", isCorrect: false },
      { text: "約20万トン", isCorrect: false },
      { text: "約30万トン", isCorrect: true },
      { text: "約50万トン", isCorrect: false },
    ],
    explanation:
      "鹿島グレーンターミナルは約30万トンの貯蔵能力を持ち、日本有数の穀物輸入基地として機能しています。",
  },
  {
    id: "quiz-chiba-1",
    cardId: "silo-chiba",
    category: "silo",
    question: "千葉グレーンセンターを運営している組織は？",
    options: [
      { text: "千葉県庁", isCorrect: false },
      { text: "全農グレインターミナル", isCorrect: true },
      { text: "丸紅", isCorrect: false },
      { text: "日本郵船", isCorrect: false },
    ],
    explanation:
      "千葉グレーンセンターは全農（全国農業協同組合連合会）グループが運営する重要な穀物物流拠点です。",
  },
  {
    id: "quiz-nagoya-1",
    cardId: "silo-nagoya",
    category: "silo",
    question: "名古屋港グレーンサイロが設立されたのは何年でしょうか？",
    options: [
      { text: "1960年", isCorrect: false },
      { text: "1972年", isCorrect: true },
      { text: "1985年", isCorrect: false },
      { text: "1990年", isCorrect: false },
    ],
    explanation:
      "名古屋港グレーンサイロは1972年に設立され、中部地方の穀物物流を50年以上支えています。",
  },
  {
    id: "quiz-kobe-1",
    cardId: "silo-kobe",
    category: "silo",
    question: "神戸グレーンターミナルの貯蔵能力は西日本でどのような位置づけ？",
    options: [
      { text: "西日本で3番目", isCorrect: false },
      { text: "西日本最大級", isCorrect: true },
      { text: "西日本で最小", isCorrect: false },
      { text: "全国平均程度", isCorrect: false },
    ],
    explanation:
      "神戸グレーンターミナルは約25万トンの貯蔵能力を持ち、西日本最大級の穀物ターミナルです。",
  },
  {
    id: "quiz-hakata-1",
    cardId: "silo-hakata",
    category: "silo",
    question: "博多港穀物サイロの地理的優位性として挙げられるのは？",
    options: [
      { text: "アメリカに近い", isCorrect: false },
      { text: "ヨーロッパに近い", isCorrect: false },
      { text: "アジアに近い", isCorrect: true },
      { text: "オーストラリアに近い", isCorrect: false },
    ],
    explanation:
      "博多港は韓国や中国などアジア諸国に近く、この地理的優位性を活かした物流拠点となっています。",
  },
];
