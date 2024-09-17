import {
  BooleanItemField,
  Query,
  QuerySchema,
  KeywordMatcher,
  QuantifierMatcher,
  QuantifiableItemField,
  Comparator,
  QuantifierMatcherSchema,
} from "@/interfaces/query";
import { regex } from "regex";
import { parseDateToIso } from "./parsing";

const KEYWORD_PATTERN = regex(
  "g"
)`(\s|^)(?<neg>!?)(?<keyword>[^\s\#\-]+)(\s|$)`;
const TAG_PATTERN = regex("g")`(\s|^)(?<neg>!?)\#(?<keyword>\S+)(\s|$)`;
const DUE_DATE_PATTERN = regex`(\s|^)-d\s(?<body>\S+)(\s|$)`;

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

function getFlagBody<T>(
  input: string,
  pattern: RegExp,
  parser: (s: string) => T | null
): T | null {
  const matches = input.match(pattern);
  if (matches?.groups && matches.groups["body"]) {
    return parser(matches.groups["body"]);
  }
  return null;
}

const parseDueDate = (dueDateExpression: string): QuantifierMatcher | null => {
  const quantifierMatcher: Partial<QuantifierMatcher> = {
    field: QuantifiableItemField.DUE_DATE,
  };
  let remainingDueDate = dueDateExpression;
  if (dueDateExpression.startsWith("<")) {
    if (dueDateExpression.startsWith("<=")) {
      quantifierMatcher.comparator = Comparator.LTEQ;
      remainingDueDate = dueDateExpression.slice(2);
    } else {
      quantifierMatcher.comparator = Comparator.LT;
      remainingDueDate = dueDateExpression.slice(1);
    }
  } else if (dueDateExpression.startsWith(">")) {
    if (dueDateExpression.startsWith(">=")) {
      quantifierMatcher.comparator = Comparator.GTEQ;
      remainingDueDate = dueDateExpression.slice(2);
    } else {
      quantifierMatcher.comparator = Comparator.GT;
      remainingDueDate = dueDateExpression.slice(1);
    }
  } else {
    quantifierMatcher.comparator = Comparator.EQ;
  }
  try {
    const dateIso = parseDateToIso(remainingDueDate);
    quantifierMatcher.comparison_value = dateIso;
    return QuantifierMatcherSchema.parse(quantifierMatcher);
  } catch (e) {
    return null;
  }
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
  partialQuery.quantifier_matchers = [
    getFlagBody<QuantifierMatcher>(input, DUE_DATE_PATTERN, parseDueDate),
  ].filter(Boolean) as QuantifierMatcher[];

  try {
    return QuerySchema.parse(partialQuery);
  } catch (e) {
    console.log(e);
    return undefined;
  }
};
