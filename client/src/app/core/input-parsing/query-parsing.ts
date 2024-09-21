import { parseDatesToMatchers, parsePriorityToMatcher } from "./parsing-util";
import {
  Field,
  getFlagRegex,
  getKeywordRegex,
  getTagRegex,
  InterpretedSpecPart,
  ParseResult,
  SpecParser,
  splitInputSpecIntoParts,
} from "./spec-parsing";
import {
  BooleanItemField,
  BooleanMatcher,
  DateField,
  DateMatcher,
  KeywordMatcher,
  QuantifierMatcher,
  Query,
} from "@/app/interfaces/query";

const addBooleanMatcherToPartialQuery = (
  pq: Partial<Query>,
  booleanMatcher: BooleanMatcher
) => {
  pq.boolean_matchers = [...(pq.boolean_matchers || []), booleanMatcher];
  return pq;
};

const addKeywordMatcherToPartialQuery = (
  pq: Partial<Query>,
  keywordMatcher: KeywordMatcher
) => {
  pq.keywords = [...(pq.keywords || []), keywordMatcher];
  return pq;
};

const addTagMatcherToPartialQuery = (
  pq: Partial<Query>,
  tagMatcher: KeywordMatcher
) => {
  pq.tag_matchers = [...(pq.tag_matchers || []), tagMatcher];
  return pq;
};

const addDateMatchersToPartialQuery = (
  pq: Partial<Query>,
  dateMatchers: DateMatcher[]
) => {
  pq.date_matchers = [...(pq.date_matchers || []), ...dateMatchers];
  return pq;
};

const addQuantifierMatcherToPartialQuery = (
  pq: Partial<Query>,
  quantifierMatcher: QuantifierMatcher
) => {
  pq.quantifier_matchers = [
    ...(pq.quantifier_matchers || []),
    quantifierMatcher,
  ];
  return pq;
};

const assembleQueryFromParts = (
  parts: InterpretedSpecPart[]
): ParseResult<Query> => {
  let partialQuery = {} as Partial<Query>;
  let allowArchived = false;
  const interpretedParts = parts.map((part) => {
    let newPart = part;
    if (!newPart.error && newPart.result) {
      const parsedValue = newPart.result.parsed_value;
      switch (newPart.field) {
        case Field.QUERY_KEYWORD:
          addKeywordMatcherToPartialQuery(partialQuery, {
            keyword: parsedValue as string,
            negated: newPart.result.negated,
          });
          break;
        case Field.QUERY_TAGS:
          addTagMatcherToPartialQuery(partialQuery, {
            keyword: parsedValue as string,
            negated: newPart.result.negated,
          });
          break;
        case Field.QUERY_ARCHIVED:
          allowArchived = true;
          break;
        case Field.QUERY_COMPLETED:
          addBooleanMatcherToPartialQuery(partialQuery, {
            negated: newPart.result.negated,
            field: BooleanItemField.COMPLETED,
          });
          break;
        case Field.QUERY_DUE_DATE:
        case Field.QUERY_CREATION_DATE:
          addDateMatchersToPartialQuery(
            partialQuery,
            parsedValue as DateMatcher[]
          );
          break;
        case Field.QUERY_RECURRING:
          addBooleanMatcherToPartialQuery(partialQuery, {
            negated: newPart.result.negated,
            field: BooleanItemField.RECURRING,
          });
          break;
        case Field.QUERY_DURATION_BASED:
          addBooleanMatcherToPartialQuery(partialQuery, {
            negated: newPart.result.negated,
            field: BooleanItemField.DURATION_BASED,
          });
          break;
        case Field.QUERY_PRIORITY:
          addQuantifierMatcherToPartialQuery(
            partialQuery,
            parsedValue as QuantifierMatcher
          );
          break;
      }
    }
    return newPart;
  });
  // If -a is not specified, filter out archived tasks by default.
  if (!allowArchived) {
    addBooleanMatcherToPartialQuery(partialQuery, {
      negated: true,
      field: BooleanItemField.ARCHIVED,
    });
  }
  return {
    partial_result: partialQuery,
    input_spec_parts: interpretedParts,
    any_error: interpretedParts.some((part) => part.error),
  };
};

const QUERY_PARSERS: SpecParser[] = [
  {
    field: Field.QUERY_KEYWORD,
    matcher: getKeywordRegex(true),
    is_global: true,
  },
  {
    field: Field.QUERY_TAGS,
    matcher: getTagRegex(true),
    is_global: true,
  },
  {
    field: Field.QUERY_ARCHIVED,
    matcher: getFlagRegex("a", true, false),
  },
  {
    field: Field.QUERY_COMPLETED,
    matcher: getFlagRegex("c", true, true),
  },
  {
    field: Field.QUERY_RECURRING,
    matcher: getFlagRegex("r", true, true),
  },
  {
    field: Field.QUERY_DUE_DATE,
    matcher: getFlagRegex("u", false, false),
    value_parser: (s: string) => parseDatesToMatchers(s, DateField.DUE_DATE),
  },
  {
    field: Field.QUERY_DURATION_BASED,
    matcher: getFlagRegex("d", true, true),
  },
  {
    field: Field.QUERY_PRIORITY,
    matcher: getFlagRegex("p", false, false),
    value_parser: parsePriorityToMatcher,
  },
  {
    field: Field.QUERY_CREATION_DATE,
    matcher: getFlagRegex("o", false, false),
    value_parser: (s: string) =>
      parseDatesToMatchers(s, DateField.CREATION_DATE),
  },
];

export const parseQueryInputSpec = (inputSpec: string): ParseResult<Query> => {
  const querySpecParts = splitInputSpecIntoParts(inputSpec, QUERY_PARSERS);
  return assembleQueryFromParts(querySpecParts);
};
