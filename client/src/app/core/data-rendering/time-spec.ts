import { EffortType, Item, TimeUnit } from "@/app/interfaces/item";
import { differenceInCalendarDays } from "date-fns";
import { regex } from "regex";

const MINUTES_IN_HOUR = 60;
const UNIT_TO_WORD = {
  [TimeUnit.DAY]: "day",
  [TimeUnit.WEEK]: "week",
  [TimeUnit.MONTH]: "month",
  [TimeUnit.YEAR]: "year",
};
const DAYS_OF_THE_WEEK = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const MONTHS_OF_THE_YEAR = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sept",
  "oct",
  "nov",
  "dec",
];

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

const convertFrequencyToWords = (frequency: number): string => {
  if (frequency < 1) {
    return "";
  } else if (frequency < 3) {
    return ["once", "twice"][frequency - 1];
  } else {
    return `${frequency} times`;
  }
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
      return `by ${formatDateToWordsRelative(
        item.time_spec.urgency.hard_deadline
      )}`;
    } else if (item.time_spec.urgency.expected_completion_date) {
      return `by ${formatDateToWordsRelative(
        item.time_spec.urgency.expected_completion_date
      )}`;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const formatDateToWords = (date: Date) => {
  const today = new Date();
  const baseDate = `${MONTHS_OF_THE_YEAR[date.getMonth()]} ${date.getDate()}`;
  const yearSuffix =
    date.getFullYear() !== today.getFullYear() ? `, ${date.getFullYear()}` : "";
  return `${baseDate}${yearSuffix}`;
};

const formatDateToWordsRelative = (date: Date) => {
  const diffInDays = differenceInCalendarDays(date, new Date());
  if (diffInDays === 0) {
    return "today";
  } else if (diffInDays > 13 || diffInDays < -7) {
    const lateSuffix = diffInDays < -7 ? " (late)" : "";
    return `${formatDateToWords(date)}${lateSuffix}`;
  } else if (diffInDays === 1) {
    return "tomorrow";
  } else if (diffInDays === -1) {
    return "yesterday";
  }
  const prefix = diffInDays < -1 ? "last " : diffInDays > 6 ? "next " : "";
  return `${prefix}${DAYS_OF_THE_WEEK[date.getDay()]}`;
};

export const summarizeTaskTimeSpec = (item: Item): string | null => {
  const effort = convertEffortToWords(item);
  const effort_filtered = effort === "once" ? null : effort;
  const recurrence = convertRecurrenceToWords(item);
  const recurrence_adjusted =
    !effort_filtered && recurrence
      ? recurrence.replace(regex`^a\s`, "every ")
      : recurrence;
  const urgency = convertUrgencyToWords(item);
  const inOrder = [effort_filtered, recurrence_adjusted, urgency].filter(
    Boolean
  );
  return inOrder.join(" ");
};
