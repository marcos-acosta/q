"use client";

import { useEffect, useState } from "react";
import { Item } from "@/interfaces/item";
import { fetchItems } from "../server/items";
import ItemCard from "./ItemCard";
import { areItemDependenciesSatisfied } from "@/util/item-utils";

export default function ItemList() {
  const [items, setActions] = useState(null as null | Item[]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItems().then((data: Item[]) => {
      setActions(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      {!isLoading &&
        items &&
        items.map((item) => (
          <ItemCard
            item={item}
            isBlocked={!areItemDependenciesSatisfied(item, items)}
            key={item.id}
          />
        ))}
    </div>
  );
}
