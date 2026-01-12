import { Card } from "@/types";
import { grains, silos, traders } from "@trading-silo/shared";

// Re-export from shared package
export { grains, silos, traders } from "@trading-silo/shared";

// App-specific exports
export { quizzes } from "./quizzes";

export const allCards: Card[] = [...grains, ...silos, ...traders];
