import { Item, ItemSchema, PriorityLevel, TimeUnit } from "@/interfaces/item";
import { regex } from "regex";
import { formatDateIso } from "./dates";
import { NamedQuery, NamedQuerySchema } from "@/interfaces/query";

const LETTER_TO_TIME_UNIT: { [key: string]: TimeUnit } = {
  d: TimeUnit.DAY,
  w: TimeUnit.WEEK,
  m: TimeUnit.MONTH,
  y: TimeUnit.YEAR,
};

const MONTHS_3_LETTERS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export interface TimeInterval {
  quantity: number;
  unit: TimeUnit;
}

export const parseListAsItems = (raw_item_data: any): Item[] => {
  if (!Array.isArray(raw_item_data)) {
    return [];
  }
  let response = [] as Item[];
  raw_item_data.forEach((raw_item: any) => {
    try {
      const parsed_item: Item = ItemSchema.parse(raw_item);
      response.push(parsed_item);
    } catch (e) {
      console.log(e);
    }
  });
  return response;
};

export const parseListAsNamedQueries = (
  raw_named_queries: any
): NamedQuery[] => {
  if (!Array.isArray(raw_named_queries)) {
    return [];
  }
  let response = [] as NamedQuery[];
  raw_named_queries.forEach((raw_named_query: any) => {
    try {
      const parsed_query: NamedQuery = NamedQuerySchema.parse(raw_named_query);
      response.push(parsed_query);
    } catch (e) {
      console.log(e);
    }
  });
  return response;
};

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

export const parsePriority = (priority_string: string): PriorityLevel => {
  const priority = parseInt(priority_string);
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

export const parseDateToIso = (date_string: string): string => {
  let full_date_string = "";
  if (date_string.match(regex`\d{4}-\d{2}-\d{2}`)) {
    full_date_string = date_string;
  } else if (date_string.match(regex`\d{2}-\d{2}`)) {
    const [month, day] = date_string.split("-");
    let now = new Date();
    now.setMonth(parseInt(month) - 1);
    now.setDate(parseInt(day));
    if (now < new Date()) {
      now.setFullYear(now.getFullYear() + 1);
    }
    full_date_string = formatDateIso(now);
  } else if (date_string.match(regex`\w{3}-\d{1,2}`)) {
    const [month, day] = date_string.split("-");
    const month_index = MONTHS_3_LETTERS.indexOf(month);
    if (month_index === -1) {
      throw Error(`Unrecognized month: ${month}`);
    }
    let now = new Date();
    now.setMonth(month_index);
    now.setDate(parseInt(day));
    if (now < new Date()) {
      now.setFullYear(now.getFullYear() + 1);
    }
    full_date_string = formatDateIso(now);
  } else {
    throw Error(`Could not parse date: ${date_string}`);
  }
  if (isNaN(new Date(full_date_string) as any)) {
    throw Error(`Could not treat ${full_date_string} as a valid date.`);
  }
  return full_date_string;
};
