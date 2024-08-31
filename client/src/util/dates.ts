import { TimeUnit } from "@/interfaces/item";
import { addDays, addMonths, addWeeks, addYears, format } from "date-fns";
import { TimeInterval } from "./parsing";

export const formatDateIso = (date: Date) => format(date, "yyyy-MM-dd");

export const getNearestStartDate = (unit: TimeUnit): string => {
  switch (unit) {
    case TimeUnit.DAY:
      return formatDateIso(new Date());
    case TimeUnit.WEEK:
      let prev_monday = new Date();
      prev_monday.setDate(
        prev_monday.getDate() - ((prev_monday.getDay() + 6) % 7)
      );
      return formatDateIso(prev_monday);
    case TimeUnit.MONTH:
      let first_day_of_month = new Date();
      first_day_of_month.setDate(1);
      return formatDateIso(first_day_of_month);
    case TimeUnit.YEAR:
      let first_day_of_year = new Date();
      first_day_of_year.setMonth(0, 1);
      return formatDateIso(first_day_of_year);
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
