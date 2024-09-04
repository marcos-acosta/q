import { Item } from "@/interfaces/item";

export const isRecurring = (item: Item) => {
  return Boolean(item.time_spec?.recurrence);
};
