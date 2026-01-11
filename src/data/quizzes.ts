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
      "全農サイロ鹿島支店は326本のサイロを有し、約24.5万トンの収容能力を持つ単一事業者として日本最大のサイロです。",
  },
  {
    id: "quiz-zenno-tokai-1",
    cardId: "silo-zenno-tokai",
    category: "silo",
    question: "全農サイロ東海支店が開設されたのは何年でしょうか？",
    options: [
      { text: "1959年", isCorrect: false },
      { text: "1969年", isCorrect: true },
      { text: "1979年", isCorrect: false },
      { text: "1989年", isCorrect: false },
    ],
    explanation:
      "全農サイロ東海支店は1969年に東海サイロ株式会社として開設され、中部地区の畜産・食品産業を支えています。",
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
  },
  {
    id: "quiz-zenno-shibushi-1",
    cardId: "silo-zenno-shibushi",
    category: "silo",
    question: "全農サイロ志布志支店を運営している会社は？",
    options: [
      { text: "パシフィックグレーンセンター株式会社", isCorrect: false },
      { text: "全農サイロ株式会社", isCorrect: true },
      { text: "博多港サイロ株式会社", isCorrect: false },
      { text: "東洋グレーンターミナル株式会社", isCorrect: false },
    ],
    explanation:
      "全農サイロ志布志支店はJA全農グループの全農サイロ株式会社が運営し、九州・沖縄・瀬戸内沿岸向け飼料を供給しています。",
  },
  {
    id: "quiz-zenno-kushiro-1",
    cardId: "silo-zenno-kushiro",
    category: "silo",
    question: "全農サイロ釧路支店の収容能力はおよそ何トンでしょうか？",
    options: [
      { text: "約5万トン", isCorrect: false },
      { text: "約10.7万トン", isCorrect: true },
      { text: "約15万トン", isCorrect: false },
      { text: "約20万トン", isCorrect: false },
    ],
    explanation:
      "全農サイロ釧路支店は約10.7万トンの収容能力を持ち、北海道の酪農用飼料原料を主に取り扱っています。",
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
  },
  {
    id: "quiz-pgc-yatsushiro-1",
    cardId: "silo-pgc-yatsushiro",
    category: "silo",
    question: "パシフィックグレーンセンター八代支店の第一期サイロが竣工したのは何年でしょうか？",
    options: [
      { text: "1985年", isCorrect: false },
      { text: "1995年", isCorrect: true },
      { text: "2005年", isCorrect: false },
      { text: "2015年", isCorrect: false },
    ],
    explanation:
      "パシフィックグレーンセンター八代支店は1995年に第一期サイロが竣工し、九州中部への穀物供給を担っています。",
  },
  {
    id: "quiz-pgc-south-1",
    cardId: "silo-pgc-south",
    category: "silo",
    question: "パシフィックグレーンセンター南日本支店の収容能力はおよそ何トンでしょうか？",
    options: [
      { text: "約10万トン", isCorrect: false },
      { text: "約15万トン", isCorrect: false },
      { text: "約23.8万トン", isCorrect: true },
      { text: "約30万トン", isCorrect: false },
    ],
    explanation:
      "パシフィックグレーンセンター南日本支店は約23.8万トンの収容能力を持つ日本最大級の穀物サイロで、南九州全体の重要な穀物供給基地です。",
  },
  {
    id: "quiz-kamaishi-1",
    cardId: "silo-kamaishi",
    category: "silo",
    question: "釜石グレーンセンターの出資企業として含まれていないのは？",
    options: [
      { text: "丸紅", isCorrect: false },
      { text: "三菱商事", isCorrect: false },
      { text: "伊藤忠商事", isCorrect: true },
      { text: "日本製鉄グループ", isCorrect: false },
    ],
    explanation:
      "釜石グレーンセンターは丸紅、三菱商事、日本製鉄グループの共同出資で運営されています。伊藤忠商事は出資していません。",
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
  },

  // === 追加サイロクイズ（その他主要サイロ） ===
  {
    id: "quiz-tomakomai-1",
    cardId: "silo-tomakomai",
    category: "silo",
    question: "苫小牧埠頭飼料サイロのサイロ本数は何本でしょうか？",
    options: [
      { text: "約100本", isCorrect: false },
      { text: "約200本", isCorrect: false },
      { text: "約302本", isCorrect: true },
      { text: "約400本", isCorrect: false },
    ],
    explanation:
      "苫小牧埠頭飼料サイロは302本のサイロを有し、北海道で生産される配合飼料の約3割が経由する全国5位の規模を誇ります。",
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
      "阪神サイロは小麦専用サイロとして西日本最大級の規模を誇り、156基のサイロビンで約10.6万トンを収容しています。",
  },
  {
    id: "quiz-seto-1",
    cardId: "silo-seto",
    category: "silo",
    question: "瀬戸埠頭の主要出資企業はどこでしょうか？",
    options: [
      { text: "丸紅", isCorrect: false },
      { text: "伊藤忠商事", isCorrect: false },
      { text: "三菱商事", isCorrect: true },
      { text: "三井物産", isCorrect: false },
    ],
    explanation:
      "瀬戸埠頭は三菱商事などが出資する港湾運送会社で、年80万トンの穀物を輸入し、隣接する食品工場にコンベヤーで供給しています。",
  },
  {
    id: "quiz-higashinada-1",
    cardId: "silo-higashinada",
    category: "silo",
    question: "東灘トーメンサイロが完成したのは何年でしょうか？",
    options: [
      { text: "1957年", isCorrect: false },
      { text: "1967年", isCorrect: true },
      { text: "1977年", isCorrect: false },
      { text: "1987年", isCorrect: false },
    ],
    explanation:
      "東灘トーメンサイロは1967年に完成した商社系最初の大型臨海サイロで、阪神大震災で被災しましたが同年秋に復旧しました。",
  },
  {
    id: "quiz-nakanihon-1",
    cardId: "silo-nakanihon",
    category: "silo",
    question: "中日本グレーンセンターを運営する親会社はどこでしょうか？",
    options: [
      { text: "丸紅", isCorrect: false },
      { text: "日本コーンスターチ", isCorrect: true },
      { text: "全農", isCorrect: false },
      { text: "カーギル", isCorrect: false },
    ],
    explanation:
      "中日本グレーンセンターは日本コーンスターチの子会社で、コーンスターチ原料であるトウモロコシの安定供給を担っています。",
  },
];
