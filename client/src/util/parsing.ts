import { Item, ItemSchema } from "@/interfaces/item";

const parseListAsItems = (raw_item_data: any): Item[] => {
  if (!Array.isArray(raw_item_data)) {
    return [];
  }
  let response = [] as Item[];
  raw_item_data.forEach((raw_item: any) => {
    try {
      ItemSchema.parse(raw_item);
      response.push(raw_item as Item);
    } catch (e) {
      console.log(e);
    }
  });
  return response;
};

export { parseListAsItems };
