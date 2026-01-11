import { Quiz, QuizSource } from "@/types";

// Sources verified on 2026-01-11.
const SOURCES = {
  // 穀物
  maffWheatImportQa: {
    title: "農林水産省「小麦の輸入先はどこ？」",
    url: "https://www.maff.go.jp/j/keikaku/soukatu/qa/attach/pdf/qa15-4.pdf",
  },
  maffSoybeanSituation: {
    title: "農林水産省「大豆をめぐる事情（令和8年1月版）」",
    url: "https://www.maff.go.jp/j/seisan/ryutu/daizu/d_data/attach/pdf/index-4.pdf",
  },
  maffFeedMainIngredients: {
    title: "農林水産省「配合飼料の主原料」",
    url: "https://www.maff.go.jp/j/chikusan/sinko/lin/attach/pdf/index-45.pdf",
  },
  alicStarchUsage: {
    title: "農畜産業振興機構（alic）「食品メーカーにおけるでん粉の利用形態」",
    url: "https://www.alic.go.jp/koho/kikaku03_001227.html",
  },
  maffRiceFlour: {
    title: "農林水産省「米粉」",
    url: "https://www.maff.go.jp/j/seisan/komeko/",
  },
  japansakeWhatIsSake: {
    title:
      "日本酒造組合中央会（Japan Sake and Shochu Makers Association）「What is Sake?」",
    url: "https://www.japansake.or.jp/sake/",
  },
  wikipediaMochi: {
    title: "Wikipedia「餅」",
    url: "https://ja.wikipedia.org/wiki/%E9%A4%85",
  },
  wikipediaWheatFlour: {
    title: "Wikipedia「小麦粉」",
    url: "https://ja.wikipedia.org/wiki/%E5%B0%8F%E9%BA%A6%E7%B2%89",
  },
  kirinBeerIngredients: {
    title: "キリン「ビールの原料（麦芽・大麦）」",
    url: "https://www.kirin.co.jp/alcohol/beer/column/08.html",
  },

  // 商社
  marubeniGavilonAcquisition: {
    title: "Marubeni「Acquisition of US grain marketing company Gavilon Group」",
    url: "https://www.marubeni.com/en/news/2012/release/00017.html",
  },
  marubeniGavilonCompletion: {
    title: "Marubeni「Completion of Acquisition of Gavilon」",
    url: "https://www.marubeni.com/en/news/2013/release/00013.html",
  },
  mitsuiAgricultureAustralia: {
    title: "Mitsui & Co. Asia Pacific「Agriculture Business」",
    url: "https://www.mitsui.com/ap/ja/business/agriculture/",
  },
  mitsuiBrazilAgribusiness: {
    title: "Mitsui Brasil「Agribusiness」",
    url: "https://www.mitsuibrasil.com.br/en/business/agribusiness/",
  },
  familymartItochuWhollyOwned: {
    title: "ファミリーマート「伊藤忠商事の完全子会社化（2020年7月9日）」",
    url: "https://www.family.co.jp/company/news_releases/2020/20200709_01.html",
  },
  cargillAbout: {
    title: "Cargill「About Cargill」",
    url: "https://www.cargill.com/about",
  },
  admBioenergy: {
    title: "ADM「Bioenergy」",
    url: "https://www.adm.com/en-us/products-services/bioenergy/",
  },
  secTopEthanolProducers: {
    title: "SEC（EDGAR）「Top Ethanol Producers」",
    url: "https://www.sec.gov/Archives/edgar/data/1908184/000143774924028696/ex_713127.htm",
  },
  mitsubishiGrain: {
    title: "三菱商事「穀物事業（Grain）」",
    url: "https://www.mc.co.jp/en/solution/foods/agriculture/grain/",
  },
  sumitomoFoodAgriculture: {
    title: "住友商事「Food & Agriculture」",
    url: "https://www.sumitomo-corp.com/en/jp/business/food-agriculture",
  },
  toyotaTsushoGrainFeed: {
    title: "豊田通商「穀物・飼料原料」",
    url: "https://www.toyota-tsusho.com/food/foodstuff/grain_feed/",
  },
  sojitzFoods: {
    title: "Sojitz Foods「Food Solution」",
    url: "https://sojitz-foods.com/en/food-solution/",
  },
  kanematsuFoodsMeatGrain: {
    title: "Kanematsu「Foods, Meat & Grain」",
    url: "https://www.kanematsu.co.jp/en/business/foods/meat-grain.html",
  },
  kanematsuHistory: {
    title: "兼松の歩み | 兼松株式会社",
    url: "https://www.kanematsu.co.jp/brand/history/",
  },
  kanematsuDanishCrown: {
    title: "兼松「DANISH CROWN社とパートナーシップ合意書を締結」",
    url: "https://www.kanematsu.co.jp/press/release/20240415_2_release",
  },
  mitsubishiCermaq: {
    title: "三菱商事「Cermaq」",
    url: "https://www.mitsubishicorp.com/jp/ja/about/project/cermaq/",
  },
  mitsubishiGriegSeafood: {
    title: "三菱商事「Grieg Seafood社傘下事業の取得に関するお知らせ」",
    url: "https://www.mitsubishicorp.com/jp/ja/news/release/2025/20250717001.html",
  },
  sumitomoFyffes: {
    title: "住友商事「欧米州市場への進出による青果事業のグローバル展開 ―ファイフス―」",
    url: "https://www.sumitomocorp.com/ja/jp/business/case/group/fyffes",
  },
  sojitzHistory: {
    title: "双日の歴史 | 双日株式会社",
    url: "https://www.sojitz.com/jp/corporate/history/",
  },
  sojitzNisshoHistory: {
    title: "鈴木商店の再起組が日商を設立 | 双日歴史館",
    url: "https://www.sojitz.com/history/jp/company/company_post_59.html",
  },
  toyotaTshoCfao: {
    title: "豊田通商「アフリカでのプレゼンスNo.1へ」",
    url: "https://www.toyota-tsusho.com/about/project/11.html",
  },
  nittetsuBussanAbout: {
    title: "日鉄物産株式会社",
    url: "https://www.nst.nipponsteel.com/",
  },
  nittetsuBussanHistory: {
    title: "日鉄物産「四事業の歴史」",
    url: "https://www.nst.nipponsteel.com/about/history/",
  },
  nittetsuBussanFood: {
    title: "NIPPON STEEL TRADING「Food」",
    url: "https://www.nst.nipponsteel.com/en/business/food/",
  },

  // サイロ
  kantoGrainCompany: {
    title: "関東グレーンターミナル「会社情報」",
    url: "https://www.kanto-grain.co.jp/company/",
  },
  tohokuGrainCompany: {
    title: "東北グレーンターミナル「会社案内」",
    url: "https://tohokugaint.com/company/",
  },
  tohokuGrainBusiness: {
    title: "東北グレーンターミナル「事業内容」",
    url: "https://tohokugaint.com/business/",
  },
  nihonSiloChiba: {
    title: "日本サイロ「千葉事業所」",
    url: "https://www.nihonsilo.co.jp/operation_chiba/",
  },
  toyoGrainFacilities: {
    title: "東洋グレーンターミナル「設備紹介」",
    url: "https://toyo-grain.co.jp/facilities/",
  },
  toyoGrainBusiness: {
    title: "東洋グレーンターミナル「事業内容」",
    url: "https://toyo-grain.co.jp/business/",
  },
  hakataSiloCompany: {
    title: "博多港サイロ「会社概要」",
    url: "https://hakatasilo.jp/company/",
  },
  zennoSiloKashimaBase: {
    title: "全農サイロ「鹿島支店」",
    url: "https://www.zsilo.co.jp/company/access/",
  },
  zennoSiloKashimaPdf: {
    title: "全農サイロ「鹿島支店」",
    url: "https://www.zsilo.co.jp/company/branch/",
  },
  zennoSiloTokaiBase: {
    title: "全農サイロ「東海支店」",
    url: "https://www.zsilo.co.jp/company/access/",
  },
  zennoSiloKurashikiBase: {
    title: "全農サイロ「倉敷支店」",
    url: "https://www.zsilo.co.jp/company/access/",
  },
  zennoSiloKurashikiPdf: {
    title: "全農サイロ「倉敷支店」",
    url: "https://www.zsilo.co.jp/company/branch/",
  },
  zennoSiloShibushiBase: {
    title: "全農サイロ「志布志支店」",
    url: "https://www.zsilo.co.jp/company/access/",
  },
  zennoSiloKushiroBase: {
    title: "全農サイロ「釧路支店」",
    url: "https://www.zsilo.co.jp/company/access/",
  },
  zennoSiloNiigataBase: {
    title: "全農サイロ「新潟支店」",
    url: "https://www.zsilo.co.jp/company/access/",
  },
  pgcWestJapan: {
    title: "パシフィックグレーンセンター「西日本支店」",
    url: "https://www.pgc.co.jp/base/westjapan.html",
  },
  pgcYatsushiro: {
    title: "パシフィックグレーンセンター「八代支店」",
    url: "https://www.pgc.co.jp/base/yatsushiro.html",
  },
  pgcSouthJapan: {
    title: "パシフィックグレーンセンター「南日本支店」",
    url: "https://www.pgc.co.jp/base/southjapan.html",
  },
  iwateKamaishiPdf: {
    title: "岩手県「釜石港（釜石グレーンセンター）資料（PDF）」",
    url: "https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/020/994/45kamaishi.pdf",
  },
  tokachiGrainCompany: {
    title: "十勝グレーンセンター「会社概要」",
    url: "https://tokachi-grain.jp/company/",
  },
  tomakomaiPortPdf: {
    title: "苫小牧港「苫小牧埠頭（飼料サイロ）資料（PDF）」",
    url: "https://www.portof.tomakomai.jp/wp-content/uploads/2024/11/06_kiban.pdf",
  },
  tomakomaiFutoSilo: {
    title: "苫小牧埠頭「飼料サイロ」",
    url: "https://www.tomakomaifuto.co.jp/overview/silo/",
  },
  hanshinSiloFacilities: {
    title: "阪神サイロ「施設紹介」",
    url: "https://hanshin-silo.co.jp/shisetsu/",
  },
  setoFutoTop: {
    title: "瀬戸埠頭（公式サイト）",
    url: "https://www.setofuto.co.jp/",
  },
  setoFutoCompany: {
    title: "瀬戸埠頭「会社案内」",
    url: "https://www.setofuto.co.jp/company/",
  },
  tomsenSiloOutline: {
    title: "東灘トーメンサイロ「施設概要」",
    url: "https://tomsensilo.co.jp/outline/",
  },
  nakanihonGrainCompany: {
    title: "中日本グレーンセンター「会社案内」",
    url: "https://njgc.co.jp/company/",
  },
} satisfies Record<string, QuizSource>;

