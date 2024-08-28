import { Item, ItemSchema } from "@/interfaces/item";

const parseListAsItems = (raw_item_data: any): Item[] => {
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

export { parseListAsItems };
