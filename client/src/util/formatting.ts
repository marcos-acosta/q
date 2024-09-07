import { EffortType, Item, TimeUnit } from "@/interfaces/item";

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

export const capitalize = (text: string) => {
  if (text.length === 0) {
    return "";
  } else {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
};

const convertFrequencyToWords = (frequency: number): string => {
  if (frequency < 1) {
    return "";
  } else if (frequency < 3) {
    return ["once", "twice"][frequency - 1];
  } else {
    return `${frequency} times`;
  }
};

const UNIT_TO_WORD = {
  [TimeUnit.DAY]: "day",
  [TimeUnit.WEEK]: "week",
  [TimeUnit.MONTH]: "month",
  [TimeUnit.YEAR]: "year",
};

const convertEffortToWords = (item: Item): string | null => {
  if (item.effort_type == EffortType.COMPLETION) {
    const num_completions = item.time_spec?.required_number_of_completions;
    if (!num_completions || num_completions < 1) {
      return null;
    }
    return convertFrequencyToWords(num_completions);
  } else {
    const duration_minutes = item.time_spec?.required_time_effort_minutes;
    if (!duration_minutes || duration_minutes < 1) {
      return null;
    }
    return formatCompletionTime(duration_minutes);
  }
};

const convertRecurrenceToWords = (item: Item): string | null => {
  if (item.time_spec?.recurrence) {
    const inverse_freq = item.time_spec.recurrence.inverse_frequency;
    const inverse_frequency_word =
      inverse_freq === 1 ? "a" : `every ${inverse_freq}`;
    const unit_word = `${UNIT_TO_WORD[item.time_spec.recurrence.unit]}${
      inverse_freq != 1 ? "s" : ""
    }`;
    return `${inverse_frequency_word} ${unit_word}`;
  } else {
    return null;
  }
};

const convertUrgencyToWords = (item: Item): string | null => {
  if (item.time_spec?.urgency) {
    if (item.time_spec.urgency.hard_deadline) {
      return `by ${item.time_spec.urgency.hard_deadline}`;
    } else if (item.time_spec.urgency.expected_completion_date) {
      return `by ~${item.time_spec.urgency.expected_completion_date}`;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

/**
 * once (don't show)
 * twice
 * 3 times
 * every month
 * twice a month
 * three times a week
 * three times every 2 weeks
 * twice by 2024-09-03
 * 2h30m every 2 weeks
 * 45m by 2024-09-05
 * 15m a week
 */
export const summarizeTaskTimeSpec = (item: Item): string | null => {
  const effort = convertEffortToWords(item);
  const effort_filtered = effort === "once" ? null : effort;
  const recurrence = convertRecurrenceToWords(item);
  const urgency = convertUrgencyToWords(item);
  const inOrder = [effort_filtered, recurrence, urgency].filter(Boolean);
  return inOrder.join(" ");
};

export const formatTag = (tag: string): string => `#${tag}`;
