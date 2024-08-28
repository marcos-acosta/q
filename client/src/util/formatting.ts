import { TimeUnit } from "@/interfaces/item";

const MINUTES_IN_HOUR = 60;

const formatCompletionTime = (time_minutes: number) => {
  const minutes_remainder = time_minutes % MINUTES_IN_HOUR;
  const hours = Math.floor(time_minutes / MINUTES_IN_HOUR);
  if (hours > 0) {
    if (minutes_remainder > 0) {
      return `${hours}h${minutes_remainder}m`;
    } else {
      return `${hours}h`;
    }
  } else {
    return `${minutes_remainder}m`;
  }
};

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

// const format_recurrence = (planning: Planning) => {
//   if (planning.effort) {
//     if (typeof planning.effort === TimeEffort)
//   }
// }

export { formatCompletionTime };
