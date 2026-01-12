import { grainQuizzes } from "./grainQuizzes";
import { siloQuizzes } from "./siloQuizzes";
import { traderQuizzes } from "./traderQuizzes";

export const quizzes = [...grainQuizzes, ...siloQuizzes, ...traderQuizzes];

// Re-export individual arrays for potential direct access
export { grainQuizzes, siloQuizzes, traderQuizzes };
export { SOURCES } from "./sources";
