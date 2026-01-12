import { Quiz } from "@/types";
import { SOURCES } from "./sources";

export const siloQuizzes: Quiz[] = [
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
    question: "東北グレーンターミナルに集積している飼料メーカーの数は？",
    options: [
      { text: "6社", isCorrect: true },
      { text: "3社", isCorrect: false },
      { text: "10社", isCorrect: false },
      { text: "15社", isCorrect: false },
    ],
    explanation:
      "東北グレーンターミナルには6社の飼料メーカーが集積しており、東北最大級の飼料穀物サイロとして地域の畜産を支えています。",
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
    question: "日本サイロ千葉事業所が保有するサイロの本数は？",
    options: [
      { text: "122本", isCorrect: true },
      { text: "156本", isCorrect: false },
      { text: "302本", isCorrect: false },
      { text: "326本", isCorrect: false },
    ],
    explanation:
      "日本サイロ千葉事業所は122本のサイロを有し、計13.5万トンの収容力を持つ東日本の主要グレーンターミナルです。",
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
    question: "博多港サイロの九州における役割として正しいものは？",
    options: [
      { text: "九州の食を支える穀物サイロのリーディングカンパニー", isCorrect: true },
      { text: "九州唯一の米専用サイロ", isCorrect: false },
      { text: "九州最大の石油備蓄基地", isCorrect: false },
      { text: "九州の水産物輸出専門港", isCorrect: false },
    ],
    explanation:
      "博多港サイロは1964年設立で60年以上の歴史を持ち、九州の食を支える穀物サイロのリーディングカンパニーとして知られています。",
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
    question: "全農サイロ東海支店の開設当時の社名は？",
    options: [
      { text: "東海サイロ株式会社", isCorrect: true },
      { text: "中部グレーンターミナル株式会社", isCorrect: false },
      { text: "名古屋港サイロ株式会社", isCorrect: false },
      { text: "知多グレーンセンター株式会社", isCorrect: false },
    ],
    explanation:
      "全農サイロ東海支店は1969年に東海サイロ株式会社として開設され、その後全農サイロに統合されました。",
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
    question: "全農サイロ志布志支店が他の全農サイロと異なる特徴は？",
    options: [
      { text: "輸入粗飼料（乾牧草）も取り扱う", isCorrect: true },
      { text: "小麦専用サイロである", isCorrect: false },
      { text: "日本最大の収容能力を持つ", isCorrect: false },
      { text: "本州日本海側唯一のサイロである", isCorrect: false },
    ],
    explanation:
      "全農サイロ志布志支店は輸入飼料原料に加え、輸入粗飼料（乾牧草）も取り扱う点が特徴で、九州・沖縄・四国向けの供給や南九州向けの配送を担っています。",
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
    question: "全農サイロ釧路支店が全農サイロ本体と合併した年は？",
    options: [
      { text: "2021年", isCorrect: true },
      { text: "2010年", isCorrect: false },
      { text: "2000年", isCorrect: false },
      { text: "2017年", isCorrect: false },
    ],
    explanation:
      "全農サイロ釧路支店は1970年の稼働開始以来独立して運営されていましたが、2021年に全農サイロ本体と合併しました。",
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
    question: "パシフィックグレーンセンター西日本支店が保有するサイロの基数は？",
    options: [
      { text: "109基", isCorrect: true },
      { text: "156基", isCorrect: false },
      { text: "302基", isCorrect: false },
      { text: "326基", isCorrect: false },
    ],
    explanation:
      "パシフィックグレーンセンター西日本支店は水島港に位置し、109基のサイロで中四国地区への穀物供給を担う丸紅グループのサイロです。",
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
    question: "パシフィックグレーンセンター八代支店の第一期サイロが竣工した年は？",
    options: [
      { text: "1995年", isCorrect: true },
      { text: "1968年", isCorrect: false },
      { text: "1972年", isCorrect: false },
      { text: "2008年", isCorrect: false },
    ],
    explanation:
      "パシフィックグレーンセンター八代支店は1995年に第一期サイロが竣工し、九州中部への穀物供給を担っています。",
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
    question: "釜石グレーンセンターの出資企業として正しい組み合わせは？",
    options: [
      { text: "丸紅・三菱商事・日本製鉄グループ", isCorrect: true },
      { text: "伊藤忠・住友商事・トヨタグループ", isCorrect: false },
      { text: "三井物産・双日・JFEグループ", isCorrect: false },
      { text: "全農・農林中金・JA全中", isCorrect: false },
    ],
    explanation:
      "釜石グレーンセンターは丸紅・三菱商事・日本製鉄グループが出資する飼料穀物サイロで、釜石港の水深を活かし大型外航船を受け入れています。",
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
    question: "苫小牧埠頭飼料サイロが保有するサイロの本数は？",
    options: [
      { text: "302本", isCorrect: true },
      { text: "122本", isCorrect: false },
      { text: "156本", isCorrect: false },
      { text: "326本", isCorrect: false },
    ],
    explanation:
      "苫小牧埠頭飼料サイロは302本のサイロを有し、北海道で生産される配合飼料の約3割にあたる約110万トン/年が経由する全国5位の規模を誇ります。",
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
    question: "瀬戸埠頭の年間穀物輸入量は約何万トン？",
    options: [
      { text: "約80万トン", isCorrect: true },
      { text: "約30万トン", isCorrect: false },
      { text: "約150万トン", isCorrect: false },
      { text: "約400万トン", isCorrect: false },
    ],
    explanation:
      "瀬戸埠頭は年間約80万トンの穀物を輸入し、隣接する食品工場へコンベヤーで直接供給する仕組みを持っています。",
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
    question: "東灘トーメンサイロが阪神大震災で被災した後、復旧したのはいつ？",
    options: [
      { text: "同年秋（1995年秋）", isCorrect: true },
      { text: "翌年（1996年）", isCorrect: false },
      { text: "3年後（1998年）", isCorrect: false },
      { text: "5年後（2000年）", isCorrect: false },
    ],
    explanation:
      "東灘トーメンサイロは1995年の阪神大震災で被災しましたが、同年秋には復旧し、関西地区の穀物供給を支え続けています。",
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
    question: "中日本グレーンセンターの親会社はどの企業？",
    options: [
      { text: "日本コーンスターチ", isCorrect: true },
      { text: "日清製粉", isCorrect: false },
      { text: "昭和産業", isCorrect: false },
      { text: "日本製粉", isCorrect: false },
    ],
    explanation:
      "中日本グレーンセンターは日本コーンスターチの子会社で、コーンスターチ原料となるトウモロコシの保管・安定供給を担っています。",
    sources: [SOURCES.nakanihonGrainCompany],
  },
  {
    id: "quiz-zenno-niigata-2",
    cardId: "silo-zenno-niigata",
    category: "silo",
    question: "全農サイロ新潟支店がある新潟東港の特徴は？",
    options: [
      { text: "穀物専用岸壁としては本州日本海側唯一", isCorrect: true },
      { text: "日本最大の穀物取扱量を誇る", isCorrect: false },
      { text: "小麦専用の港である", isCorrect: false },
      { text: "国内産穀物のみを扱う", isCorrect: false },
    ],
    explanation:
      "全農サイロ新潟支店は1988年に開設され、新潟東港にある穀物専用岸壁としては本州日本海側唯一のサイロです。",
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
    id: "quiz-hanshin-3",
    cardId: "silo-hanshin",
    category: "silo",
    question: "阪神サイロが保有するサイロビンの基数は？",
    options: [
      { text: "156基", isCorrect: true },
      { text: "109基", isCorrect: false },
      { text: "302基", isCorrect: false },
      { text: "122基", isCorrect: false },
    ],
    explanation:
      "阪神サイロは156基のサイロビンを有し、約10.6万トンを収容する小麦専用サイロとして西日本最大級の規模を誇ります。",
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
    question: "全農サイロ鹿島支店の年間穀物取扱量は約何万トン？",
    options: [
      { text: "約500万トン", isCorrect: true },
      { text: "約100万トン", isCorrect: false },
      { text: "約50万トン", isCorrect: false },
      { text: "約200万トン", isCorrect: false },
    ],
    explanation:
      "全農サイロ鹿島支店は326本のサイロを有し、年間約500万トンの穀物を取り扱う全農グループの基幹拠点です。",
    sources: [SOURCES.zennoSiloKashimaBase],
  },

  // === 各サイロ3問目追加 ===
  {
    id: "quiz-kanto-3",
    cardId: "silo-kanto",
    category: "silo",
    question: "関東グレーンターミナルの収容能力は約何万トン？",
    options: [
      { text: "約50万トン", isCorrect: true },
      { text: "約24.5万トン", isCorrect: false },
      { text: "約10万トン", isCorrect: false },
      { text: "約80万トン", isCorrect: false },
    ],
    explanation:
      "関東グレーンターミナルは約50万トンの収容能力を持ち、年間約400万トンの穀物を取り扱う日本一のサイロです。",
    sources: [SOURCES.kantoGrainCompany],
  },
  {
    id: "quiz-tohoku-3",
    cardId: "silo-tohoku",
    category: "silo",
    question: "東北グレーンターミナルの東北地区における位置づけは？",
    options: [
      { text: "東北最大級の飼料穀物サイロ", isCorrect: true },
      { text: "東北唯一の小麦専用サイロ", isCorrect: false },
      { text: "東北最古の港湾施設", isCorrect: false },
      { text: "東北唯一の国営サイロ", isCorrect: false },
    ],
    explanation:
      "東北グレーンターミナルは東北最大級の飼料穀物サイロとして、世界の穀倉地帯と東北の畜産を結ぶ重要な役割を担っています。",
    sources: [SOURCES.tohokuGrainCompany],
  },
  {
    id: "quiz-nihon-3",
    cardId: "silo-nihon",
    category: "silo",
    question: "日本サイロ千葉事業所の収容能力は約何万トン？",
    options: [
      { text: "約13.5万トン", isCorrect: true },
      { text: "約50万トン", isCorrect: false },
      { text: "約8万トン", isCorrect: false },
      { text: "約24.5万トン", isCorrect: false },
    ],
    explanation:
      "日本サイロ千葉事業所は122本のサイロで計約13.5万トンの収容力を持つ東日本の主要グレーンターミナルです。",
    sources: [SOURCES.nihonSiloChiba],
  },
  {
    id: "quiz-toyo-3",
    cardId: "silo-toyo",
    category: "silo",
    question: "東洋グレーンターミナルが属する企業グループは？",
    options: [
      { text: "関東グレーングループ", isCorrect: true },
      { text: "全農グループ", isCorrect: false },
      { text: "丸紅グループ", isCorrect: false },
      { text: "三菱商事グループ", isCorrect: false },
    ],
    explanation:
      "東洋グレーンターミナルは関東グレーングループの2番目のサイロとして、中京地区の飼料・食品産業を支えています。",
    sources: [SOURCES.toyoGrainFacilities],
  },
  {
    id: "quiz-hakata-3",
    cardId: "silo-hakata",
    category: "silo",
    question: "博多港サイロの収容能力は約何万トン？",
    options: [
      { text: "約6万トン", isCorrect: true },
      { text: "約12万トン", isCorrect: false },
      { text: "約24万トン", isCorrect: false },
      { text: "約3万トン", isCorrect: false },
    ],
    explanation:
      "博多港サイロは約6万トンの収容能力を持ち、1964年の設立以来60年以上にわたり九州の食を支えています。",
    sources: [SOURCES.hakataSiloCompany],
  },
  {
    id: "quiz-zenno-kashima-3",
    cardId: "silo-zenno-kashima",
    category: "silo",
    question: "全農サイロ鹿島支店が保有するサイロの本数は？",
    options: [
      { text: "326本", isCorrect: true },
      { text: "156本", isCorrect: false },
      { text: "302本", isCorrect: false },
      { text: "122本", isCorrect: false },
    ],
    explanation:
      "全農サイロ鹿島支店は326本のサイロを有し、単一事業者として日本最大の穀物サイロです。",
    sources: [SOURCES.zennoSiloKashimaPdf],
  },
  {
    id: "quiz-zenno-tokai-3",
    cardId: "silo-zenno-tokai",
    category: "silo",
    question: "全農サイロ東海支店の収容能力は約何万トン？",
    options: [
      { text: "約15.2万トン", isCorrect: true },
      { text: "約8万トン", isCorrect: false },
      { text: "約24.5万トン", isCorrect: false },
      { text: "約5万トン", isCorrect: false },
    ],
    explanation:
      "全農サイロ東海支店は約15.2万トンの収容能力を持ち、中部地区の畜産・食品産業を支える重要拠点です。",
    sources: [SOURCES.zennoSiloTokaiBase],
  },
  {
    id: "quiz-zenno-kurashiki-3",
    cardId: "silo-zenno-kurashiki",
    category: "silo",
    question: "全農サイログループの中で最も新しく開設されたのは？",
    options: [
      { text: "倉敷支店（2017年）", isCorrect: true },
      { text: "新潟支店（1988年）", isCorrect: false },
      { text: "志布志支店（1975年）", isCorrect: false },
      { text: "釧路支店（1970年）", isCorrect: false },
    ],
    explanation:
      "全農サイロ倉敷支店は2017年に玉島ハーバーアイランドに開設された、全農サイログループで最も新しいサイロです。",
    sources: [SOURCES.zennoSiloKurashikiBase],
  },
  {
    id: "quiz-zenno-shibushi-3",
    cardId: "silo-zenno-shibushi",
    category: "silo",
    question: "全農サイロ志布志支店が主に供給する地域は？",
    options: [
      { text: "九州・沖縄・四国", isCorrect: true },
      { text: "北海道・東北", isCorrect: false },
      { text: "関東・甲信越", isCorrect: false },
      { text: "近畿・中国", isCorrect: false },
    ],
    explanation:
      "全農サイロ志布志支店は九州・沖縄・四国向けの飼料供給と、南九州向けの牧草配送を担っています。",
    sources: [SOURCES.zennoSiloShibushiBase],
  },
  {
    id: "quiz-zenno-kushiro-3",
    cardId: "silo-zenno-kushiro",
    category: "silo",
    question: "全農サイロ釧路支店が主に支える産業は？",
    options: [
      { text: "北海道の酪農", isCorrect: true },
      { text: "東北の養鶏", isCorrect: false },
      { text: "九州の養豚", isCorrect: false },
      { text: "関東の水産", isCorrect: false },
    ],
    explanation:
      "全農サイロ釧路支店は北海道の酪農用飼料原料を主に取り扱い、道東エリアの酪農を支えています。",
    sources: [SOURCES.zennoSiloKushiroBase],
  },
  {
    id: "quiz-zenno-niigata-3",
    cardId: "silo-zenno-niigata",
    category: "silo",
    question: "全農サイロ新潟支店の収容能力は約何万トン？",
    options: [
      { text: "約4.8万トン", isCorrect: true },
      { text: "約10万トン", isCorrect: false },
      { text: "約15万トン", isCorrect: false },
      { text: "約24万トン", isCorrect: false },
    ],
    explanation:
      "全農サイロ新潟支店は約4.8万トンの収容能力を持ち、本州日本海側唯一の穀物専用岸壁として重要な役割を担っています。",
    sources: [SOURCES.zennoSiloNiigataBase],
  },
  {
    id: "quiz-pgc-west-3",
    cardId: "silo-pgc-west",
    category: "silo",
    question: "パシフィックグレーンセンター西日本支店で他のサイロでは珍しく取り扱う穀物は？",
    options: [
      { text: "菜種", isCorrect: true },
      { text: "マイロ", isCorrect: false },
      { text: "大麦", isCorrect: false },
      { text: "ライ麦", isCorrect: false },
    ],
    explanation:
      "パシフィックグレーンセンター西日本支店はトウモロコシ・大豆・小麦に加え、菜種も取り扱う点が特徴です。",
    sources: [SOURCES.pgcWestJapan],
  },
  {
    id: "quiz-pgc-yatsushiro-3",
    cardId: "silo-pgc-yatsushiro",
    category: "silo",
    question: "パシフィックグレーンセンター八代支店が主に供給する地域は？",
    options: [
      { text: "九州中部", isCorrect: true },
      { text: "九州北部", isCorrect: false },
      { text: "南九州", isCorrect: false },
      { text: "四国", isCorrect: false },
    ],
    explanation:
      "パシフィックグレーンセンター八代支店は熊本県八代港に位置し、九州中部への穀物供給を担っています。",
    sources: [SOURCES.pgcYatsushiro],
  },
  {
    id: "quiz-pgc-south-3",
    cardId: "silo-pgc-south",
    category: "silo",
    question: "パシフィックグレーンセンター南日本支店で他のサイロでは珍しく取り扱うものは？",
    options: [
      { text: "糖蜜", isCorrect: true },
      { text: "菜種", isCorrect: false },
      { text: "牧草", isCorrect: false },
      { text: "大豆粕", isCorrect: false },
    ],
    explanation:
      "パシフィックグレーンセンター南日本支店はトウモロコシ・大豆・小麦に加え、糖蜜も取り扱う日本最大級の穀物サイロです。",
    sources: [SOURCES.pgcSouthJapan],
  },
  {
    id: "quiz-kamaishi-3",
    cardId: "silo-kamaishi",
    category: "silo",
    question: "釜石グレーンセンターの立地の特徴として正しいものは？",
    options: [
      { text: "水深を活かし大型外航船を受け入れられる", isCorrect: true },
      { text: "内陸に位置し鉄道輸送に特化している", isCorrect: false },
      { text: "本州日本海側唯一の穀物専用岸壁である", isCorrect: false },
      { text: "河川を利用した内陸水運に対応している", isCorrect: false },
    ],
    explanation:
      "釜石グレーンセンターは釜石港の水深を活かし、大型外航船を受け入れることができる立地が強みです。",
    sources: [SOURCES.iwateKamaishiPdf],
  },
  {
    id: "quiz-tokachi-3",
    cardId: "silo-tokachi",
    category: "silo",
    question: "十勝グレーンセンターが設立された年は？",
    options: [
      { text: "2008年", isCorrect: true },
      { text: "1989年", isCorrect: false },
      { text: "1970年", isCorrect: false },
      { text: "1995年", isCorrect: false },
    ],
    explanation:
      "十勝グレーンセンターは2008年に設立され、十勝の酪農・畜産を支える飼料用穀物の搬出入・保管を行っています。",
    sources: [SOURCES.tokachiGrainCompany],
  },
  {
    id: "quiz-tomakomai-3",
    cardId: "silo-tomakomai",
    category: "silo",
    question: "苫小牧埠頭飼料サイロを経由する配合飼料は北海道生産量の約何割？",
    options: [
      { text: "約3割", isCorrect: true },
      { text: "約1割", isCorrect: false },
      { text: "約5割", isCorrect: false },
      { text: "約8割", isCorrect: false },
    ],
    explanation:
      "苫小牧埠頭飼料サイロは北海道で生産される配合飼料の約3割（約110万トン/年）が経由する重要拠点です。",
    sources: [SOURCES.tomakomaiPortPdf],
  },
  {
    id: "quiz-seto-3",
    cardId: "silo-seto",
    category: "silo",
    question: "瀬戸埠頭の穀物供給方法の特徴は？",
    options: [
      { text: "隣接する食品工場へコンベヤーで直接供給", isCorrect: true },
      { text: "専用貨車による鉄道輸送", isCorrect: false },
      { text: "内航船による海上輸送のみ", isCorrect: false },
      { text: "パイプラインによる空気輸送", isCorrect: false },
    ],
    explanation:
      "瀬戸埠頭は隣接する食品工場へコンベヤーで穀物を直接供給する仕組みを持っており、効率的な原料供給を実現しています。",
    sources: [SOURCES.setoFutoTop],
  },
  {
    id: "quiz-higashinada-3",
    cardId: "silo-higashinada",
    category: "silo",
    question: "東灘トーメンサイロの歴史的な特徴として正しいものは？",
    options: [
      { text: "商社系最初の大型臨海サイロ", isCorrect: true },
      { text: "日本最古の穀物サイロ", isCorrect: false },
      { text: "全農グループ最初のサイロ", isCorrect: false },
      { text: "戦後初の外資系サイロ", isCorrect: false },
    ],
    explanation:
      "東灘トーメンサイロは1967年に完成した商社系最初の大型臨海サイロとして、日本の穀物流通の歴史に重要な役割を果たしています。",
    sources: [SOURCES.tomsenSiloOutline],
  },
  {
    id: "quiz-nakanihon-3",
    cardId: "silo-nakanihon",
    category: "silo",
    question: "中日本グレーンセンターが専門的に取り扱う穀物は？",
    options: [
      { text: "トウモロコシ", isCorrect: true },
      { text: "小麦", isCorrect: false },
      { text: "大豆", isCorrect: false },
      { text: "マイロ", isCorrect: false },
    ],
    explanation:
      "中日本グレーンセンターは日本コーンスターチの子会社として、コーンスターチ原料となるトウモロコシを専門に取り扱っています。",
    sources: [SOURCES.nakanihonGrainCompany],
  },
];
