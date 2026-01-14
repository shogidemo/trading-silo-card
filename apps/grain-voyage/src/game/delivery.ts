import { DeliveryMethod } from "@/types";

export const DELIVERY_METHODS: Record<
  DeliveryMethod,
  { amount: number; turns: number; cost: number; label: string }
> = {
  truck: {
    amount: 500,
    turns: 1,
    cost: 100000,
    label: "トラック",
  },
  coastal_ship: {
    amount: 5000,
    turns: 3,
    cost: 300000,
    label: "内航船",
  },
};

export function getDeliverySpec(method: DeliveryMethod) {
  return DELIVERY_METHODS[method];
}
