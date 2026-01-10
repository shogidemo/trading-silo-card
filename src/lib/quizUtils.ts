import { Quiz } from "@/types";

/**
 * Fisher-Yates shuffle algorithm
 * Returns a new shuffled array without modifying the original
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random quizzes from a pool, excluding recently used ones
 * @param quizzes - Pool of available quizzes
 * @param count - Number of quizzes to select
 * @param excludeIds - IDs of recently used quizzes to exclude
 * @returns Selected quizzes (may be fewer than count if pool is small)
 */
export function getRandomQuizzes(
  quizzes: Quiz[],
  count: number,
  excludeIds: string[] = []
): Quiz[] {
  const available = quizzes.filter((q) => !excludeIds.includes(q.id));
  const shuffled = shuffleArray(available);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Select a single quiz avoiding recent duplicates
 * Falls back to any quiz if all have been used recently
 * @param quizzes - Pool of available quizzes
 * @param recentIds - IDs of recently used quizzes (last 2-3)
 * @returns A single quiz
 */
export function selectQuizAvoidingDuplicates(
  quizzes: Quiz[],
  recentIds: string[]
): Quiz | undefined {
  if (quizzes.length === 0) return undefined;

  // Try to find a quiz not in recent history
  const available = quizzes.filter((q) => !recentIds.includes(q.id));

  if (available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }

  // Fallback: return any quiz if all have been used recently
  const randomIndex = Math.floor(Math.random() * quizzes.length);
  return quizzes[randomIndex];
}
