import { EffortType, Item, Progress } from "@/app/interfaces/item";
import {
  dateRangesEqual,
  findPeriodForDateGivenRecurrence,
} from "../dates/date-util";

export const getCompletionForDate = (item: Item, date: Date) => {
  const recurrence = item.time_spec?.recurrence;
  let progressDateFilter = (p: Progress) => false;
  if (recurrence) {
    const range = findPeriodForDateGivenRecurrence(date, recurrence);
    if (range) {
      progressDateFilter = (p: Progress) => {
        const progressPeriod = findPeriodForDateGivenRecurrence(
          new Date(p.timestamp),
          recurrence
        );
        return Boolean(
          progressPeriod && dateRangesEqual(progressPeriod, range)
        );
      };
    }
  } else {
    // If not recurring, the date doesn't matter.
    progressDateFilter = (p: Progress) => true;
  }
  let timesTotal = 0;
  let durationTotal = 0;
  item.progress.filter(progressDateFilter).forEach((contribution) => {
    timesTotal += contribution.contribution_times || 0;
    durationTotal += contribution.contribution_minutes || 0;
  });
  return {
    [EffortType.COMPLETION]: timesTotal,
    [EffortType.DURATION]: durationTotal,
  };
};

export const getQuota = (item: Item) => {
  return {
    [EffortType.COMPLETION]: item.time_spec?.required_number_of_completions,
    [EffortType.DURATION]: item.time_spec?.required_time_effort_minutes,
  };
};

export interface CompletionStatus {
  progress: number;
  quota?: number;
  is_completed: boolean;
}

export const getItemCompletionStatus = (
  item: Item,
  date: Date
): CompletionStatus => {
  const item_completion = getCompletionForDate(item, date);
  const quota = getQuota(item);
  const effortType = item.effort_type;
  const progress = item_completion[effortType];
  const required = quota[effortType];
  const isCompleted = required ? progress >= required : progress > 0;
  return {
    progress: progress,
    quota: required,
    is_completed: isCompleted,
  };
};

export const updateItemWithProgress = (
  item: Item,
  progress: Progress
): Item => {
  const newItem: Item = {
    ...item,
    progress: [...item.progress, progress],
  };
  // Archive if not recurring and is completed
  if (
    !newItem.time_spec?.recurrence &&
    getItemCompletionStatus(newItem, new Date()).is_completed
  ) {
    newItem.is_archived = true;
  }
  return newItem;
};
