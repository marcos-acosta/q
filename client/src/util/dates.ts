import { DateRange, Item, TimeUnit } from "@/interfaces/item";
import { addDays, addMonths, addWeeks, addYears, format } from "date-fns";
import { TimeInterval } from "./parsing";

export const formatDateIso = (date: Date) => format(date, "yyyy-MM-dd");

export const getStartOfPreviousPeriod = (date: Date, unit: TimeUnit): Date => {
  switch (unit) {
    case TimeUnit.DAY:
      return date;
    case TimeUnit.WEEK:
      let prev_monday = new Date(date);
      prev_monday.setDate(
        prev_monday.getDate() - ((prev_monday.getDay() + 6) % 7)
      );
      return prev_monday;
    case TimeUnit.MONTH:
      let first_day_of_month = new Date(date);
      first_day_of_month.setDate(1);
      return first_day_of_month;
    case TimeUnit.YEAR:
      let first_day_of_year = new Date(date);
      first_day_of_year.setMonth(0, 1);
      return first_day_of_year;
  }
};

export const getStartOfNextPeriod = (date: Date, unit: TimeUnit): Date => {
  switch (unit) {
    case TimeUnit.DAY:
      return addDays(date, 1);
    case TimeUnit.WEEK:
      let next_monday = new Date(date);
      next_monday.setDate(
        next_monday.getDate() - (((7 - next_monday.getDay()) % 7) + 1)
      );
      return next_monday;
    case TimeUnit.MONTH:
      let first_day_of_month = new Date(date);
      first_day_of_month.setDate(1);
      return addMonths(first_day_of_month, 1);
    case TimeUnit.YEAR:
      let first_day_of_year = new Date(date);
      first_day_of_year.setMonth(0, 1);
      return addYears(first_day_of_year, 1);
  }
};

export const addIntervalToDate = (
  start_date_iso: string,
  interval: TimeInterval
): string => {
  const start_date = new Date(start_date_iso);
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
  return formatDateIso(addFn(start_date, interval.quantity));
};

export const getPeriodFromDate = (date: Date, unit: TimeUnit): DateRange => {
  return {
    start_date_inclusive: formatDateIso(getStartOfPreviousPeriod(date, unit)),
    end_date_exclusive: formatDateIso(getStartOfNextPeriod(date, unit)),
  };
};

export const getPeriodForItem = (date: Date, item: Item): DateRange => {
  let unit = TimeUnit.DAY;
  if (item.time_spec?.recurrence) {
    unit = item.time_spec.recurrence.unit;
  }
  return getPeriodFromDate(date, unit);
};

export const dateRangesEqual = (d1: DateRange, d2: DateRange) =>
  d1.end_date_exclusive == d2.end_date_exclusive &&
  d1.start_date_inclusive === d2.start_date_inclusive;
