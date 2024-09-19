import { EffortType, Item, Progress } from "@/app/interfaces/item";
import {
  dateRangesEqual,
  findPeriodForDateGivenRecurrence,
} from "../dates/date-util";

export const getCompletionForDate = (item: Item, date: Date) => {
  const recurrence = item.time_spec?.recurrence;
  let progress_filter = (p: Progress) => false;
  if (recurrence) {
    const range = findPeriodForDateGivenRecurrence(date, recurrence);
    if (range) {
      progress_filter = (p: Progress) => {
        const progress_time_period = findPeriodForDateGivenRecurrence(
          new Date(p.timestamp),
          recurrence
        );
        return Boolean(
          progress_time_period && dateRangesEqual(progress_time_period, range)
        );
      };
    }
  } else {
    progress_filter = (p: Progress) => true;
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
    new_item.time_spec?.recurrence &&
    getItemCompletionStatus(new_item, new Date()).is_completed
  ) {
    new_item.is_archived = true;
  }
  return new_item;
};
