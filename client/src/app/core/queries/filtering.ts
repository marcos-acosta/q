import { Item } from "@/app/interfaces/item";
import {
  BooleanItemField,
  BooleanMatcher,
  Comparator,
  KeywordMatcher,
  QuantifiableItemField,
  QuantifierMatcher,
  Query,
  QueryComparableType,
} from "@/app/interfaces/query";
import { getNearestDueDateInclusive } from "../dates/date-util";

export const DEFAULT_QUERY: Query = {
  keywords: [],
  boolean_matchers: [
    {
      field: BooleanItemField.ARCHIVED,
      negated: true,
    },
  ],
  quantifier_matchers: [],
  tag_matchers: [],
};

const considerNegation = (meetsRequirement: boolean, negated: boolean) =>
  meetsRequirement !== negated;

const doesItemMeetKeywordRequirement = (
  item: Item,
  keyword: KeywordMatcher
) => {
  const itemNameHasKeyword = item.name
    .toLowerCase()
    .includes(keyword.keyword.toLowerCase());
  return considerNegation(itemNameHasKeyword, keyword.negated);
};

const doesItemMeetTagRequirement = (item: Item, tagMatcher: KeywordMatcher) => {
  const itemHasTag = item.tags.includes(tagMatcher.keyword);
  return considerNegation(itemHasTag, tagMatcher.negated);
};

const doesItemMeetBooleanRequirement = (
  item: Item,
  booleanMatcher: BooleanMatcher
) => {
  let meetsRequirement = false;
  switch (booleanMatcher.field) {
    case BooleanItemField.ARCHIVED:
      meetsRequirement = item.is_archived;
      break;
    default:
      meetsRequirement = false;
  }
  return considerNegation(meetsRequirement, booleanMatcher.negated);
};

const compareValues = (
  a: QueryComparableType,
  b: QueryComparableType,
  comparator: Comparator
) => {
  if (typeof a !== typeof b) {
    return false;
  }
  switch (comparator) {
    case Comparator.EQ:
      return a === b;
    case Comparator.LTEQ:
      return a <= b;
    case Comparator.GTEQ:
      return a >= b;
    case Comparator.LT:
      return a < b;
    case Comparator.GT:
      return a > b;
  }
};

const doesItemMeetQuantifierMatcher = (
  item: Item,
  quantifierMatcher: QuantifierMatcher
) => {
  let comparisonLeftHand;
  switch (quantifierMatcher.field) {
    case QuantifiableItemField.CREATION_DATE:
      comparisonLeftHand = new Date(item.creation_timestamp);
      break;
    case QuantifiableItemField.DUE_DATE:
      const nearestDueDate = getNearestDueDateInclusive(item);
      if (!nearestDueDate) {
        return false;
      } else {
        comparisonLeftHand = nearestDueDate;
      }
      break;
    case QuantifiableItemField.PRIORITY:
      comparisonLeftHand = item.priority;
      break;
  }
  return compareValues(
    comparisonLeftHand,
    quantifierMatcher.comparison_value,
    quantifierMatcher.comparator
  );
};

export const itemMeetsQuery = (item: Item, query: Query) => {
  for (const keyword of query.keywords) {
    if (!doesItemMeetKeywordRequirement(item, keyword)) {
      return false;
    }
  }
  for (const booleanMatcher of query.boolean_matchers) {
    if (!doesItemMeetBooleanRequirement(item, booleanMatcher)) {
      return false;
    }
  }
  for (const tagMatcher of query.tag_matchers) {
    if (!doesItemMeetTagRequirement(item, tagMatcher)) {
      return false;
    }
  }
  for (const quantifier_matcher of query.quantifier_matchers) {
    if (!doesItemMeetQuantifierMatcher(item, quantifier_matcher)) {
      return false;
    }
  }
  return true;
};

export const filterItemsByQuery = (items: Item[], query: Query) =>
  items.filter((item) => itemMeetsQuery(item, query));
