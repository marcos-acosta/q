import { DateRange, Item, Recurrence, TimeUnit } from "@/app/interfaces/item";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  isSameDay,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { TimeRange } from "@/app/interfaces/query";

const getStartOfToday = (date: Date) => date;

const getStartOfWeek = (date: Date) => {
  let newDate = new Date(date);
  newDate.setDate(newDate.getDate() - ((newDate.getDay() + 6) % 7));
  return newDate;
};

const getStartOfMonth = (date: Date) => {
  let newDate = new Date(date);
  newDate.setDate(1);
  return newDate;
};

const getStartOfYear = (date: Date) => {
  let newDate = new Date(date);
  newDate.setDate(0);
  return getStartOfMonth(newDate);
};

export const getStartOfPreviousPeriod = (date: Date, unit: TimeUnit): Date => {
  let dateTransformationFn = getStartOfToday;
  switch (unit) {
    case TimeUnit.DAY:
      dateTransformationFn = getStartOfToday;
      break;
    case TimeUnit.WEEK:
      dateTransformationFn = getStartOfWeek;
      break;
    case TimeUnit.MONTH:
      dateTransformationFn = getStartOfMonth;
      break;
    case TimeUnit.YEAR:
      dateTransformationFn = getStartOfYear;
      break;
  }
  return dateTransformationFn(date);
};

const findPeriodForDate = (
  date: Date,
  recurrence: Recurrence,
  addFn: (d: Date, n: number) => Date,
  diffFn: (d1: Date, d2: Date) => number
): null | DateRange => {
  const startDate = recurrence.start_date;
  const unitsBetween = diffFn(date, startDate);
  if (unitsBetween < 0) {
    return null;
  }
  const numberOfPeriodsBetweenDates = Math.floor(
    unitsBetween / recurrence.inverse_frequency
  );
  const periodStart = addFn(
    startDate,
    numberOfPeriodsBetweenDates * recurrence.inverse_frequency
  );
  const periodEnd = addFn(periodStart, recurrence.inverse_frequency);
  return {
    start_date_inclusive: clearTime(periodStart),
    end_date_exclusive: clearTime(periodEnd),
  };
};

export const findPeriodForDateGivenRecurrence = (
  date: Date,
  recurrence: Recurrence
) => {
  let addFn = addDays;
  let diffFn = differenceInDays;
  switch (recurrence.unit) {
    case TimeUnit.DAY:
      addFn = addDays;
      diffFn = differenceInDays;
      break;
    case TimeUnit.WEEK:
      addFn = addWeeks;
      diffFn = differenceInWeeks;
      break;
    case TimeUnit.MONTH:
      addFn = addMonths;
      diffFn = differenceInMonths;
      break;
    case TimeUnit.YEAR:
      addFn = addYears;
      diffFn = differenceInYears;
      break;
  }
  return findPeriodForDate(date, recurrence, addFn, diffFn);
};

export const addIntervalToDate = (date: Date, interval: TimeRange): Date => {
  let addFn: (d: Date, n: number) => Date;
  switch (interval.unit) {
    case TimeUnit.DAY:
      addFn = addDays;
      break;
    case TimeUnit.WEEK:
      addFn = addWeeks;
      break;
    case TimeUnit.MONTH:
      addFn = addMonths;
      break;
    case TimeUnit.YEAR:
      addFn = addYears;
      break;
  }
  return addFn(date, interval.amount);
};

export const subIntervalFromDate = (date: Date, interval: TimeRange): Date => {
  let subFn: (d: Date, n: number) => Date;
  switch (interval.unit) {
    case TimeUnit.DAY:
      subFn = subDays;
      break;
    case TimeUnit.WEEK:
      subFn = subWeeks;
      break;
    case TimeUnit.MONTH:
      subFn = subMonths;
      break;
    case TimeUnit.YEAR:
      subFn = subYears;
      break;
  }
  return subFn(date, interval.amount);
};

export const dateRangesEqual = (d1: DateRange, d2: DateRange) =>
  isSameDay(d1.end_date_exclusive, d2.end_date_exclusive) &&
  isSameDay(d1.start_date_inclusive, d2.start_date_inclusive);

export const getNearestDueDateInclusive = (item: Item): Date | null => {
  if (item.time_spec?.recurrence) {
    const relevantPeriod = findPeriodForDateGivenRecurrence(
      new Date(),
      item.time_spec.recurrence
    );
    return relevantPeriod
      ? subDays(relevantPeriod.end_date_exclusive, 1)
      : null;
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

export const clearTime = (d: Date) => {
  const date = new Date(d);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};
