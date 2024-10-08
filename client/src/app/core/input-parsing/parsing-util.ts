import { PriorityLevel, TimeUnit } from "@/app/interfaces/item";
import { regex } from "regex";
import {
  addIntervalToDate,
  clearTime,
  getStartOfPreviousPeriod,
} from "../dates/date-util";
import { subDays } from "date-fns";
import {
  Comparator,
  DateField,
  DateMatcher,
  QuantifiableItemField,
  QuantifierMatcher,
  TimeRange,
} from "@/app/interfaces/query";

const LETTER_TO_TIME_UNIT: { [key: string]: TimeUnit } = {
  d: TimeUnit.DAY,
  w: TimeUnit.WEEK,
  m: TimeUnit.MONTH,
  y: TimeUnit.YEAR,
};

const YMD_PATTERN = regex`(?<year>\d{4})-(?<month>\d{2})-(?<date>\d{2})`;
const MD_PATTERN = regex`(?<month>\d\d?)-(?<date>\d\d?)`;

export const parseTimeDurationToMinutes = (duration: string): number => {
  const matches = duration.match(regex`^(?<quantity>\d+)(?<unit>[mh])$`);
  if (matches?.groups && matches.groups["quantity"] && matches.groups["unit"]) {
    const quantity = parseInt(matches.groups["quantity"]);
    const unit = matches.groups["unit"];
    if (unit == "m") {
      return quantity;
    } else if (unit == "h") {
      return quantity * 60;
    }
  }
  throw Error(`Failed to parse duration: ${duration}`);
};

export const parseTimeInterval = (time_interval: string): TimeRange => {
  const matches = time_interval.match(
    regex`^(?<quantity>\d+)?(?<unit>[dwmy])$`
  );
  if (matches?.groups && matches.groups["unit"]) {
    const quantity = matches.groups["quantity"]
      ? parseInt(matches.groups["quantity"])
      : 1;
    const unit = matches.groups["unit"];
    if (unit in LETTER_TO_TIME_UNIT) {
      return {
        amount: quantity,
        unit: LETTER_TO_TIME_UNIT[unit],
      };
    }
  }
  throw Error(`Failed to parse time interval: ${time_interval}`);
};

export const parsePriorityFromString = (
  priorityString: string
): PriorityLevel => {
  try {
    return parsePriority(parseInt(priorityString));
  } catch (e) {
    throw Error(`Failed to parse ${priorityString} as a number`);
  }
};

export const parsePriority = (priority: number): PriorityLevel => {
  if (priority < 0 || priority > 4) {
    throw Error(`Priority out of bounds: ${priority}`);
  }
  return [
    PriorityLevel.P0,
    PriorityLevel.P1,
    PriorityLevel.P2,
    PriorityLevel.P3,
    PriorityLevel.P4,
  ][priority];
};

const convertRoughDurationToDate = (duration: string) => {
  try {
    const timeInterval = parseTimeInterval(duration);
    const startOfPeriod = getStartOfPreviousPeriod(
      new Date(),
      timeInterval.unit
    );
    return subDays(addIntervalToDate(startOfPeriod, timeInterval), 1);
  } catch (e) {
    throw Error(`Could not parse ${duration} as a date.`);
  }
};

const convertDateStringToDate = (dateString: string) => {
  const ymdMatch = dateString.match(YMD_PATTERN);
  const mdMatch = dateString.match(MD_PATTERN);
  if (ymdMatch && ymdMatch.groups) {
    let newDate = clearTime(new Date());
    newDate.setFullYear(parseInt(ymdMatch.groups["year"]));
    newDate.setMonth(parseInt(ymdMatch.groups["month"]) - 1);
    newDate.setDate(parseInt(ymdMatch.groups["date"]));
    return newDate;
  } else if (mdMatch && mdMatch.groups) {
    let newDate = clearTime(new Date());
    newDate.setMonth(parseInt(mdMatch.groups["month"]) - 1);
    newDate.setDate(parseInt(mdMatch.groups["date"]));
    if (newDate < new Date()) {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    return newDate;
  } else {
    throw Error(`Could not parse ${dateString} as a date.`);
  }
};

export const parseStringToDate = (timeExpression: string): Date => {
  try {
    return convertDateStringToDate(timeExpression);
  } catch (e) {
    return convertRoughDurationToDate(timeExpression);
  }
};

const parseComparator = (s: string): [Comparator, string] => {
  if (s.startsWith("<=")) {
    return [Comparator.LTEQ, s.slice(2)];
  } else if (s.startsWith("<")) {
    return [Comparator.LT, s.slice(1)];
  } else if (s.startsWith(">=")) {
    return [Comparator.GTEQ, s.slice(2)];
  } else if (s.startsWith(">")) {
    return [Comparator.GT, s.slice(1)];
  } else if (s.startsWith("=")) {
    return [Comparator.EQ, s.slice(1)];
  } else {
    return [Comparator.EQ, s];
  }
};

export const parseDatesToMatchers = (
  timeExpressions: string,
  field: DateField
): DateMatcher[] => {
  return timeExpressions
    .split(",")
    .map((timeExpression) => parseDateToMatcher(timeExpression, field));
};

export const parseDateToMatcher = (
  timeExpression: string,
  field: DateField
): DateMatcher => {
  const [comparator, restOfTimeExpression] = parseComparator(timeExpression);
  let matcher = { comparator: comparator, field: field } as DateMatcher;
  matcher.comparator = comparator;
  try {
    matcher.time_range = parseTimeInterval(restOfTimeExpression);
  } catch (e) {
    try {
      matcher.date = convertDateStringToDate(restOfTimeExpression);
    } catch (e) {
      throw Error(
        `Could not parse ${restOfTimeExpression} to a date or time range.`
      );
    }
  }
  return matcher;
};

export const parsePriorityToMatcher = (
  priorityExpression: string
): QuantifierMatcher => {
  const [comparator, restOfPriorityExpression] =
    parseComparator(priorityExpression);
  try {
    return {
      comparator: comparator,
      field: QuantifiableItemField.PRIORITY,
      comparison_value: parsePriorityFromString(restOfPriorityExpression),
    };
  } catch (e) {
    throw Error(`Could not parse ${restOfPriorityExpression} to a priority.`);
  }
};
