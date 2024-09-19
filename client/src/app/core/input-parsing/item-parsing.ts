import {
  EffortType,
  Item,
  ItemSchema,
  PriorityLevel,
} from "@/app/interfaces/item";
import { regex } from "regex";
import { v4 as uuidv4 } from "uuid";
import {
  addIntervalToDate,
  getStartOfPreviousPeriod,
} from "../dates/date-util";
import {
  parsePriority,
  parsePriorityFromString,
  parseStringToDate,
  parseTimeDurationToMinutes,
  parseTimeInterval,
  TimeInterval,
} from "./parsing-util";

const regex_no_x = regex({
  disable: { x: true },
});
const regex_g_no_x = regex({ flags: "g", disable: { x: true } });

const TASK_NAME_PATTERN = regex_no_x`^(?<name>.+?)($|( [\-#]))`;
const DURATION_PATTERN = regex_no_x` -t (?<duration_minutes>(\d)+[hm])\b`;
const TIMES_PATTERN = regex_no_x` -x (?<times>(\d)+)\b`;
const RECURRENCE_PATTERN = regex_no_x` -e (?<recurrence>(\d)*[dwmy])\b`;
const URGENCY_PATTERN = regex_no_x` -u (?<urgency>(\d)*[dwmy])\b`;
const HARD_DEADLINE_PATTERN = regex_no_x` -h (?<hard_deadline>[0-9a-zA-Z\-]+)\b`;
const PRIORITY_PATTERN = regex_no_x` -p(?<priority>[0-4])\b`;
const TAG_PATTERN = regex_g_no_x` #(?<tag>[^\s]+)\b`;
const DURATION_BASED_FLAG = regex_no_x` -d\b`;
const GOAL_FLAG = regex_no_x` -g\b`;

const matchItemInputPart = (
  item_spec: string,
  pattern: RegExp,
  parser?: (a: string) => any,
  group_name?: string
) => {
  const matches = item_spec.match(pattern);
  let response;
  if (parser && group_name) {
    if (matches?.groups && matches.groups[group_name]) {
      response = parser(matches.groups[group_name]);
    }
  } else {
    return Boolean(matches);
  }
  return response;
};

const matchTags = (item_spec: string): string[] => {
  const matches = item_spec.matchAll(TAG_PATTERN);
  let tags = [];
  for (const match of matches) {
    if (match.groups && match.groups["tag"]) {
      tags.push(match.groups["tag"]);
    }
  }
  return tags;
};

const constructPartialItemFromResults = (
  results: {
    [a: string]: any;
  },
  spec: string
): Partial<Item> => {
  const recurrence = results["recurrence"] as undefined | TimeInterval;
  const urgency = results["urgency"] as undefined | TimeInterval;
  const duration_minutes = results["duration_minutes"] as undefined | number;
  const times = results["times"] as undefined | number;
  const priority = results["priority"] as undefined | PriorityLevel;
  const is_duration_effort = results["is_duration_based"];
  const hard_deadline = results["hard_deadline"];
  const expected_completion_date =
    urgency &&
    addIntervalToDate(
      getStartOfPreviousPeriod(new Date(), urgency.unit),
      urgency
    );
  const urgency_exists = expected_completion_date || hard_deadline;
  let item: Partial<Item> = {
    name: results["name"],
    id: uuidv4(),
    creation_timestamp: Date.now(),
    creation_spec: spec,
    effort_type: is_duration_effort
      ? EffortType.DURATION
      : EffortType.COMPLETION,
    dependency_ids: [],
    dependent_ids: [],
    time_spec: {
      recurrence: recurrence
        ? {
            inverse_frequency: recurrence.quantity,
            unit: recurrence.unit,
            start_date: getStartOfPreviousPeriod(new Date(), recurrence.unit),
          }
        : undefined,
      urgency: urgency_exists
        ? {
            expected_completion_date: expected_completion_date,
            hard_deadline: hard_deadline,
          }
        : undefined,
      required_time_effort_minutes: is_duration_effort
        ? duration_minutes
        : undefined,
      estimated_time_effort_minutes: is_duration_effort
        ? undefined
        : duration_minutes,
      required_number_of_completions: is_duration_effort
        ? undefined
        : times
        ? times
        : 1,
    },
    tags: results["tags"],
    is_goal: results["is_goal"],
    priority: priority,
  };
  return item;
};

export const parseItemInput = (item_spec: string): Item => {
  const parsers: Array<[RegExp, ((a: string) => any) | undefined, string]> = [
    [TASK_NAME_PATTERN, (x: string) => x, "name"],
    [DURATION_PATTERN, parseTimeDurationToMinutes, "duration_minutes"],
    [RECURRENCE_PATTERN, parseTimeInterval, "recurrence"],
    [URGENCY_PATTERN, parseTimeInterval, "urgency"],
    [TIMES_PATTERN, parseInt, "times"],
    [PRIORITY_PATTERN, parsePriorityFromString, "priority"],
    [HARD_DEADLINE_PATTERN, parseStringToDate, "hard_deadline"],
    [DURATION_BASED_FLAG, undefined, "is_duration_based"],
    [GOAL_FLAG, undefined, "is_goal"],
  ];

  const parseResults: { [key: string]: any } = {};
  parsers.forEach(([pattern, parser, group_name]) => {
    try {
      const res = matchItemInputPart(item_spec, pattern, parser, group_name);
      parseResults[group_name] = res;
    } catch (e) {
      console.log(e);
      throw e;
    }
  });
  parseResults["tags"] = matchTags(item_spec);
  const partialItem = constructPartialItemFromResults(parseResults, item_spec);
  return ItemSchema.parse(partialItem);
};
