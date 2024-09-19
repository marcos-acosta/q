import { Item } from "@/app/interfaces/item";
import { getItemCompletionStatus } from "../data/progress";

const compareCompletionStatus = (a: Item, b: Item) =>
  +getItemCompletionStatus(a, new Date()).is_completed -
  +getItemCompletionStatus(b, new Date()).is_completed;

const compareCreationTimestamp = (a: Item, b: Item) =>
  b.creation_timestamp - a.creation_timestamp;

export const basicSortItems = (items: Item[]): Item[] => {
  return items.sort(
    (a, b) => compareCompletionStatus(a, b) || compareCreationTimestamp(a, b)
  );
};
