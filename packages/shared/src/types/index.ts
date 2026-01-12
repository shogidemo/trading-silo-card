// カードの種類
export type CardCategory = "silo" | "grain" | "trader";

// 座標
export interface Coordinates {
  lat: number;
  lng: number;
}

// 画像帰属情報
export interface ImageAttribution {
  label: string;
  url?: string;
}

// 基本カード情報
export interface BaseCard {
  id: string;
  category: CardCategory;
  name: string;
  description: string;
  imageUrl?: string;
  imageAttribution?: ImageAttribution;
}

// サイロカード
export interface SiloCard extends BaseCard {
  category: "silo";
  location: string;
  coordinates: Coordinates;
  capacity: string;
  grains: string[];
  establishedYear: number;
  operator: string;
}

// 穀物カード
export interface GrainCard extends BaseCard {
  category: "grain";
  origins: string[];
  uses: string[];
  nutrients: string[];
  annualProduction: string;
  trivia: string;
}

// 商社カード
export interface TraderCard extends BaseCard {
  category: "trader";
  foundedYear: number;
  headquarters: string;
  mainProducts: string[];
  globalPresence: string[];
  specialty: string;
}

// すべてのカード型のユニオン
export type Card = SiloCard | GrainCard | TraderCard;
