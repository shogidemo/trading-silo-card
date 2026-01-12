import { CardCategory } from "@/types";

export interface CategoryInfo {
  id: CardCategory;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
}

export const CATEGORY_INFO: CategoryInfo[] = [
  {
    id: "silo",
    name: "サイロ",
    nameEn: "Silo",
    description: "穀物を貯蔵する巨大な施設",
    icon: "🏭",
    color: "silo",
  },
  {
    id: "grain",
    name: "穀物",
    nameEn: "Grain",
    description: "世界を支える農産物",
    icon: "🌾",
    color: "wheat",
  },
  {
    id: "trader",
    name: "商社",
    nameEn: "Trader",
    description: "穀物を世界中に届ける企業",
    icon: "🏢",
    color: "earth",
  },
];