export const quizzes: Quiz[] = [
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

  // サイロクイズ
  {
    id: "quiz-tohoku-1",
    cardId: "silo-tohoku",
    category: "silo",
    question: "東北グレーンターミナルが位置する港はどこでしょうか？",
    options: [
      { text: "仙台港", isCorrect: false },
      { text: "八戸港", isCorrect: true },
      { text: "秋田港", isCorrect: false },
      { text: "酒田港", isCorrect: false },
    ],
    explanation:
      "東北グレーンターミナルは青森県八戸港にあり、東北最大級の飼料穀物サイロとして世界の穀倉地帯と東北の畜産を結んでいます。",
    sources: [SOURCES.tohokuGrainCompany],
  },
  {
    id: "quiz-tohoku-2",
    cardId: "silo-tohoku",
    category: "silo",
    question: "東北グレーンターミナルで取り扱う穀物として正しいものは？",
    options: [
      { text: "トウモロコシ・大豆・マイロ", isCorrect: true },
      { text: "米・砂糖・麦芽", isCorrect: false },
      { text: "綿花・カカオ・茶葉", isCorrect: false },
      { text: "原油・石炭・木材", isCorrect: false },
    ],
    explanation:
      "東北グレーンターミナルはトウモロコシ・大豆・マイロなどを取り扱い、東北の畜産向け飼料供給を支えています。",
    sources: [SOURCES.tohokuGrainBusiness],
  },
  {
    id: "quiz-nihon-1",
    cardId: "silo-nihon",
    category: "silo",
    question: "日本サイロ千葉事業所で取り扱っていない穀物はどれでしょうか？",
    options: [
      { text: "トウモロコシ", isCorrect: false },
      { text: "大豆", isCorrect: false },
      { text: "小麦", isCorrect: false },
      { text: "米", isCorrect: true },
    ],
    explanation:
      "日本サイロ千葉事業所はトウモロコシ・大豆・小麦を取り扱う東日本の主要グレーンターミナルです。122本のサイロと計13.5万トンの収容力を持ちます。",
    sources: [SOURCES.nihonSiloChiba],
  },
  {
    id: "quiz-nihon-2",
    cardId: "silo-nihon",
    category: "silo",
    question: "日本サイロ千葉事業所が位置する地域はどこでしょうか？",
    options: [
      { text: "千葉県千葉市", isCorrect: true },
      { text: "愛知県知多市", isCorrect: false },
      { text: "岡山県倉敷市", isCorrect: false },
      { text: "兵庫県神戸市", isCorrect: false },
    ],
    explanation:
      "日本サイロ千葉事業所は千葉県千葉市に位置し、東日本の主要グレーンターミナルとして機能しています。",
    sources: [SOURCES.nihonSiloChiba],
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
    sources: [SOURCES.toyoGrainFacilities],
  },
  {
    id: "quiz-toyo-2",
    cardId: "silo-toyo",
    category: "silo",
    question: "東洋グレーンターミナルで取り扱っているものはどれでしょうか？",
    options: [
      { text: "大豆粕", isCorrect: true },
      { text: "米", isCorrect: false },
      { text: "砂糖", isCorrect: false },
      { text: "カカオ", isCorrect: false },
    ],
    explanation:
      "東洋グレーンターミナルは小麦・大豆・大豆粕などを取り扱い、中京地区の飼料・食品産業を支えています。",
    sources: [SOURCES.toyoGrainBusiness],
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
    sources: [SOURCES.kantoGrainCompany],
  },
  {
    id: "quiz-hakata-1",
    cardId: "silo-hakata",
    category: "silo",
    question: "博多港サイロの設立年として正しいものはどれでしょうか？",
    options: [
      { text: "1964年", isCorrect: true },
      { text: "1970年", isCorrect: false },
      { text: "1988年", isCorrect: false },
      { text: "2017年", isCorrect: false },
    ],
    explanation:
      "博多港サイロは1964年（昭和39年）に設立されました。",
    sources: [SOURCES.hakataSiloCompany],
  },
  {
    id: "quiz-hakata-2",
    cardId: "silo-hakata",
    category: "silo",
    question: "博多港サイロが位置する地域はどこでしょうか？",
    options: [
      { text: "福岡県福岡市", isCorrect: true },
      { text: "熊本県八代市", isCorrect: false },
      { text: "岡山県倉敷市", isCorrect: false },
      { text: "北海道苫小牧市", isCorrect: false },
    ],
    explanation:
      "博多港サイロは福岡県福岡市に位置し、九州の穀物供給を支える拠点です。",
    sources: [SOURCES.hakataSiloCompany],
  },

  // === 追加サイロクイズ（全農サイログループ） ===
  {
    id: "quiz-zenno-kashima-1",
    cardId: "silo-zenno-kashima",
    category: "silo",
    question: "全農サイロ鹿島支店の特徴として正しいものは？",
    options: [
      { text: "単一事業者として日本最大のサイロ", isCorrect: true },
      { text: "日本で最も古いサイロ", isCorrect: false },
      { text: "小麦専用のサイロ", isCorrect: false },
      { text: "北海道最大のサイロ", isCorrect: false },
    ],
    explanation:
      "全農サイロ鹿島支店は326本のサイロを有し、約24.5万トンの収容能力を持つ単一事業者として日本最大のサイロです。トウモロコシ・大豆・小麦・マイロを扱います。",
    sources: [SOURCES.zennoSiloKashimaPdf, SOURCES.zennoSiloKashimaBase],
  },
  {
    id: "quiz-zenno-tokai-1",
    cardId: "silo-zenno-tokai",
    category: "silo",
    question: "全農サイロ東海支店の開設年として正しいものはどれでしょうか？",
    options: [
      { text: "1969年", isCorrect: true },
      { text: "1975年", isCorrect: false },
      { text: "1988年", isCorrect: false },
      { text: "2017年", isCorrect: false },
    ],
    explanation:
      "全農サイロ東海支店は1969年に開設されました。",
    sources: [SOURCES.zennoSiloTokaiBase],
  },
  {
    id: "quiz-zenno-tokai-2",
    cardId: "silo-zenno-tokai",
    category: "silo",
    question: "全農サイロ東海支店が位置する地域はどこでしょうか？",
    options: [
      { text: "愛知県知多市", isCorrect: true },
      { text: "新潟県聖籠町", isCorrect: false },
      { text: "鹿児島県志布志市", isCorrect: false },
      { text: "岩手県釜石市", isCorrect: false },
    ],
    explanation:
      "全農サイロ東海支店は愛知県知多市に位置し、中部地区の重要な穀物拠点です。",
    sources: [SOURCES.zennoSiloTokaiBase],
  },
  {
    id: "quiz-zenno-kurashiki-1",
    cardId: "silo-zenno-kurashiki",
    category: "silo",
    question: "全農サイロ倉敷支店が位置する場所はどこでしょうか？",
    options: [
      { text: "水島港", isCorrect: false },
      { text: "玉島ハーバーアイランド", isCorrect: true },
      { text: "宇野港", isCorrect: false },
      { text: "福山港", isCorrect: false },
    ],
    explanation:
      "全農サイロ倉敷支店は2017年に玉島ハーバーアイランドに開設された比較的新しいサイロで、中四国地区への穀物供給を担っています。",
    sources: [SOURCES.zennoSiloKurashikiPdf, SOURCES.zennoSiloKurashikiBase],
  },
  {
    id: "quiz-zenno-kurashiki-2",
    cardId: "silo-zenno-kurashiki",
    category: "silo",
    question: "全農サイロ倉敷支店が担う供給エリアとして正しいものは？",
    options: [
      { text: "中四国地区", isCorrect: true },
      { text: "北海道", isCorrect: false },
      { text: "北関東", isCorrect: false },
      { text: "南九州全域", isCorrect: false },
    ],
    explanation:
      "全農サイロ倉敷支店は中四国地区への穀物供給を担う拠点です。",
    sources: [SOURCES.zennoSiloKurashikiBase],
  },
  {
    id: "quiz-zenno-shibushi-1",
    cardId: "silo-zenno-shibushi",
    category: "silo",
    question: "全農サイロ志布志支店が主に取り扱うものの組み合わせは？",
    options: [
      { text: "飼料と牧草", isCorrect: true },
      { text: "米と砂糖", isCorrect: false },
      { text: "小麦粉と製粉", isCorrect: false },
      { text: "原油と石炭", isCorrect: false },
    ],
    explanation:
      "全農サイロ志布志支店は輸入飼料原料と輸入粗飼料（乾牧草）を主に扱い、九州・沖縄・四国向けの供給や南九州向けの配送を担う拠点です。",
    sources: [SOURCES.zennoSiloShibushiBase],
  },
  {
    id: "quiz-zenno-shibushi-2",
    cardId: "silo-zenno-shibushi",
    category: "silo",
    question: "全農サイロ志布志支店が位置する地域はどこでしょうか？",
    options: [
      { text: "鹿児島県志布志市", isCorrect: true },
      { text: "福岡県福岡市", isCorrect: false },
      { text: "愛知県知多市", isCorrect: false },
      { text: "岡山県倉敷市", isCorrect: false },
    ],
    explanation:
      "全農サイロ志布志支店は鹿児島県志布志市に位置し、南九州の重要拠点です。",
    sources: [SOURCES.zennoSiloShibushiBase],
  },
  {
    id: "quiz-zenno-kushiro-1",
    cardId: "silo-zenno-kushiro",
    category: "silo",
    question: "全農サイロ釧路支店が主に支える分野として正しいものは？",
    options: [
      { text: "北海道の酪農用飼料の安定供給", isCorrect: true },
      { text: "南九州の飼料・牧草の中継", isCorrect: false },
      { text: "本州日本海側唯一の穀物専用岸壁", isCorrect: false },
      { text: "小麦専用サイロとして西日本最大級", isCorrect: false },
    ],
    explanation:
      "全農サイロ釧路支店は北海道の酪農用飼料原料を主に取り扱い、地域の安定供給を支えています。",
    sources: [SOURCES.zennoSiloKushiroBase],
  },
  {
    id: "quiz-zenno-kushiro-2",
    cardId: "silo-zenno-kushiro",
    category: "silo",
    question: "全農サイロ釧路支店が位置する地域はどこでしょうか？",
    options: [
      { text: "北海道釧路市", isCorrect: true },
      { text: "岩手県釜石市", isCorrect: false },
      { text: "岡山県倉敷市", isCorrect: false },
      { text: "愛知県碧南市", isCorrect: false },
    ],
    explanation:
      "全農サイロ釧路支店は北海道釧路市に位置し、道東エリアの飼料供給を支えています。",
    sources: [SOURCES.zennoSiloKushiroBase],
  },
  {
    id: "quiz-zenno-niigata-1",
    cardId: "silo-zenno-niigata",
    category: "silo",
    question: "全農サイロ新潟支店の特徴として正しいものは？",
    options: [
      { text: "本州日本海側唯一の穀物専用岸壁", isCorrect: true },
      { text: "日本最大のサイロ", isCorrect: false },
      { text: "小麦専用サイロ", isCorrect: false },
      { text: "1950年代に設立", isCorrect: false },
    ],
    explanation:
      "全農サイロ新潟支店は1988年に開設され、新潟東港にある穀物専用岸壁としては本州日本海側唯一のサイロです。",
    sources: [SOURCES.zennoSiloNiigataBase],
  },

  // === 追加サイロクイズ（パシフィックグレーンセンター・丸紅グループ） ===
  {
    id: "quiz-pgc-west-1",
    cardId: "silo-pgc-west",
    category: "silo",
    question: "パシフィックグレーンセンター西日本支店がある港はどこでしょうか？",
    options: [
      { text: "神戸港", isCorrect: false },
      { text: "水島港", isCorrect: true },
      { text: "博多港", isCorrect: false },
      { text: "八代港", isCorrect: false },
    ],
    explanation:
      "パシフィックグレーンセンター西日本支店は岡山県倉敷市の水島港に位置し、109基のサイロで中四国地区への穀物供給を担っています。",
    sources: [SOURCES.pgcWestJapan],
  },
  {
    id: "quiz-pgc-west-2",
    cardId: "silo-pgc-west",
    category: "silo",
    question: "パシフィックグレーンセンター西日本支店で取り扱う穀物として正しいものは？",
    options: [
      { text: "トウモロコシ・大豆・菜種・小麦", isCorrect: true },
      { text: "米・砂糖・麦芽", isCorrect: false },
      { text: "綿花・カカオ・茶葉", isCorrect: false },
      { text: "原油・石炭・木材", isCorrect: false },
    ],
    explanation:
      "パシフィックグレーンセンター西日本支店はトウモロコシ・大豆・菜種・小麦などを取り扱います。",
    sources: [SOURCES.pgcWestJapan],
  },
  {
    id: "quiz-pgc-yatsushiro-1",
    cardId: "silo-pgc-yatsushiro",
    category: "silo",
    question: "パシフィックグレーンセンター八代支店の貯蔵能力として正しいものは？",
    options: [
      { text: "約5万トン", isCorrect: true },
      { text: "約10万トン", isCorrect: false },
      { text: "約23.8万トン", isCorrect: false },
      { text: "約24.5万トン", isCorrect: false },
    ],
    explanation:
      "パシフィックグレーンセンター八代支店の貯蔵能力は50,000トンです。",
    sources: [SOURCES.pgcYatsushiro],
  },
  {
    id: "quiz-pgc-yatsushiro-2",
    cardId: "silo-pgc-yatsushiro",
    category: "silo",
    question: "パシフィックグレーンセンター八代支店が位置する地域はどこでしょうか？",
    options: [
      { text: "熊本県八代市", isCorrect: true },
      { text: "福岡県福岡市", isCorrect: false },
      { text: "岡山県倉敷市", isCorrect: false },
      { text: "北海道苫小牧市", isCorrect: false },
    ],
    explanation:
      "パシフィックグレーンセンター八代支店は熊本県八代市に位置する拠点です。",
    sources: [SOURCES.pgcYatsushiro],
  },
  {
    id: "quiz-pgc-south-1",
    cardId: "silo-pgc-south",
    category: "silo",
    question: "パシフィックグレーンセンター南日本支店で取り扱っていないものは？",
    options: [
      { text: "トウモロコシ", isCorrect: false },
      { text: "大豆", isCorrect: false },
      { text: "小麦", isCorrect: false },
      { text: "米", isCorrect: true },
    ],
    explanation:
      "パシフィックグレーンセンター南日本支店はトウモロコシ・大豆・小麦・糖蜜などを扱う、日本最大級の穀物サイロです。",
    sources: [SOURCES.pgcSouthJapan],
  },
  {
    id: "quiz-pgc-south-2",
    cardId: "silo-pgc-south",
    category: "silo",
    question: "パシフィックグレーンセンター南日本支店が主に支える地域は？",
    options: [
      { text: "南九州", isCorrect: true },
      { text: "東北", isCorrect: false },
      { text: "北関東", isCorrect: false },
      { text: "北陸", isCorrect: false },
    ],
    explanation:
      "パシフィックグレーンセンター南日本支店は南九州全体の重要な穀物供給基地です。",
    sources: [SOURCES.pgcSouthJapan],
  },
  {
    id: "quiz-kamaishi-1",
    cardId: "silo-kamaishi",
    category: "silo",
    question: "釜石グレーンセンターの立地の強みとして正しいものは？",
    options: [
      { text: "港の水深を活かし大型外航船を受け入れられる", isCorrect: true },
      { text: "米専用の内陸サイロである", isCorrect: false },
      { text: "本州日本海側唯一の穀物専用岸壁である", isCorrect: false },
      { text: "南九州向け飼料の中継基地である", isCorrect: false },
    ],
    explanation:
      "釜石グレーンセンターは釜石港の水深を活かし大型外航船を受け入れることができる飼料穀物サイロです。",
    sources: [SOURCES.iwateKamaishiPdf],
  },
  {
    id: "quiz-kamaishi-2",
    cardId: "silo-kamaishi",
    category: "silo",
    question: "釜石グレーンセンターが位置する地域はどこでしょうか？",
    options: [
      { text: "岩手県釜石市", isCorrect: true },
      { text: "北海道釧路市", isCorrect: false },
      { text: "愛知県碧南市", isCorrect: false },
      { text: "岡山県倉敷市", isCorrect: false },
    ],
    explanation:
      "釜石グレーンセンターは岩手県釜石市に位置し、港湾立地を活かしています。",
    sources: [SOURCES.iwateKamaishiPdf],
  },
  {
    id: "quiz-tokachi-1",
    cardId: "silo-tokachi",
    category: "silo",
    question: "十勝グレーンセンターがある港はどこでしょうか？",
    options: [
      { text: "苫小牧港", isCorrect: false },
      { text: "釧路港", isCorrect: false },
      { text: "広尾港", isCorrect: true },
      { text: "室蘭港", isCorrect: false },
    ],
    explanation:
      "十勝グレーンセンターは北海道広尾港に位置し、2008年の設立以来、十勝の酪農・畜産を支える飼料用穀物の搬出入・保管を行っています。",
    sources: [SOURCES.tokachiGrainCompany],
  },

  // === 追加サイロクイズ（その他主要サイロ） ===
  {
    id: "quiz-tomakomai-1",
    cardId: "silo-tomakomai",
    category: "silo",
    question: "苫小牧埠頭飼料サイロの役割として正しいものは？",
    options: [
      { text: "北海道で生産される配合飼料の重要な中継拠点", isCorrect: true },
      { text: "小麦専用サイロとして西日本最大級", isCorrect: false },
      { text: "本州日本海側唯一の穀物専用岸壁", isCorrect: false },
      { text: "南九州全体の最重要穀物供給基地", isCorrect: false },
    ],
    explanation:
      "苫小牧埠頭飼料サイロは北海道で生産される配合飼料の約3割が経由する重要拠点で、全国5位の規模を誇ります。",
    sources: [SOURCES.tomakomaiPortPdf, SOURCES.tomakomaiFutoSilo],
  },
  {
    id: "quiz-tomakomai-2",
    cardId: "silo-tomakomai",
    category: "silo",
    question: "苫小牧埠頭飼料サイロが位置する地域はどこでしょうか？",
    options: [
      { text: "北海道苫小牧市", isCorrect: true },
      { text: "新潟県聖籠町", isCorrect: false },
      { text: "鹿児島県志布志市", isCorrect: false },
      { text: "兵庫県神戸市", isCorrect: false },
    ],
    explanation:
      "苫小牧埠頭飼料サイロは北海道苫小牧市に位置し、道内飼料供給の重要拠点です。",
    sources: [SOURCES.tomakomaiFutoSilo],
  },
  {
    id: "quiz-hanshin-1",
    cardId: "silo-hanshin",
    category: "silo",
    question: "阪神サイロの特徴として正しいものは？",
    options: [
      { text: "トウモロコシ専用サイロ", isCorrect: false },
      { text: "小麦専用サイロとして西日本最大級", isCorrect: true },
      { text: "大豆専用サイロ", isCorrect: false },
      { text: "日本最古のサイロ", isCorrect: false },
    ],
    explanation:
      "阪神サイロは小麦専用サイロとして西日本最大級の規模を誇り、156基のサイロビンで約10.6万トンを収容しています。日清製粉東灘工場に隣接するのも特徴です。",
    sources: [SOURCES.hanshinSiloFacilities],
  },
  {
    id: "quiz-seto-1",
    cardId: "silo-seto",
    category: "silo",
    question: "瀬戸埠頭の特徴として正しいものはどれでしょうか？",
    options: [
      { text: "輸入した穀物を隣接する食品工場へコンベヤー供給", isCorrect: true },
      { text: "本州日本海側唯一の穀物専用岸壁", isCorrect: false },
      { text: "北海道最大級の飼料サイロ", isCorrect: false },
      { text: "米専用の内陸サイロ", isCorrect: false },
    ],
    explanation:
      "瀬戸埠頭は年80万トンの穀物を輸入し、隣接する食品工場へコンベヤーで供給する仕組みを持っています。",
    sources: [SOURCES.setoFutoTop],
  },
  {
    id: "quiz-seto-2",
    cardId: "silo-seto",
    category: "silo",
    question: "瀬戸埠頭が位置する地域はどこでしょうか？",
    options: [
      { text: "岡山県倉敷市", isCorrect: true },
      { text: "愛知県知多市", isCorrect: false },
      { text: "北海道苫小牧市", isCorrect: false },
      { text: "福岡県福岡市", isCorrect: false },
    ],
    explanation:
      "瀬戸埠頭は岡山県倉敷市に位置し、港湾立地を活かして穀物を供給しています。",
    sources: [SOURCES.setoFutoCompany],
  },
  {
    id: "quiz-higashinada-1",
    cardId: "silo-higashinada",
    category: "silo",
    question: "東灘トーメンサイロの特徴として正しいものはどれでしょうか？",
    options: [
      { text: "商社系として最初期の大型臨海サイロ", isCorrect: true },
      { text: "北海道で最大規模の飼料サイロ", isCorrect: false },
      { text: "小麦専用サイロとして西日本最大級", isCorrect: false },
      { text: "本州日本海側唯一の穀物専用岸壁", isCorrect: false },
    ],
    explanation:
      "東灘トーメンサイロは商社系最初の大型臨海サイロとして知られ、関西地区の畜産・食品産業に貢献しています。",
    sources: [SOURCES.tomsenSiloOutline],
  },
  {
    id: "quiz-higashinada-2",
    cardId: "silo-higashinada",
    category: "silo",
    question: "東灘トーメンサイロが位置する地域はどこでしょうか？",
    options: [
      { text: "兵庫県神戸市", isCorrect: true },
      { text: "岡山県倉敷市", isCorrect: false },
      { text: "北海道広尾町", isCorrect: false },
      { text: "愛知県碧南市", isCorrect: false },
    ],
    explanation:
      "東灘トーメンサイロは兵庫県神戸市に位置し、関西地区への穀物供給を支えています。",
    sources: [SOURCES.tomsenSiloOutline],
  },
  {
    id: "quiz-nakanihon-1",
    cardId: "silo-nakanihon",
    category: "silo",
    question: "中日本グレーンセンターの役割として正しいものはどれでしょうか？",
    options: [
      { text: "コーンスターチ原料の安定供給を担う", isCorrect: true },
      { text: "小麦専用サイロとして西日本最大級", isCorrect: false },
      { text: "南九州向け飼料の中継基地", isCorrect: false },
      { text: "本州日本海側唯一の穀物専用岸壁", isCorrect: false },
    ],
    explanation:
      "中日本グレーンセンターはコーンスターチ原料となるトウモロコシの安定供給を担う大型穀物サイロです。",
    sources: [SOURCES.nakanihonGrainCompany],
  },
  {
    id: "quiz-nakanihon-2",
    cardId: "silo-nakanihon",
    category: "silo",
    question: "中日本グレーンセンターが位置する地域はどこでしょうか？",
    options: [
      { text: "愛知県碧南市", isCorrect: true },
      { text: "岩手県釜石市", isCorrect: false },
      { text: "鹿児島県鹿児島市", isCorrect: false },
      { text: "千葉県千葉市", isCorrect: false },
    ],
    explanation:
      "中日本グレーンセンターは愛知県碧南市に位置し、工業地帯で原料供給を支えています。",
    sources: [SOURCES.nakanihonGrainCompany],
  },
  {
    id: "quiz-zenno-niigata-2",
    cardId: "silo-zenno-niigata",
    category: "silo",
    question: "全農サイロ新潟支店の取り扱い穀物として正しい組み合わせは？",
    options: [
      { text: "トウモロコシ・大豆・小麦", isCorrect: true },
      { text: "米・砂糖・麦芽", isCorrect: false },
      { text: "綿花・カカオ・茶葉", isCorrect: false },
      { text: "原油・石炭・木材", isCorrect: false },
    ],
    explanation:
      "全農サイロ新潟支店はトウモロコシ・大豆・小麦を扱い、日本海側の重要な穀物供給拠点です。",
    sources: [SOURCES.zennoSiloNiigataBase],
  },
  {
    id: "quiz-tokachi-2",
    cardId: "silo-tokachi",
    category: "silo",
    question: "十勝グレーンセンターが主に支える地域・分野として正しいものは？",
    options: [
      { text: "十勝の酪農・畜産向け飼料", isCorrect: true },
      { text: "関東の製粉工場向け小麦", isCorrect: false },
      { text: "本州日本海側の穀物専用岸壁", isCorrect: false },
      { text: "南九州の牧草供給", isCorrect: false },
    ],
    explanation:
      "十勝グレーンセンターは北海道広尾港に位置し、十勝の酪農・畜産を支える飼料用穀物の供給拠点です。",
    sources: [SOURCES.tokachiGrainCompany],
  },
  {
    id: "quiz-hanshin-2",
    cardId: "silo-hanshin",
    category: "silo",
    question: "阪神サイロに隣接する施設として正しいものはどれでしょうか？",
    options: [
      { text: "日清製粉東灘工場", isCorrect: true },
      { text: "大型バイオエタノール工場", isCorrect: false },
      { text: "国際空港の貨物ターミナル", isCorrect: false },
      { text: "製糖工場", isCorrect: false },
    ],
    explanation:
      "阪神サイロは日清製粉東灘工場に隣接しており、原料供給の効率化に貢献しています。",
    sources: [SOURCES.hanshinSiloFacilities],
  },
  {
    id: "quiz-kanto-2",
    cardId: "silo-kanto",
    category: "silo",
    question: "関東グレーンターミナルが位置する港はどこでしょうか？",
    options: [
      { text: "鹿島港", isCorrect: true },
      { text: "清水港", isCorrect: false },
      { text: "新潟港", isCorrect: false },
      { text: "室蘭港", isCorrect: false },
    ],
    explanation:
      "関東グレーンターミナルは茨城県の鹿島港に位置し、日本最大の穀物取扱量を誇ります。",
    sources: [SOURCES.kantoGrainCompany],
  },
  {
    id: "quiz-zenno-kashima-2",
    cardId: "silo-zenno-kashima",
    category: "silo",
    question: "全農サイロ鹿島支店が主に取り扱う穀物の組み合わせはどれでしょうか？",
    options: [
      { text: "トウモロコシ・大豆・小麦・マイロ", isCorrect: true },
      { text: "米・砂糖・麦芽・コーヒー豆", isCorrect: false },
      { text: "飼料米・原油・石炭・木材", isCorrect: false },
      { text: "綿花・カカオ・茶葉・香辛料", isCorrect: false },
    ],
    explanation:
      "全農サイロ鹿島支店はトウモロコシ・大豆・小麦・マイロを扱う全農グループの基幹拠点です。",
    sources: [SOURCES.zennoSiloKashimaBase],
  },
];
