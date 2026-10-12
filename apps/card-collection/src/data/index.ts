import { Card } from "@/types";
import { grains as sharedGrains, silos as sharedSilos, traders as sharedTraders } from "@trading-silo/shared";

// このアプリでは利用根拠が未確認の画像を配信しない。共有データは変更しない。
const withoutLegacyImage = <T extends Card>(card: T): T => ({
  ...card, imageUrl: undefined, imageAttribution: undefined,
});
export const grains = sharedGrains.map(withoutLegacyImage);
export const silos = sharedSilos.map(withoutLegacyImage);
export const traders = sharedTraders.map(withoutLegacyImage);

// App-specific exports
export { quizzes } from "./quizzes";

export const allCards: Card[] = [...grains, ...silos, ...traders];
