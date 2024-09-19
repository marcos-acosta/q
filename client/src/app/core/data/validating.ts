import { Item, ItemSchema } from "@/app/interfaces/item";
import { NamedQuery, NamedQuerySchema } from "@/app/interfaces/query";

function parseListAs<T>(rawData: any, parseFn: (a: any) => T): T[] {
  if (!Array.isArray(rawData)) {
    return [];
  }
  let response = [] as T[];
  rawData.forEach((rawElement: any) => {
    try {
      const parsedElement = parseFn(rawElement);
      response.push(parsedElement);
    } catch (e) {
      console.log(e);
    }
  });
  return response;
}

export const parseListAsItems = (rawItemData: any): Item[] => {
  return parseListAs<Item>(rawItemData, (i: any) => ItemSchema.parse(i));
};

export const parseListAsNamedQueries = (rawQueryData: any): NamedQuery[] => {
  return parseListAs<NamedQuery>(rawQueryData, (nq: any) =>
    NamedQuerySchema.parse(nq)
  );
};
