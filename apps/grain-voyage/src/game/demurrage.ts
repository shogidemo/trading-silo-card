export const DEMURRAGE_RATES = {
  early: 500000,
  late: 1000000,
};

export function calculateDemurrageCharge(
  berthingTurn: number,
  freeTime: number
): number {
  if (berthingTurn <= freeTime) return 0;
  const overage = berthingTurn - freeTime;
  if (overage <= 3) return DEMURRAGE_RATES.early;
  return DEMURRAGE_RATES.late;
}
