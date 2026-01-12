import { QuizSource } from "@/types";

// Sources verified on 2026-01-11.
export const SOURCES = {
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
  maffWheatSituation: {
    title: "農林水産省「小麦をめぐる事情」",
    url: "https://www.maff.go.jp/j/seisan/boueki/mugi_zyukyuu/attach/pdf/index-60.pdf",
  },
  maffSoybeanSelfSufficiency: {
    title: "農林水産省「大豆の自給率と需給動向」",
    url: "https://www.maff.go.jp/j/seisan/ryutu/daizu/",
  },
  maffCornSituation: {
    title: "農林水産省「トウモロコシをめぐる事情」",
    url: "https://www.maff.go.jp/j/chikusan/sinko/lin/attach/pdf/index-45.pdf",
  },
  maffRiceSelfSufficiency: {
    title: "農林水産省「米の自給率と需給動向」",
    url: "https://www.maff.go.jp/j/syouan/keikaku/soukatu/index.html",
  },
  maffBarleySituation: {
    title: "農林水産省「大麦・はだか麦の需給動向」",
    url: "https://www.maff.go.jp/j/seisan/boueki/mugi_zyukyuu/",
  },
  maffSorghumFeed: {
    title: "農林水産省「飼料用穀物の需給動向」",
    url: "https://www.maff.go.jp/j/chikusan/sinko/lin/l_siryo/",
  },
  faoSorghum: {
    title: "FAO「Sorghum Production Statistics」",
    url: "https://www.fao.org/faostat/en/#data/QCL",
  },
  maffCanolaSituation: {
    title: "農林水産省「油糧種子をめぐる事情」",
    url: "https://www.maff.go.jp/j/seisan/ryutu/daizu/d_data/",
  },
  canolaCouncil: {
    title: "Canola Council of Canada「About Canola」",
    url: "https://www.canolacouncil.org/about-canola/",
  },
  wikipediaGlutenFree: {
    title: "Wikipedia「グルテンフリー」",
    url: "https://ja.wikipedia.org/wiki/%E3%82%B0%E3%83%AB%E3%83%86%E3%83%B3%E3%83%95%E3%83%AA%E3%83%BC",
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
