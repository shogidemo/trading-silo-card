import { Quiz } from "@/types";
import { SOURCES } from "./sources";

export const traderQuizzes: Quiz[] = [
  // 商社クイズ
  {
    id: "quiz-marubeni-1",
    cardId: "trader-marubeni",
    category: "trader",
    question:
      "丸紅が穀物の集荷・輸出能力を強化するために買収した米国企業は？",
    options: [
      { text: "カーギル", isCorrect: false },
      { text: "ガビロン", isCorrect: true },
      { text: "ADM", isCorrect: false },
      { text: "ブンゲ", isCorrect: false },
    ],
    explanation:
      "丸紅は2012年に米国の穀物会社Gavilon Groupの買収を発表（買収額は約26億米ドル）し、2013年に買収を完了しました。",
    sources: [SOURCES.marubeniGavilonAcquisition, SOURCES.marubeniGavilonCompletion],
  },
  {
    id: "quiz-marubeni-2",
    cardId: "trader-marubeni",
    category: "trader",
    question: "丸紅がガビロンを買収した際の買収額として近いものは？",
    options: [
      { text: "約5億米ドル", isCorrect: false },
      { text: "約50億米ドル", isCorrect: false },
      { text: "約100億米ドル", isCorrect: false },
      { text: "約26億米ドル", isCorrect: true },
    ],
    explanation:
      "丸紅は2012年に約26億米ドル（約2,700億円）でガビロンの買収を発表し、穀物メジャーに匹敵する集荷・輸出能力を獲得しました。",
    sources: [SOURCES.marubeniGavilonAcquisition],
  },
  {
    id: "quiz-marubeni-3",
    cardId: "trader-marubeni",
    category: "trader",
    question: "丸紅の創業年として正しいものは？",
    options: [
      { text: "1858年", isCorrect: true },
      { text: "1876年", isCorrect: false },
      { text: "1902年", isCorrect: false },
      { text: "1919年", isCorrect: false },
    ],
    explanation:
      "丸紅は1858年に創業した日本を代表する総合商社で、穀物取扱では国内トップクラスの実績を持ちます。",
    sources: [SOURCES.marubeniGavilonAcquisition],
  },
  {
    id: "quiz-mitsui-1",
    cardId: "trader-mitsui",
    category: "trader",
    question: "三井物産の穀物事業の強みとして正しいものはどれでしょうか？",
    options: [
      { text: "北米の米専用サイロに特化", isCorrect: false },
      { text: "砂糖とコーヒー豆の専業商社", isCorrect: false },
      { text: "国内流通のみを担う企業", isCorrect: false },
      { text: "ブラジルの大豆と豪州の小麦に強み", isCorrect: true },
    ],
    explanation:
      "三井物産はブラジルの大豆事業やオーストラリアの小麦事業に強みがあり、国際的な供給網を持っています。",
    sources: [SOURCES.mitsuiBrazilAgribusiness, SOURCES.mitsuiAgricultureAustralia],
  },
  {
    id: "quiz-mitsui-2",
    cardId: "trader-mitsui",
    category: "trader",
    question: "三井物産の創業年として正しいものは？",
    options: [
      { text: "1876年", isCorrect: true },
      { text: "1865年", isCorrect: false },
      { text: "1858年", isCorrect: false },
      { text: "1902年", isCorrect: false },
    ],
    explanation:
      "三井物産は1876年に創業した日本初の総合商社で、鉄鉱石、原油と並び穀物は重要な取扱品目の一つです。",
    sources: [SOURCES.mitsuiBrazilAgribusiness],
  },
  {
    id: "quiz-mitsui-3",
    cardId: "trader-mitsui",
    category: "trader",
    question: "三井物産が穀物事業で強みを持つ南米の国は？",
    options: [
      { text: "アルゼンチン", isCorrect: false },
      { text: "ブラジル", isCorrect: true },
      { text: "チリ", isCorrect: false },
      { text: "ペルー", isCorrect: false },
    ],
    explanation:
      "三井物産はブラジルでの大豆事業に強みがあり、南米からの穀物調達で重要な役割を担っています。",
    sources: [SOURCES.mitsuiBrazilAgribusiness],
  },
  {
    id: "quiz-itochu-1",
    cardId: "trader-itochu",
    category: "trader",
    question: "伊藤忠商事の食料バリューチェーンの川下を担う企業は？",
    options: [
      { text: "セブンイレブン", isCorrect: false },
      { text: "ローソン", isCorrect: false },
      { text: "ファミリーマート", isCorrect: true },
      { text: "ミニストップ", isCorrect: false },
    ],
    explanation:
      "伊藤忠商事はファミリーマートを完全子会社化し、穀物調達から小売りまでのバリューチェーンを構築しています。",
    sources: [SOURCES.familymartItochuWhollyOwned],
  },
  {
    id: "quiz-itochu-2",
    cardId: "trader-itochu",
    category: "trader",
    question: "伊藤忠商事がファミリーマートを完全子会社化した年は？",
    options: [
      { text: "2015年", isCorrect: false },
      { text: "2020年", isCorrect: true },
      { text: "2018年", isCorrect: false },
      { text: "2022年", isCorrect: false },
    ],
    explanation:
      "伊藤忠商事は2020年にファミリーマートを完全子会社化し、食料バリューチェーンの川下までを統合しました。",
    sources: [SOURCES.familymartItochuWhollyOwned],
  },
  {
    id: "quiz-itochu-3",
    cardId: "trader-itochu",
    category: "trader",
    question: "伊藤忠商事の創業の地として正しい都市は？",
    options: [
      { text: "東京", isCorrect: false },
      { text: "大阪", isCorrect: true },
      { text: "名古屋", isCorrect: false },
      { text: "神戸", isCorrect: false },
    ],
    explanation:
      "伊藤忠商事は1858年に創業した繊維から発展した総合商社で、創業の地は大阪です。現在は大阪と東京に本社を置いています。",
    sources: [SOURCES.familymartItochuWhollyOwned],
  },
  {
    id: "quiz-cargill-1",
    cardId: "trader-cargill",
    category: "trader",
    question: "カーギルの事業モデルの特徴として正しいものは？",
    options: [
      { text: "ニューヨーク証券取引所に上場", isCorrect: false },
      { text: "非上場の同族企業", isCorrect: true },
      { text: "国営企業", isCorrect: false },
      { text: "従業員数100人以下", isCorrect: false },
    ],
    explanation:
      "カーギルは非上場の同族企業として運営される、世界最大級の農業・食料関連企業の一つです。",
    sources: [SOURCES.cargillAbout],
  },
  {
    id: "quiz-cargill-2",
    cardId: "trader-cargill",
    category: "trader",
    question: "カーギルの創業年として正しいものは？",
    options: [
      { text: "1858年", isCorrect: false },
      { text: "1902年", isCorrect: false },
      { text: "1919年", isCorrect: false },
      { text: "1865年", isCorrect: true },
    ],
    explanation:
      "カーギルは1865年に創業した世界最大の穀物メジャーで、非上場企業として世界最大の売上を誇ります。",
    sources: [SOURCES.cargillAbout],
  },
  {
    id: "quiz-cargill-3",
    cardId: "trader-cargill",
    category: "trader",
    question: "カーギルの本社がある米国の州は？",
    options: [
      { text: "ミネソタ州", isCorrect: true },
      { text: "イリノイ州", isCorrect: false },
      { text: "カリフォルニア州", isCorrect: false },
      { text: "テキサス州", isCorrect: false },
    ],
    explanation:
      "カーギルの本社はアメリカ・ミネソタ州にあり、穀物の集荷から加工・販売まで垂直統合したビジネスモデルを展開しています。",
    sources: [SOURCES.cargillAbout],
  },
  {
    id: "quiz-adm-1",
    cardId: "trader-adm",
    category: "trader",
    question: "ADMが大規模に展開する分野はどれでしょうか？",
    options: [
      { text: "小麦粉", isCorrect: false },
      { text: "砂糖", isCorrect: false },
      { text: "バイオエタノール", isCorrect: true },
      { text: "大豆油", isCorrect: false },
    ],
    explanation:
      "ADMはBioenergy事業としてエタノール等のバイオ燃料を生産しており、主要なエタノール生産企業の一つです。",
    sources: [SOURCES.admBioenergy, SOURCES.secTopEthanolProducers],
  },
  {
    id: "quiz-adm-2",
    cardId: "trader-adm",
    category: "trader",
    question: "ADM（Archer Daniels Midland）の創業年として正しいものは？",
    options: [
      { text: "1865年", isCorrect: false },
      { text: "1876年", isCorrect: false },
      { text: "1919年", isCorrect: false },
      { text: "1902年", isCorrect: true },
    ],
    explanation:
      "ADM（Archer Daniels Midland）は1902年に創業した世界有数の穀物加工・食品原料メーカーです。",
    sources: [SOURCES.admBioenergy],
  },
  {
    id: "quiz-adm-3",
    cardId: "trader-adm",
    category: "trader",
    question: "ADMの本社がある米国の州は？",
    options: [
      { text: "イリノイ州", isCorrect: true },
      { text: "ミネソタ州", isCorrect: false },
      { text: "ネブラスカ州", isCorrect: false },
      { text: "アイオワ州", isCorrect: false },
    ],
    explanation:
      "ADMの本社はアメリカ・イリノイ州にあり、バイオ燃料（エタノール）生産で世界最大級の規模を誇ります。",
    sources: [SOURCES.admBioenergy],
  },
  {
    id: "quiz-mitsubishi-1",
    cardId: "trader-mitsubishi",
    category: "trader",
    question:
      "三菱商事が2014年に完全子会社化し、ノルウェー・チリ・カナダでサーモン養殖を行う企業は？",
    options: [
      { text: "Marine Harvest", isCorrect: false },
      { text: "SalMar", isCorrect: false },
      { text: "Leroy Seafood", isCorrect: false },
      { text: "Cermaq", isCorrect: true },
    ],
    explanation:
      "三菱商事は2014年にCermaq Group ASを完全子会社化し、サーモン養殖事業に本格参入しました。生産から加工・販売まで一貫した垂直統合型事業を展開しています。",
    sources: [SOURCES.mitsubishiCermaq],
  },
  {
    id: "quiz-mitsubishi-2",
    cardId: "trader-mitsubishi",
    category: "trader",
    question:
      "三菱商事がCermaqを通じて2025年にGrieg Seafood傘下のサーモン養殖事業を買収した後、目指す世界順位は？",
    options: [
      { text: "世界1位", isCorrect: false },
      { text: "世界2位", isCorrect: true },
      { text: "世界3位", isCorrect: false },
      { text: "世界5位", isCorrect: false },
    ],
    explanation:
      "三菱商事は2025年にGrieg Seafood傘下の3事業を約1,474億円で買収し、サーモン養殖で世界4位から2位への浮上を目指しています。",
    sources: [SOURCES.mitsubishiGriegSeafood],
  },
  {
    id: "quiz-mitsubishi-3",
    cardId: "trader-mitsubishi",
    category: "trader",
    question: "三菱商事の穀物事業の特徴として正しいものはどれでしょうか？",
    options: [
      { text: "国内流通のみを専門とする", isCorrect: false },
      { text: "米専業の国営企業である", isCorrect: false },
      { text: "非上場の同族企業である", isCorrect: false },
      { text: "調達から販売までのサプライチェーン構築に強み", isCorrect: true },
    ],
    explanation:
      "三菱商事は穀物・飼料原料の調達から販売まで、広いサプライチェーンを構築することで安定供給を支えています。",
    sources: [SOURCES.mitsubishiGrain],
  },
  {
    id: "quiz-sumitomo-1",
    cardId: "trader-sumitomo",
    category: "trader",
    question:
      "住友商事が2017年に約910億円で完全子会社化した、バナナ販売シェア欧州1位のアイルランド企業は？",
    options: [
      { text: "Fyffes（ファイフス）", isCorrect: true },
      { text: "Chiquita", isCorrect: false },
      { text: "Dole", isCorrect: false },
      { text: "Del Monte", isCorrect: false },
    ],
    explanation:
      "住友商事は2017年にアイルランドの青果卸大手Fyffes（ファイフス）を約910億円で完全子会社化しました。Fyffesは1888年創業の世界最古のフルーツブランドで、バナナ販売欧州1位を誇ります。",
    sources: [SOURCES.sumitomoFyffes],
  },
  {
    id: "quiz-sumitomo-2",
    cardId: "trader-sumitomo",
    category: "trader",
    question:
      "住友商事傘下のFyffes社が欧州で1位のシェアを持つ果物は？",
    options: [
      { text: "リンゴ", isCorrect: false },
      { text: "オレンジ", isCorrect: false },
      { text: "バナナ", isCorrect: true },
      { text: "パイナップル", isCorrect: false },
    ],
    explanation:
      "Fyffes社はバナナ販売で欧州1位（約15%のシェア）、メロンで米国1位の取扱量を誇る世界有数の青果物企業です。",
    sources: [SOURCES.sumitomoFyffes],
  },
  {
    id: "quiz-sumitomo-3",
    cardId: "trader-sumitomo",
    category: "trader",
    question: "住友商事の食料・穀物分野の役割として正しいものはどれでしょうか？",
    options: [
      { text: "国内の米専用サイロのみを運営", isCorrect: false },
      { text: "輸出専業で国内流通は担わない", isCorrect: false },
      { text: "飼料の製造だけを専門に行う", isCorrect: false },
      { text: "調達ネットワークを活かした安定供給", isCorrect: true },
    ],
    explanation:
      "住友商事はグローバルな調達ネットワークを活かし、食料・穀物の安定供給に取り組んでいます。",
    sources: [SOURCES.sumitomoFoodAgriculture],
  },
  {
    id: "quiz-toyota-tsusho-1",
    cardId: "trader-toyota-tsusho",
    category: "trader",
    question:
      "豊田通商が2016年に完全子会社化した、アフリカ事業の中核を担うフランスの商社は？",
    options: [
      { text: "CFAO", isCorrect: true },
      { text: "Bolloré", isCorrect: false },
      { text: "Carrefour", isCorrect: false },
      { text: "Danone", isCorrect: false },
    ],
    explanation:
      "豊田通商は2012年にフランス最大の商社CFAO社に資本参画（投資額2,345億円）し、2016年に完全子会社化しました。これにより「アフリカでのプレゼンスNo.1」を目指しています。",
    sources: [SOURCES.toyotaTshoCfao],
  },
  {
    id: "quiz-toyota-tsusho-2",
    cardId: "trader-toyota-tsusho",
    category: "trader",
    question: "豊田通商がCFAOを通じてアフリカで展開している国の数は？",
    options: [
      { text: "25カ国", isCorrect: false },
      { text: "38カ国", isCorrect: false },
      { text: "54カ国", isCorrect: true },
      { text: "72カ国", isCorrect: false },
    ],
    explanation:
      "豊田通商はCFAOの完全子会社化により、アフリカ全54カ国へのネットワークを有し、総勢2万人以上の従業員で事業展開しています。",
    sources: [SOURCES.toyotaTshoCfao],
  },
  {
    id: "quiz-toyota-tsusho-3",
    cardId: "trader-toyota-tsusho",
    category: "trader",
    question: "豊田通商の穀物事業の特徴として正しいものはどれでしょうか？",
    options: [
      { text: "欧州の製粉専業メーカーである", isCorrect: false },
      { text: "穀物・飼料原料の輸出入と国内販売を行う", isCorrect: true },
      { text: "小麦専用の国営倉庫を運営する", isCorrect: false },
      { text: "港湾サイロを持たず現物は扱わない", isCorrect: false },
    ],
    explanation:
      "豊田通商は穀物・飼料原料の輸出入および国内販売を手掛け、国内の供給を支えています。",
    sources: [SOURCES.toyotaTsushoGrainFeed],
  },
  {
    id: "quiz-sojitz-1",
    cardId: "trader-sojitz",
    category: "trader",
    question: "双日が2004年の合併で誕生した際、統合した2社の組み合わせは？",
    options: [
      { text: "三菱商事と住友商事", isCorrect: false },
      { text: "ニチメンと日商岩井", isCorrect: true },
      { text: "伊藤忠と丸紅", isCorrect: false },
      { text: "兼松と豊田通商", isCorrect: false },
    ],
    explanation:
      "双日は2003年にニチメンと日商岩井が持株会社を設立し、2004年に合併して誕生しました。両社は鈴木商店を源流とする歴史ある商社です。",
    sources: [SOURCES.sojitzHistory],
  },
  {
    id: "quiz-sojitz-2",
    cardId: "trader-sojitz",
    category: "trader",
    question: "双日の源流企業の一つで、大正時代に日本一の総合商社となった企業は？",
    options: [
      { text: "鈴木商店", isCorrect: true },
      { text: "三井物産", isCorrect: false },
      { text: "伊藤忠商事", isCorrect: false },
      { text: "岩井商店", isCorrect: false },
    ],
    explanation:
      "双日の源流の一つ・鈴木商店は1917年に日本一の総合商社にまで登りつめました。1928年の破綻後、再起組が日商を設立し、これが日商岩井を経て双日につながっています。",
    sources: [SOURCES.sojitzNisshoHistory, SOURCES.sojitzHistory],
  },
  {
    id: "quiz-sojitz-3",
    cardId: "trader-sojitz",
    category: "trader",
    question: "双日の穀物・食品原料事業の特徴として正しいものはどれでしょうか？",
    options: [
      { text: "米専用の内陸サイロのみを運営", isCorrect: false },
      { text: "国内の小売りだけに特化している", isCorrect: false },
      { text: "食品原料の調達と国内サプライチェーン構築", isCorrect: true },
      { text: "穀物の取り扱いは行わない", isCorrect: false },
    ],
    explanation:
      "双日は食品原料の調達から国内供給までを担い、サプライチェーンを支えています。",
    sources: [SOURCES.sojitzFoods],
  },
  {
    id: "quiz-kanematsu-1",
    cardId: "trader-kanematsu",
    category: "trader",
    question:
      "兼松が2024年に「サステナブルな豚肉製品」の日本での普及を目指してパートナーシップを締結したデンマークの企業は？",
    options: [
      { text: "Danish Crown", isCorrect: true },
      { text: "Arla Foods", isCorrect: false },
      { text: "Carlsberg", isCorrect: false },
      { text: "Maersk", isCorrect: false },
    ],
    explanation:
      "兼松は2024年4月にデンマークのDanish Crown社と「サステナブルな豚肉製品」の日本での普及に向けたパートナーシップ合意書を締結しました。両社は約40年にわたる取引実績があります。",
    sources: [SOURCES.kanematsuDanishCrown],
  },
  {
    id: "quiz-kanematsu-2",
    cardId: "trader-kanematsu",
    category: "trader",
    question:
      "兼松の創業者・兼松房治郎が1889年に神戸で創業した際、オーストラリアから主に輸入を目指した商品は？",
    options: [
      { text: "綿花", isCorrect: false },
      { text: "羊毛", isCorrect: true },
      { text: "小麦", isCorrect: false },
      { text: "石炭", isCorrect: false },
    ],
    explanation:
      "兼松は1889年に兼松房治郎が「豪州貿易兼松房治郎商店」を神戸で創業し、オーストラリアからの羊毛輸入を開始しました。創業から十余年で日本の羊毛輸入の4〜5割を担うまでに成長しました。",
    sources: [SOURCES.kanematsuHistory],
  },
  {
    id: "quiz-kanematsu-3",
    cardId: "trader-kanematsu",
    category: "trader",
    question:
      "兼松が1890年に対オーストラリア貿易の拠点として開設した海外支店がある都市は？",
    options: [
      { text: "メルボルン", isCorrect: false },
      { text: "ブリスベン", isCorrect: false },
      { text: "パース", isCorrect: false },
      { text: "シドニー", isCorrect: true },
    ],
    explanation:
      "兼松は創業翌年の1890年にシドニーに支店を開設し、豪州羊毛輸入を本格的に開始しました。日本企業による対オーストラリア貿易の先駆けとなりました。",
    sources: [SOURCES.kanematsuHistory],
  },
  {
    id: "quiz-nittetsu-1",
    cardId: "trader-nittetsu",
    category: "trader",
    question: "日鉄物産の親会社として正しい企業は？",
    options: [
      { text: "トヨタ自動車", isCorrect: false },
      { text: "日本製鉄", isCorrect: true },
      { text: "三菱重工業", isCorrect: false },
      { text: "住友金属", isCorrect: false },
    ],
    explanation:
      "日鉄物産は日本製鉄グループの中核商社として、鉄鋼、産機・インフラ、食糧、繊維の4事業を展開しています。",
    sources: [SOURCES.nittetsuBussanAbout],
  },
  {
    id: "quiz-nittetsu-2",
    cardId: "trader-nittetsu",
    category: "trader",
    question: "日鉄物産が展開する4つの事業分野に含まれないものは？",
    options: [
      { text: "鉄鋼", isCorrect: false },
      { text: "食糧", isCorrect: false },
      { text: "繊維", isCorrect: false },
      { text: "不動産", isCorrect: true },
    ],
    explanation:
      "日鉄物産は「鉄鋼」「産機・インフラ」「食糧」「繊維」の4つのコア事業を複合的に展開する複合専業商社です。",
    sources: [SOURCES.nittetsuBussanAbout, SOURCES.nittetsuBussanHistory],
  },
  {
    id: "quiz-nittetsu-3",
    cardId: "trader-nittetsu",
    category: "trader",
    question: "日鉄物産の穀物・食品分野の特徴として正しいものはどれでしょうか？",
    options: [
      { text: "国内の米専用サイロだけを運営", isCorrect: false },
      { text: "穀物の取引は一切行わない", isCorrect: false },
      { text: "食品・飼料原料の調達と安定供給を支える", isCorrect: true },
      { text: "港湾業務のみを専門に行う", isCorrect: false },
    ],
    explanation:
      "日鉄物産は素材分野に加え、食品・飼料原料の調達と安定供給にも関わっています。",
    sources: [SOURCES.nittetsuBussanFood],
  },
];
