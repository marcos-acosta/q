import { Item } from "@/interfaces/item";
import { formatDateIso, getStartOfNextPeriod } from "./dates";

export const isRecurring = (item: Item) => {
  return Boolean(item.time_spec?.recurrence);
};

export const getNearestDueDate = (item: Item) => {
  if (item.time_spec?.recurrence) {
    return formatDateIso(
      getStartOfNextPeriod(new Date(), item.time_spec.recurrence.unit)
    );
  } else {
    if (item.time_spec?.urgency?.hard_deadline) {
      return item.time_spec.urgency.hard_deadline;
    } else if (item.time_spec?.urgency?.expected_completion_date) {
      return item.time_spec.urgency.expected_completion_date;
    } else {
      return null;
    }
  }
};
