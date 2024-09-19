import { PriorityLevel, TimeUnit } from "@/app/interfaces/item";
import { regex } from "regex";

const LETTER_TO_TIME_UNIT: { [key: string]: TimeUnit } = {
  d: TimeUnit.DAY,
  w: TimeUnit.WEEK,
  m: TimeUnit.MONTH,
  y: TimeUnit.YEAR,
};

export interface TimeInterval {
  quantity: number;
  unit: TimeUnit;
}

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

export const parseTimeInterval = (time_interval: string): TimeInterval => {
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
        quantity: quantity,
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

export const parseStringToDate = (dateString: string): Date => {
  // TODO
  return new Date(dateString);
};
