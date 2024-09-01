"use client";

import ItemCard from "./ItemCard";
import { Item, ProgressContribution } from "@/interfaces/item";

export interface ItemListProps {
  items: Item[];
  isLoading: boolean;
  addProgress: (p: ProgressContribution, i: Item) => void;
}

export default function ItemList(props: ItemListProps) {
  return (
    <div>
      {props.isLoading
        ? "loading..."
        : props.items.map((item: Item) => (
            <ItemCard
              item={item}
              addProgress={props.addProgress}
              key={item.id.toString()}
            />
          ))}
    </div>
  );
}
