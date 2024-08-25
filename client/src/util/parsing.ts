import { Item } from "@/interfaces/item";

const parseServerResponseToItem = (serverResponse: any): Item | null => {
  try {
    return serverResponse as Item;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export { parseServerResponseToItem };
