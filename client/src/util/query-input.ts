import {
  BooleanItemField,
  Query,
  QuerySchema,
  KeywordMatcher,
} from "@/interfaces/query";
import { regex } from "regex";

const KEYWORD_PATTERN = regex(
  "g"
)`(\s|^)(?<neg>!?)(?<keyword>[^\s\#\-]+)(\s|$)`;
const TAG_PATTERN = regex("g")`(\s|^)(?<neg>!?)\#(?<keyword>[^\s]+)(\s|$)`;

const isFlagPresent = (input: string, flag: string) => {
  const matcher = regex`-${flag}\b`;
  return Boolean(input.match(matcher));
};

const getKeywords = (input: string, pattern: RegExp) => {
  const matches = input.matchAll(pattern);
  let keywords = [] as KeywordMatcher[];
  for (const match of matches) {
    if (match.groups && match.groups["keyword"]) {
      const keyword = match.groups["keyword"];
      const negative = Boolean(match.groups["neg"].length);
      keywords.push({ keyword: keyword, negated: negative });
    }
  }
  return keywords;
};

export const parseInputToQuery = (input: string): Query | undefined => {
  let partialQuery = {} as Partial<Query>;
  // Filter out archived by default
  if (!isFlagPresent(input, "a")) {
    partialQuery.boolean_matchers = [
      ...(partialQuery.boolean_matchers || []),
      { field: BooleanItemField.ARCHIVED, negated: true },
    ];
  }
  partialQuery.tag_matchers = getKeywords(input, TAG_PATTERN);
  partialQuery.keywords = getKeywords(input, KEYWORD_PATTERN);
  console.log(partialQuery);
  try {
    return QuerySchema.parse(partialQuery);
  } catch (e) {
    console.log(e);
    return undefined;
  }
};
