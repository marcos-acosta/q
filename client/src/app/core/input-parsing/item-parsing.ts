import { EffortType, Item, PriorityLevel } from "@/app/interfaces/item";
import { regex } from "regex";
import {
  parsePriorityFromString,
  parseStringToDate,
  parseTimeDurationToMinutes,
  parseTimeInterval,
  TimeInterval,
} from "./parsing-util";
import {
  Field,
  getFlagRegex,
  getTagRegex,
  InterpretedSpecPart,
  ParseResult,
  SpecParser,
  splitInputSpecIntoParts,
} from "./spec-parsing";

const NAME_REGEX = regex("d")`^(?<arg>(?<value>[^\-\#]+))(\s|$)`;

const assembleItemFromParts = (
  parts: InterpretedSpecPart[]
): ParseResult<Item> => {
  let partialItem = {} as Partial<Item>;
  let durationMinutes = undefined as number | undefined;
  let isHardDeadline = false;
  let dueDate = undefined as Date | undefined;
  const interpretedParts = parts.map((part) => {
    let newPart = part;
    if (!newPart.error && newPart.result) {
      const parsedValue = newPart.result.parsed_value;
      switch (newPart.field) {
        case Field.ITEM_NAME:
          partialItem.name = parsedValue as string;
          break;
        case Field.ITEM_PRIORITY:
          partialItem.priority = parsedValue as PriorityLevel;
          break;
        case Field.ITEM_TAGS:
          partialItem.tags = [
            ...(partialItem.tags || []),
            parsedValue as string,
          ];
          break;
        case Field.ITEM_IS_DURATION_BASED:
          partialItem.effort_type = EffortType.DURATION;
          break;
        case Field.ITEM_DURATION:
          durationMinutes = parsedValue as number;
          break;
        case Field.ITEM_IS_HARD_DEADLINE:
          isHardDeadline = true;
          break;
        case Field.ITEM_URGENCY:
          dueDate = parsedValue as Date;
          break;
        case Field.ITEM_TIMES:
          partialItem.time_spec = {
            ...partialItem.time_spec,
            required_number_of_completions: parsedValue as number,
          };
          break;
        case Field.ITEM_INVERSE_FREQUENCY:
          partialItem.time_spec = {
            ...partialItem.time_spec,
            recurrence: {
              ...partialItem.time_spec?.recurrence,
              inverse_frequency: (parsedValue as TimeInterval).quantity,
              unit: (parsedValue as TimeInterval).unit,
              start_date: new Date(),
            },
          };
          break;
      }
    }
    return newPart;
  });
  if (!partialItem.effort_type) {
    partialItem.effort_type = EffortType.COMPLETION;
  }
  switch (partialItem.effort_type) {
    case EffortType.COMPLETION:
      partialItem.time_spec = {
        ...partialItem.time_spec,
        estimated_time_effort_minutes: durationMinutes,
      };
      break;
    case EffortType.DURATION:
      partialItem.time_spec = {
        ...partialItem.time_spec,
        required_time_effort_minutes: durationMinutes,
      };
      break;
  }
  if (dueDate) {
    partialItem.time_spec = {
      ...partialItem.time_spec,
      urgency: {
        ...partialItem.time_spec?.urgency,
        expected_completion_date: isHardDeadline ? undefined : dueDate,
        hard_deadline: isHardDeadline ? dueDate : undefined,
      },
    };
  }
  return {
    partial_result: partialItem,
    input_spec_parts: interpretedParts,
    any_error: interpretedParts.some((part) => part.error),
  };
};

const ITEM_PARSERS: SpecParser[] = [
  {
    field: Field.ITEM_NAME,
    matcher: NAME_REGEX,
  },
  {
    field: Field.ITEM_PRIORITY,
    matcher: getFlagRegex("p"),
    value_parser: parsePriorityFromString,
  },
  {
    field: Field.ITEM_TAGS,
    matcher: getTagRegex(false),
    is_global: true,
  },
  {
    field: Field.ITEM_IS_DURATION_BASED,
    matcher: getFlagRegex("d", true),
  },
  {
    field: Field.ITEM_DURATION,
    matcher: getFlagRegex("t"),
    value_parser: parseTimeDurationToMinutes,
  },
  {
    field: Field.ITEM_IS_HARD_DEADLINE,
    matcher: getFlagRegex("h", true),
  },
  {
    field: Field.ITEM_TIMES,
    matcher: getFlagRegex("x"),
    value_parser: parseInt,
  },
  {
    field: Field.ITEM_INVERSE_FREQUENCY,
    matcher: getFlagRegex("e"),
    value_parser: parseTimeInterval,
  },
  {
    field: Field.ITEM_URGENCY,
    matcher: getFlagRegex("u"),
    value_parser: parseStringToDate,
  },
];

export const parseItemInputSpec = (inputSpec: string): ParseResult<Item> => {
  const itemSpecParts = splitInputSpecIntoParts(inputSpec, ITEM_PARSERS);
  return assembleItemFromParts(itemSpecParts);
};
