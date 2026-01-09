import { Card } from "@/types";
import { grains } from "./grains";
import { silos } from "./silos";
import { traders } from "./traders";

export { grains } from "./grains";
export { silos } from "./silos";
export { traders } from "./traders";
export { quizzes } from "./quizzes";

export const allCards: Card[] = [...grains, ...silos, ...traders];
