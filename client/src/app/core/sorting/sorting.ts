import { Item } from "@/app/interfaces/item";
import { getItemCompletionStatus } from "../data/progress";

const compareCompletionStatus = (item_a: Item, item_b: Item) =>
  +getItemCompletionStatus(item_a, new Date()).is_completed -
  +getItemCompletionStatus(item_b, new Date()).is_completed;

const compareCreationTimestamp = (item_a: Item, item_b: Item) =>
  item_b.creation_timestamp - item_a.creation_timestamp;

export const basicSortItems = (items: Item[]): Item[] => {
  return items.sort(
    (item_a, item_b) =>
      compareCompletionStatus(item_a, item_b) ||
      compareCreationTimestamp(item_a, item_b)
  );
};
