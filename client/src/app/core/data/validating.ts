import {
  Item,
  ItemSchema,
  PriorityLevel,
  TimeUnit,
} from "@/app/interfaces/item";
import { regex } from "regex";
import { NamedQuery, NamedQuerySchema } from "@/app/interfaces/query";

export const parseListAsItems = (raw_item_data: any): Item[] => {
  if (!Array.isArray(raw_item_data)) {
    return [];
  }
  let response = [] as Item[];
  raw_item_data.forEach((raw_item: any) => {
    try {
      const parsed_item: Item = ItemSchema.parse(raw_item);
      response.push(parsed_item);
    } catch (e) {
      console.log(e);
    }
  });
  return response;
};

export const parseListAsNamedQueries = (
  raw_named_queries: any
): NamedQuery[] => {
  if (!Array.isArray(raw_named_queries)) {
    return [];
  }
  let response = [] as NamedQuery[];
  raw_named_queries.forEach((raw_named_query: any) => {
    try {
      const parsed_query: NamedQuery = NamedQuerySchema.parse(raw_named_query);
      response.push(parsed_query);
    } catch (e) {
      console.log(e);
    }
  });
  return response;
};
