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
  KeywordMatcher,
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
            keyword: parsedValue,
            negated: newPart.result.negated,
          });
          break;
        case Field.QUERY_TAGS:
          addTagMatcherToPartialQuery(partialQuery, {
            keyword: parsedValue,
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
    field: Field.QUERY_DUE_DATE,
    matcher: getFlagRegex("d", false, false),
    value_parser: (s: string) => s,
  },
];

export const parseQueryInputSpec = (inputSpec: string): ParseResult<Query> => {
  const querySpecParts = splitInputSpecIntoParts(inputSpec, QUERY_PARSERS);
  return assembleQueryFromParts(querySpecParts);
};
