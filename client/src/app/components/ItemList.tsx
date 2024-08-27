"use client";

import { useEffect, useState } from "react";
import { Item } from "@/interfaces/definitions/item";
import { fetchItems } from "../server/items";
import ItemCard from "./ItemCard";
import { parseListAsItems } from "@/util/parsing";

export default function ItemList() {
  const [items, setActions] = useState(null as null | Item[]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItems().then((data) => {
      setActions(parseListAsItems(data));
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      {!isLoading &&
        items &&
        items.map((item) => <ItemCard item={item} key={item.id} />)}
    </div>
  );
}
