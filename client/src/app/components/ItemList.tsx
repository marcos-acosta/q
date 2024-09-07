"use client";

import ItemCard from "./ItemCard";
import { Item, Progress } from "@/interfaces/item";
import styles from "./../css/ItemList.module.css";
import { basicSortItems } from "@/util/sorting";

export interface ItemListProps {
  items: Item[];
  isLoading: boolean;
  addProgress: (p: Progress, i: Item) => void;
  archive: (i: Item) => void;
}

export default function ItemList(props: ItemListProps) {
  const sortedItems = basicSortItems(props.items);

  return (
    <div>
      {props.isLoading ? (
        "loading..."
      ) : (
        <div className={styles.itemListContainer}>
          {sortedItems.map((item: Item) => (
            <div key={item.id}>
              <ItemCard
                item={item}
                addProgress={props.addProgress}
                archive={() => props.archive(item)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
