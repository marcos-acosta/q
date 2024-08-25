"use server";

export async function fetchItems() {
  return fetch("http://localhost:3000/items/").then((res) => res.json());
}
