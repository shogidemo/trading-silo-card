import type { Coordinates } from "@/types";

interface SiloLocation {
  status: "site-point" | "unverified";
  checkedOn: string;
  positionKind?: "official-facility";
  sourceUrl?: string;
  aerialUrl?: string;
  address?: string;
  coordinates?: Coordinates;
}

// 公式施設案内と国土地理院の航空写真でサイロ本体を照合した地点。
// 公式発表座標や測量値ではない。照合根拠は docs/silo-location-audit.json。
// 未確認施設は座標なしとし、共有データの概略座標へフォールバックしない。
export const siloLocations: Record<string, SiloLocation> = {
  "silo-kanto": {"checkedOn": "2026-10-12", "status": "site-point", "sourceUrl": "https://www.kanto-grain.co.jp/", "address": "茨城県神栖市東深芝2-3", "coordinates": {"lat": 35.920465, "lng": 140.664847}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/116750/51505.jpg"},
  "silo-tohoku": {"checkedOn": "2026-10-12", "status": "site-point", "sourceUrl": "https://toyotsu-grainhd.co.jp/group_company/tohoku-grain-terminal/", "address": "青森県八戸市大字河原木字海岸24番4", "coordinates": {"lat": 40.546083, "lng": 141.508058}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/117057/49360.jpg"},
  "silo-nihon": {"checkedOn": "2026-10-12", "status": "site-point", "sourceUrl": "https://www.nihon-silo.co.jp/company/information/", "address": "千葉県千葉市美浜区新港3-2", "coordinates": {"lat": 35.605428, "lng": 140.092871}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/116542/51647.jpg"},
  "silo-toyo": {"checkedOn": "2026-10-12", "status": "site-point", "sourceUrl": "https://toyotsu-grainhd.co.jp/group_company/toyo-grain-terminal/", "address": "愛知県知多市北浜町14-9", "coordinates": {"lat": 35.004392, "lng": 136.849115}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/115361/51915.jpg"},
  "silo-hakata": {"checkedOn": "2026-10-12", "status": "site-point", "sourceUrl": "https://hakata-port-silo.com/company.html", "address": "福岡県福岡市中央区那の津4丁目10番8号", "coordinates": {"lat": 33.606091, "lng": 130.391734}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/18/226020/105063.jpg"},
  "silo-zenno-kashima": {"sourceUrl": "https://www.zsilo.co.jp/company/access/", "checkedOn": "2026-10-12", "status": "site-point", "address": "茨城県神栖市東深芝3", "coordinates": {"lat": 35.91785, "lng": 140.667347}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/116751/51507.jpg"},
  "silo-zenno-tokai": {"sourceUrl": "https://www.zsilo.co.jp/company/access/", "checkedOn": "2026-10-12", "status": "site-point", "address": "愛知県知多市北浜町16", "coordinates": {"lat": 35.003803, "lng": 136.852591}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/115362/51915.jpg"},
  "silo-zenno-kurashiki": {"sourceUrl": "https://www.zsilo.co.jp/company/access/", "checkedOn": "2026-10-12", "status": "site-point", "address": "岡山県倉敷市玉島乙島字新湊8267", "coordinates": {"lat": 34.494346, "lng": 133.682638}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/114208/52141.jpg"},
  "silo-zenno-shibushi": {"sourceUrl": "https://www.zsilo.co.jp/company/access/", "checkedOn": "2026-10-12", "status": "site-point", "address": "鹿児島県志布志市志布志町志布志3312", "coordinates": {"lat": 31.458796, "lng": 131.093867}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/113265/53459.jpg"},
  "silo-zenno-kushiro": {"sourceUrl": "https://www.zsilo.co.jp/company/access/", "checkedOn": "2026-10-12", "status": "site-point", "address": "北海道釧路市西港2丁目102番4", "coordinates": {"lat": 42.996989, "lng": 144.333369}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/118086/48163.jpg"},
  "silo-zenno-niigata": {"sourceUrl": "https://www.zsilo.co.jp/company/access/", "checkedOn": "2026-10-12", "status": "site-point", "address": "新潟県北蒲原郡聖籠町東港3-6962-1", "positionKind": "official-facility", "coordinates": {"lat": 37.975386, "lng": 139.238126}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/116231/50569.jpg"},
  "silo-pgc-west": {"checkedOn": "2026-10-12", "status": "site-point", "sourceUrl": "https://www.pgcc.jp/branch/nishinihon/", "address": "岡山県倉敷市水島海岸通3-2", "coordinates": {"lat": 34.513196, "lng": 133.736508}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/114227/52133.jpg"},
  "silo-pgc-yatsushiro": {"checkedOn": "2026-10-12", "status": "site-point", "sourceUrl": "https://www.pgcc.jp/branch/yatsushiro/", "address": "熊本県八代市新港町3-12", "coordinates": {"lat": 32.533875, "lng": 130.544207}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/18/226131/105995.jpg"},
  "silo-pgc-south": {"checkedOn": "2026-10-12", "status": "site-point", "sourceUrl": "https://www.pgcc.jp/branch/minaminihon/", "address": "鹿児島県鹿児島市南栄4-20", "coordinates": {"lat": 31.507618, "lng": 130.530281}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/113060/53438.jpg"},
  "silo-kamaishi": {"checkedOn": "2026-10-12", "status": "site-point", "sourceUrl": "https://kgcc.co.jp/access/", "address": "岩手県釜石市港町2丁目1-1", "coordinates": {"lat": 39.271833, "lng": 141.884168}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/117194/49965.jpg"},
  "silo-tokachi": {"checkedOn": "2026-10-12", "status": "site-point", "sourceUrl": "https://tokachi-grain-center.com/overview/", "address": "北海道広尾郡広尾町会所前6丁目5番1", "coordinates": {"lat": 42.302889, "lng": 143.330517}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/18/235442/97014.jpg"},
  "silo-tomakomai": {"checkedOn": "2026-10-12", "status": "site-point", "sourceUrl": "https://www.tomafu.co.jp/about/?4=", "address": "北海道苫小牧市勇払145番213", "coordinates": {"lat": 42.642262, "lng": 141.669774}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/117116/48339.jpg"},
  "silo-hanshin": {"checkedOn": "2026-10-12", "status": "site-point", "sourceUrl": "https://www.hanshin-silo.co.jp/others/contact.html", "address": "兵庫県神戸市東灘区魚崎浜町14-7", "coordinates": {"lat": 34.703399, "lng": 135.280849}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/18/229580/104097.jpg"},
  "silo-seto": {"checkedOn": "2026-10-12", "status": "site-point", "sourceUrl": "https://setofuto.co.jp/company.html", "address": "岡山県倉敷市児島塩生2767番地の24", "coordinates": {"lat": 34.468699, "lng": 133.767804}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/114239/52152.jpg"},
  "silo-higashinada": {"checkedOn": "2026-10-12", "status": "site-point", "sourceUrl": "https://toyotsu-grainhd.co.jp/group_company/higashinada-tomen-silo/", "address": "兵庫県神戸市東灘区住吉浜町19-2", "coordinates": {"lat": 34.701665, "lng": 135.261676}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/114783/52049.jpg"},
  "silo-nakanihon": {"checkedOn": "2026-10-12", "status": "site-point", "sourceUrl": "https://www.japan-cornstarch.com/information/groupcompany/tabid/120/Default.aspx", "address": "愛知県碧南市玉津浦町1番", "coordinates": {"lat": 34.866338, "lng": 136.964772}, "aerialUrl": "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/17/115403/51976.jpg"},
};
