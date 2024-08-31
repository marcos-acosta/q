"use client";

import ItemCard from "./ItemCard";
import { Item } from "@/interfaces/item";

export interface ItemListProps {
  items: Item[];
  isLoading: boolean;
}

export default function ItemList(props: ItemListProps) {
  return (
    <div>
      {props.isLoading
        ? "loading..."
        : props.items.map((item: Item) => (
            <ItemCard item={item} key={item._id} />
          ))}
    </div>
  );
}
