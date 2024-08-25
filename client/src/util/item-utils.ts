import { Item, Recurrence, TimeUnit } from "@/interfaces/item";
import { formatCompletionTime } from "./formatting";

const areItemDependenciesSatisfied = (item: Item, all_items: Item[]): boolean =>
  item.is_completed ||
  item.dependency_ids.length === 0 ||
  item.dependency_ids.every((id) => {
    const dependency: Item | undefined = all_items.find(
      (search_item) => search_item.id === id
    );
    return dependency === undefined || dependency.is_completed;
  });

const convertFrequencyToWords = (
  frequency: number | undefined
): string | undefined => {
  if (!frequency || frequency < 1) {
    return undefined;
  } else if (frequency < 3) {
    return ["once", "twice"][frequency - 1];
  } else {
    return `${frequency} times`;
  }
};

const unit_to_word = {
  [TimeUnit.DAY]: "day",
  [TimeUnit.WEEK]: "week",
  [TimeUnit.MONTH]: "month",
  [TimeUnit.YEAR]: "year",
};

const convertRecurrenceToWords = (recurrence: Recurrence | undefined) => {
  if (!recurrence) {
    return undefined;
  }
  const frequency = recurrence.inverse_frequency;
  const multiplier = frequency && frequency > 1 ? frequency : "";
  const unit = recurrence.unit ? unit_to_word[recurrence.unit] : "";
  const unit_with_plural = unit
    ? frequency && frequency > 1
      ? `${unit}s`
      : unit
    : null;
  return `every ${multiplier} ${unit_with_plural}`;
};

const formatPlanning = (item: Item): string => {
  const frequency = convertFrequencyToWords(
    item.planning?.completion_effort?.frequency
  );
  const duration = item.planning?.time_effort?.duration_minutes
    ? formatCompletionTime(item.planning.time_effort.duration_minutes)
    : undefined;
  const recurrence = convertRecurrenceToWords(item.planning?.recurrence);
  const frequency_string = frequency
    ? `${frequency} `
    : duration
    ? `${duration} `
    : "";
  const recurrence_string = recurrence ? recurrence : "";
  return `${frequency_string}${recurrence_string}`;
};

export { areItemDependenciesSatisfied, formatPlanning };
