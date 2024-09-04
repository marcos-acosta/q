"use server";

import { Item } from "@/interfaces/item";
import { parseListAsItems } from "@/util/parsing";
import axios from "axios";

export async function fetchItems(): Promise<Item[]> {
  const item_results = await axios
    .get("http://localhost:3000/items/")
    .then((response) => response.data);
  return parseListAsItems(item_results);
}

export async function addItemToDb(item: Item) {
  return await axios
    .post("http://localhost:3000/items", item)
    .then((response) => response.data);
}

export async function updateItemInDb(item: Item) {
  return await axios
    .post(`http://localhost:3000/items/${item.id}`, item)
    .then((response) => response.data);
}
