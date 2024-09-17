import { Item } from "@/interfaces/item";
import {
  BooleanItemField,
  Comparator,
  QuantifiableItemField,
  Query,
} from "@/interfaces/query";
import { formatDateIso } from "./dates";
import { getNearestDueDate } from "./item-util";

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

export const itemMeetsQuery = (item: Item, query: Query) => {
  for (const keyword of query.keywords) {
    const item_name_has_keyword = item.name
      .toLowerCase()
      .includes(keyword.keyword.toLowerCase());
    if (
      (item_name_has_keyword && keyword.negated) ||
      (!item_name_has_keyword && !keyword.negated)
    ) {
      return false;
    }
  }
  for (const boolean_matcher of query.boolean_matchers) {
    if (boolean_matcher.field === BooleanItemField.ARCHIVED) {
      if (
        (item.is_archived && boolean_matcher.negated) ||
        (!item.is_archived && !boolean_matcher.negated)
      ) {
        return false;
      }
    }
  }
  for (const tag_matcher of query.tag_matchers) {
    const item_has_tag = item.tags.includes(tag_matcher.keyword);
    if (
      (item_has_tag && tag_matcher.negated) ||
      (!item_has_tag && !tag_matcher.negated)
    ) {
      return false;
    }
  }
  for (const quantifier_matcher of query.quantifier_matchers) {
    if (quantifier_matcher.field === QuantifiableItemField.PRIORITY) {
      return false;
    } else {
      let comparison = "";
      if (quantifier_matcher.field === QuantifiableItemField.DUE_DATE) {
        const nearestDueDate = getNearestDueDate(item);
        if (!nearestDueDate) {
          return false;
        } else {
          comparison = nearestDueDate;
        }
      } else if (
        quantifier_matcher.field === QuantifiableItemField.CREATION_DATE
      ) {
        comparison = formatDateIso(new Date(item.creation_timestamp));
      }
      switch (quantifier_matcher.comparator) {
        case Comparator.EQ:
          return comparison === quantifier_matcher.comparison_value;
        case Comparator.LTEQ:
          return comparison <= quantifier_matcher.comparison_value;
        case Comparator.GTEQ:
          return comparison >= quantifier_matcher.comparison_value;
        case Comparator.LT:
          return comparison < quantifier_matcher.comparison_value;
        case Comparator.GT:
          return comparison > quantifier_matcher.comparison_value;
      }
    }
  }
  return true;
};

export const filterItemsByQuery = (items: Item[], query: Query) =>
  items.filter((item) => itemMeetsQuery(item, query));
