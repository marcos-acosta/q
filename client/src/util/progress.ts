import { EffortType, Item, ProgressContribution } from "@/interfaces/item";

export const updateItemWithProgress = (
  item: Item,
  progress: ProgressContribution
): Item => {
  const new_item: Item = {
    ...item,
    progress: {
      progress_contributions: [
        ...item.progress.progress_contributions,
        progress,
      ],
    },
  };
  // Non-recurring
  if (!new_item.time_spec?.recurrence) {
    if (new_item.quota.effort_type == EffortType.COMPLETION) {
      let times_total = 0;
      new_item.progress.progress_contributions.forEach(
        (contribution) => (times_total += contribution.contribution_times || 0)
      );
      if (new_item.quota.times && times_total >= new_item.quota.times) {
        new_item.is_archived = true;
      }
    } else {
      let minutes_total = 0;
      new_item.progress.progress_contributions.forEach(
        (contribution) =>
          (minutes_total += contribution.contribution_minutes || 0)
      );
      if (
        new_item.quota.duration_minutes &&
        minutes_total >= new_item.quota.duration_minutes
      ) {
        new_item.is_archived = true;
      }
    }
  }
  return new_item;
};
