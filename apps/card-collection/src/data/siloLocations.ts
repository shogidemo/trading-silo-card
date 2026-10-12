import type { Coordinates } from "@/types";

interface SiloLocation {
  status: "official-point" | "address-only" | "unverified";
  checkedOn: string;
  sourceUrl?: string;
  address?: string;
  coordinates?: Coordinates;
}

// 公開公式案内の施設ラベルと地点を照合。地図の中心座標は施設地点に使わない。
// 地点を確認できない施設は共有座標を維持し、UIで概略位置と明示する。
export const siloLocations: Record<string, SiloLocation> = {
  "silo-kanto": {"checkedOn": "2026-10-12", "status": "official-point", "sourceUrl": "https://www.kanto-grain.co.jp/", "address": "茨城県神栖市東深芝2-3", "coordinates": {"lat": 35.920248, "lng": 140.6651729}},
  "silo-tohoku": {"checkedOn": "2026-10-12", "status": "official-point", "sourceUrl": "https://toyotsu-grainhd.co.jp/group_company/tohoku-grain-terminal/", "address": "青森県八戸市大字河原木字海岸24番4", "coordinates": {"lat": 40.5460802, "lng": 141.5080599}},
  "silo-nihon": {"checkedOn": "2026-10-12", "status": "official-point", "sourceUrl": "https://www.nihon-silo.co.jp/company/information/", "address": "千葉県千葉市美浜区新港3-2", "coordinates": {"lat": 35.604508, "lng": 140.094533}},
  "silo-toyo": {"checkedOn": "2026-10-12", "status": "official-point", "sourceUrl": "https://toyotsu-grainhd.co.jp/group_company/toyo-grain-terminal/", "address": "愛知県知多市北浜町14-9", "coordinates": {"lat": 35.0043227, "lng": 136.8486975}},
  "silo-hakata": {"checkedOn": "2026-10-12", "status": "official-point", "sourceUrl": "https://hakata-port-silo.com/company.html", "address": "福岡県福岡市中央区那の津4丁目10番8号", "coordinates": {"lat": 33.6054178, "lng": 130.3915003}},
  "silo-zenno-kashima": {"sourceUrl": "https://www.zsilo.co.jp/company/access/", "checkedOn": "2026-10-12", "status": "official-point", "address": "茨城県神栖市東深芝3", "coordinates": {"lat": 35.9169332, "lng": 140.6679521}},
  "silo-zenno-tokai": {"sourceUrl": "https://www.zsilo.co.jp/company/access/", "checkedOn": "2026-10-12", "status": "address-only", "address": "愛知県知多市北浜町16"},
  "silo-zenno-kurashiki": {"sourceUrl": "https://www.zsilo.co.jp/company/access/", "checkedOn": "2026-10-12", "status": "official-point", "address": "岡山県倉敷市玉島乙島字新湊8267", "coordinates": {"lat": 34.4950773, "lng": 133.6826821}},
  "silo-zenno-shibushi": {"sourceUrl": "https://www.zsilo.co.jp/company/access/", "checkedOn": "2026-10-12", "status": "official-point", "address": "鹿児島県志布志市志布志町志布志3312", "coordinates": {"lat": 31.458798, "lng": 131.093865}},
  "silo-zenno-kushiro": {"sourceUrl": "https://www.zsilo.co.jp/company/access/", "checkedOn": "2026-10-12", "status": "official-point", "address": "北海道釧路市西港2丁目102番4", "coordinates": {"lat": 42.9977603, "lng": 144.3337532}},
  "silo-zenno-niigata": {"sourceUrl": "https://www.zsilo.co.jp/company/access/", "checkedOn": "2026-10-12", "status": "official-point", "address": "新潟県北蒲原郡聖籠町東港3-6962-1", "coordinates": {"lat": 37.97538369999999, "lng": 139.238119}},
  "silo-pgc-west": {"checkedOn": "2026-10-12", "status": "official-point", "sourceUrl": "https://www.pgcc.jp/branch/nishinihon/", "address": "岡山県倉敷市水島海岸通3-2", "coordinates": {"lat": 34.5131925, "lng": 133.7365101}},
  "silo-pgc-yatsushiro": {"checkedOn": "2026-10-12", "status": "official-point", "sourceUrl": "https://www.pgcc.jp/branch/yatsushiro/", "address": "熊本県八代市新港町3-12", "coordinates": {"lat": 32.5344548, "lng": 130.5428932}},
  "silo-pgc-south": {"checkedOn": "2026-10-12", "status": "official-point", "sourceUrl": "https://www.pgcc.jp/branch/minaminihon/", "address": "鹿児島県鹿児島市南栄4-20", "coordinates": {"lat": 31.5081203, "lng": 130.5303198}},
  "silo-kamaishi": {"checkedOn": "2026-10-12", "status": "official-point", "sourceUrl": "https://kgcc.co.jp/access/", "address": "岩手県釜石市港町2丁目1-1", "coordinates": {"lat": 39.2724883, "lng": 141.8857086}},
  "silo-tokachi": {"checkedOn": "2026-10-12", "status": "official-point", "sourceUrl": "https://tokachi-grain-center.com/overview/", "address": "北海道広尾郡広尾町会所前6丁目5番1", "coordinates": {"lat": 42.302944444, "lng": 143.330583333}},
  "silo-tomakomai": {"checkedOn": "2026-10-12", "status": "address-only", "sourceUrl": "https://www.tomafu.co.jp/about/?4=", "address": "北海道苫小牧市勇払145番213"},
  "silo-hanshin": {"checkedOn": "2026-10-12", "status": "official-point", "sourceUrl": "https://www.hanshin-silo.co.jp/others/contact.html", "address": "兵庫県神戸市東灘区魚崎浜町14-7", "coordinates": {"lat": 34.7034597, "lng": 135.2805853}},
  "silo-seto": {"checkedOn": "2026-10-12", "status": "official-point", "sourceUrl": "https://setofuto.co.jp/company.html", "address": "岡山県倉敷市児島塩生2767番地の24", "coordinates": {"lat": 34.4658936, "lng": 133.7705189}},
  "silo-higashinada": {"checkedOn": "2026-10-12", "status": "official-point", "sourceUrl": "https://toyotsu-grainhd.co.jp/group_company/higashinada-tomen-silo/", "address": "兵庫県神戸市東灘区住吉浜町19-2", "coordinates": {"lat": 34.7015419, "lng": 135.2629053}},
  "silo-nakanihon": {"checkedOn": "2026-10-12", "status": "address-only", "sourceUrl": "https://www.japan-cornstarch.com/information/groupcompany/tabid/120/Default.aspx", "address": "愛知県碧南市玉津浦町1番"},
};
