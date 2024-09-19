import { Item } from "@/app/interfaces/item";
import { regex } from "regex";
import { parsePriority } from "./parsing-util";

enum Field {
  ITEM_NAME,
  ITEM_PRIORITY,
  ITEM_RECURRENCE,
  ITEM_TAG,
  // TODO... add rest
}

const regex_d = regex("d");

const REGEX_VALUE_NAME = "value";
const REGEX_ARG_NAME = "arg";
const getFlagRegex = (code: string, isBoolean?: boolean) => {
  return isBoolean
    ? regex_d`(\s|^)(?<arg>-${code})(\s|$)`
    : regex_d`(\s|^)(?<arg>-${code}\s+(?<value>\S+))(\s|$)`;
};
const nameRegex = regex_d`^(?<arg>(?<value>[^\-\#]+))(\s|$)`;

interface SpecParser {
  field: Field;
  matcher: RegExp;
  value_parser?: (s: string) => string | number | Date;
}

interface InterpretedItemSpecPart {
  field: Field;
  result?: {
    original_string: string;
    parsed_value: string | number | Date;
    index_start_inclusive: number;
    index_end_exclusive: number;
  };
  error?: string;
}

const applyParserToSpec = (
  inputSpec: string,
  parser: SpecParser
): InterpretedItemSpecPart[] => {
  let results = [] as InterpretedItemSpecPart[];
  let interpretedPart = {
    field: parser.field,
  } as Partial<InterpretedItemSpecPart>;
  const matchResult = inputSpec.match(parser.matcher);
  if (matchResult && matchResult.groups && matchResult.indices) {
    try {
      const rawValue = matchResult.groups[REGEX_VALUE_NAME];
      const parsedValue = parser.value_parser
        ? parser.value_parser(rawValue)
        : rawValue;
      interpretedPart.result = {
        original_string: matchResult.groups[REGEX_ARG_NAME],
        parsed_value: parsedValue,
        index_start_inclusive: matchResult.indices[1][0],
        index_end_exclusive: matchResult.indices[1][1],
      };
    } catch (e) {
      interpretedPart.error = `Could not parse "${matchResult.groups[REGEX_ARG_NAME]}."`;
    }
  }
  results.push(interpretedPart as InterpretedItemSpecPart);
  return results;
};

const splitInputSpecIntoParts = (
  inputSpec: string,
  parsers: SpecParser[]
): InterpretedItemSpecPart[] => {
  let parsedParts = [] as InterpretedItemSpecPart[];
  parsers.forEach((parser) => {
    parsedParts = [...parsedParts, ...applyParserToSpec(inputSpec, parser)];
  });
  console.log(parsedParts);
  return parsedParts;
};

export interface ParseResult<T> {
  partial_item?: Partial<T>;
  input_spec_parts: InterpretedItemSpecPart[];
}

// NON-ITEM SPECIFIC

const assembleItemFromParts = (
  parts: InterpretedItemSpecPart[]
): ParseResult<Item> => {
  let partialItem = {} as Partial<Item>;
  const interpretedParts = parts.map((part) => {
    let newPart = part;
    if (!newPart.error && newPart.result) {
      switch (newPart.field) {
        case Field.ITEM_NAME:
          partialItem.name = newPart.result.parsed_value as string;
          break;
        case Field.ITEM_PRIORITY:
          try {
            partialItem.priority = parsePriority(
              newPart.result.parsed_value as number
            );
          } catch (e) {
            newPart.error = `Could not interpret ${newPart.result.parsed_value} as a priority.`;
          }
          break;
      }
    }
    return newPart;
  });
  return {
    partial_item: partialItem,
    input_spec_parts: interpretedParts,
  };
};

const ITEM_PARSERS: SpecParser[] = [
  {
    field: Field.ITEM_NAME,
    matcher: nameRegex,
  },
  {
    field: Field.ITEM_PRIORITY,
    matcher: getFlagRegex("p"),
    value_parser: (s: string) => parseInt(s),
  },
];

export const parseItemInputSpec = (inputSpec: string): ParseResult<Item> => {
  const itemSpecParts = splitInputSpecIntoParts(inputSpec, ITEM_PARSERS);
  return assembleItemFromParts(itemSpecParts);
};
