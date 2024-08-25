"use server";

export async function fetchActions() {
  return fetch("http://localhost:3000/actions/").then((res) => res.json());
}
