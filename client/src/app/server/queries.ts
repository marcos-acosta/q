"use server";

import { NamedQuery } from "@/interfaces/query";
import { parseListAsNamedQueries } from "@/util/parsing";
import axios from "axios";

export async function fetchNamedQueries(): Promise<NamedQuery[]> {
  const item_results = await axios
    .get("http://localhost:3000/queries/")
    .then((response) => response.data);
  return parseListAsNamedQueries(item_results);
}

export async function addNamedQueryToDb(named_query: NamedQuery) {
  return await axios
    .post("http://localhost:3000/queries", named_query)
    .then((response) => response.data);
}

export async function updateQueryInDb(named_query: NamedQuery) {
  return await axios
    .post(`http://localhost:3000/items/${named_query.id}`, named_query)
    .then((response) => response.data);
}

export async function deleteQueryInDb(named_query: NamedQuery) {
  return await axios
    .delete(`http://localhost:3000/queries/${named_query.id}`)
    .then((response) => response.data);
}
