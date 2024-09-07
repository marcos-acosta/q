import {
  DateRange,
  EffortType,
  Item,
  Progress,
  TimeUnit,
} from "@/interfaces/item";
import { isRecurring } from "./item-util";
import { dateRangesEqual, getPeriodFromDate } from "./dates";

export const getCompletionForDate = (item: Item, date: Date) => {
  const recurrence = item.time_spec?.recurrence;
  let progress_filter = (p: Progress) => true;
  if (recurrence) {
    const recurrence_cadence: TimeUnit = recurrence.unit;
    const range: DateRange = getPeriodFromDate(date, recurrence_cadence);
    progress_filter = (p: Progress) =>
      dateRangesEqual(
        getPeriodFromDate(new Date(p.timestamp), recurrence_cadence),
        range
      );
  }
  // If not recurring, the date doesn't matter.
  let times_total = 0;
  let duration_total = 0;
  item.progress.filter(progress_filter).forEach((contribution) => {
    times_total += contribution.contribution_times || 0;
    duration_total += contribution.contribution_minutes || 0;
  });
  return {
    [EffortType.COMPLETION]: times_total,
    [EffortType.DURATION]: duration_total,
  };
};

export const getQuota = (item: Item) => {
  return {
    [EffortType.COMPLETION]: item.time_spec?.required_number_of_completions,
    [EffortType.DURATION]: item.time_spec?.required_time_effort_minutes,
  };
};

export const getItemCompletionStatus = (item: Item, date: Date) => {
  const item_completion = getCompletionForDate(item, date);
  const quota = getQuota(item);
  const effort_type = item.effort_type;
  const progress = item_completion[effort_type];
  const required = quota[effort_type];
  const is_completed = required ? progress >= required : progress > 0;
  return {
    progress: progress,
    quota: required,
    is_completed: is_completed,
  };
};

export const updateItemWithProgress = (
  item: Item,
  progress: Progress
): Item => {
  const new_item: Item = {
    ...item,
    progress: [...item.progress, progress],
  };
  if (
    !isRecurring(new_item) &&
    getItemCompletionStatus(new_item, new Date()).is_completed
  ) {
    new_item.is_archived = true;
  }
  return new_item;
};
