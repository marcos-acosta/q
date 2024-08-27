"use server";

import { Item } from "@/interfaces/definitions/item";

export async function fetchItems(): Promise<Item[]> {
  return fetch("http://localhost:3000/items/").then((res) => res.json());
}
