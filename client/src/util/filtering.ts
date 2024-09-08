import { Item } from "@/interfaces/item";
import { BooleanItemField, Query } from "@/interfaces/query";

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
  return true;
};

export const filterItemsByQuery = (items: Item[], query: Query) =>
  items.filter((item) => itemMeetsQuery(item, query));
