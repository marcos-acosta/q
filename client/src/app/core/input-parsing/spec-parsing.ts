import { regex } from "regex";

export enum Field {
  ITEM_NAME,
  ITEM_PRIORITY,
  ITEM_TAGS,
  ITEM_DURATION,
  ITEM_IS_DURATION_BASED,
  ITEM_IS_HARD_DEADLINE,
  ITEM_TIMES,
  ITEM_INVERSE_FREQUENCY,
  ITEM_URGENCY,
  QUERY_KEYWORD,
  QUERY_TAGS,
  QUERY_ARCHIVED,
  QUERY_COMPLETED,
  QUERY_DUE_DATE,
  QUERY_RECURRING,
  QUERY_DURATION_BASED,
  QUERY_PRIORITY,
  QUERY_CREATION_DATE,
}

export const REGEX_VALUE_NAME = "value";
export const REGEX_ARG_NAME = "arg";
export const REGEX_NEGATION_NAME = "neg";

export const getFlagRegex = (
  code: string,
  isBoolean?: boolean,
  allowNegation?: boolean
) => {
  return isBoolean
    ? allowNegation
      ? regex("d")`(\s|^)(?<arg>-(?<neg>!)?${code})(\s|$)`
      : regex("d")`(\s|^)(?<arg>-${code})(\s|$)`
    : regex("d")`(\s|^)(?<arg>-${code}\s+(?<value>\S+))(\s|$)`;
};

export const getTagRegex = (allowNegation?: boolean) =>
  allowNegation
    ? regex("dg")`\s?(?<arg>(?<neg>!)?\#(?<value>\S+))\s?`
    : regex("dg")`\s?(?<arg>\#(?<value>\S+))\s?`;

export const getKeywordRegex = (allowNegation?: boolean) =>
  allowNegation
    ? regex("dg")`(?<!-\w)(\s|^)(?<arg>(?<neg>!)?(?<value>[^!\-\#\s]+))`
    : regex("dg")`(?<!-\w)(\s|^)(?<arg>(?<value>[^!\-\#\s]+))`;

const DEFAULT_ARG_INDEX = 1;

export interface SpecParser {
  field: Field;
  matcher: RegExp;
  value_parser?: (s: string) => any;
  is_global?: boolean;
}

export interface InterpretedSpecPart {
  field: Field;
  result?: {
    original_string: string;
    parsed_value: any;
    index_start_inclusive: number;
    index_end_exclusive: number;
    negated: boolean;
  };
  error?: string;
}

const applyParserToSpec = (
  inputSpec: string,
  parser: SpecParser
): InterpretedSpecPart[] => {
  let results = [] as InterpretedSpecPart[];
  const matchResults = parser.is_global
    ? [...inputSpec.matchAll(parser.matcher)]
    : [inputSpec.match(parser.matcher)];
  for (let matchResult of matchResults) {
    let interpretedPart = {
      field: parser.field,
    } as Partial<InterpretedSpecPart>;
    if (matchResult && matchResult.groups && matchResult.indices) {
      try {
        let parsedValue;
        if (!(REGEX_VALUE_NAME in matchResult.groups)) {
          parsedValue = true;
        } else {
          let rawValue = matchResult.groups[REGEX_VALUE_NAME];
          parsedValue = parser.value_parser
            ? parser.value_parser(rawValue)
            : rawValue;
        }
        interpretedPart.result = {
          original_string: matchResult.groups[REGEX_ARG_NAME],
          parsed_value: parsedValue,
          index_start_inclusive: matchResult.indices[DEFAULT_ARG_INDEX][0],
          index_end_exclusive: matchResult.indices[DEFAULT_ARG_INDEX][1],
          negated: Boolean(
            REGEX_NEGATION_NAME in matchResult.groups &&
              matchResult.groups[REGEX_NEGATION_NAME]
          ),
        };
      } catch (e) {
        interpretedPart.error = `Could not parse "${matchResult.groups[REGEX_ARG_NAME]}"`;
      }
      results.push(interpretedPart as InterpretedSpecPart);
    }
  }
  return results;
};

export const splitInputSpecIntoParts = (
  inputSpec: string,
  parsers: SpecParser[]
): InterpretedSpecPart[] => {
  let parsedParts = [] as InterpretedSpecPart[];
  parsers.forEach((parser) => {
    parsedParts = [...parsedParts, ...applyParserToSpec(inputSpec, parser)];
  });
  return parsedParts;
};

export interface ParseResult<T> {
  partial_result?: Partial<T>;
  input_spec_parts: InterpretedSpecPart[];
  any_error: boolean;
}
