import { EffortType, Item, TimeUnit } from "@/app/interfaces/item";
import {
  BooleanItemField,
  BooleanMatcher,
  Comparator,
  DateField,
  DateMatcher,
  KeywordMatcher,
  QuantifiableItemField,
  QuantifierMatcher,
  Query,
  QueryComparableType,
  TimeRange,
} from "@/app/interfaces/query";
import {
  addIntervalToDate,
  clearTime,
  getNearestDueDateInclusive,
  getStartOfPreviousPeriod,
} from "../dates/date-util";
import { getItemCompletionStatus } from "../data/progress";
import { subMilliseconds } from "date-fns";

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
  date_matchers: [],
  creation_spec: "",
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
    case BooleanItemField.COMPLETED:
      meetsRequirement = getItemCompletionStatus(item, new Date()).is_completed;
      break;
    case BooleanItemField.RECURRING:
      meetsRequirement = Boolean(item.time_spec?.recurrence);
      break;
    case BooleanItemField.COMPLETION_BASED:
      meetsRequirement = item.effort_type === EffortType.COMPLETION;
      break;
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

const compareDateToTimeRange = (
  d: Date,
  timeRange: TimeRange,
  comparator: Comparator
) => {
  const startOfPeriod = clearTime(
    getStartOfPreviousPeriod(new Date(), timeRange.unit)
  );
  const endOfPeriodExclusive = clearTime(
    addIntervalToDate(startOfPeriod, timeRange)
  );
  const endOfPeriodInclusive = subMilliseconds(endOfPeriodExclusive, 1);
  switch (comparator) {
    case Comparator.EQ:
      return d >= startOfPeriod && d <= endOfPeriodInclusive;
    case Comparator.LTEQ:
      return d <= endOfPeriodInclusive;
    case Comparator.GTEQ:
      return d >= startOfPeriod;
    case Comparator.LT:
      return d < startOfPeriod;
    case Comparator.GT:
      return d > endOfPeriodInclusive;
  }
};

const doesItemMeetQuantifierMatcher = (
  item: Item,
  quantifierMatcher: QuantifierMatcher
) => {
  let comparisonLeftHand;
  switch (quantifierMatcher.field) {
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

const doesDateMeetDateMatcher = (date: Date, dueDateMatcher: DateMatcher) => {
  let timeRange;
  if (dueDateMatcher.date) {
    timeRange = {
      amount: 1,
      unit: TimeUnit.DAY,
    } as TimeRange;
  } else if (dueDateMatcher.time_range) {
    timeRange = dueDateMatcher.time_range;
  } else {
    return false;
  }
  return compareDateToTimeRange(date, timeRange, dueDateMatcher.comparator);
};

const doesItemMeetDateMatcher = (item: Item, dateMatcher: DateMatcher) => {
  let leftHandDate;
  switch (dateMatcher.field) {
    case DateField.DUE_DATE:
      leftHandDate = getNearestDueDateInclusive(item);
      break;
    case DateField.CREATION_DATE:
      leftHandDate = new Date(item.creation_timestamp);
      break;
  }
  if (!leftHandDate) {
    return false;
  }
  return doesDateMeetDateMatcher(leftHandDate, dateMatcher);
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
  for (const quantifierMatcher of query.quantifier_matchers) {
    if (!doesItemMeetQuantifierMatcher(item, quantifierMatcher)) {
      return false;
    }
  }
  for (const dueDateMatcher of query.date_matchers) {
    if (!doesItemMeetDateMatcher(item, dueDateMatcher)) {
      return false;
    }
  }
  return true;
};

export const filterItemsByQuery = (items: Item[], query: Query) =>
  items.filter((item) => itemMeetsQuery(item, query));
