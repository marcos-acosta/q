"use client";

import { useEffect, useState } from "react";
import AddNewItem from "./components/AddNewItem";
import ItemList from "./components/ItemList";
import { Item, Progress } from "@/interfaces/item";
import { addItemToDb, fetchItems, updateItemInDb } from "./server/items";
import { updateItemWithProgress } from "@/util/progress";

export default function Q() {
  const [items, setItems] = useState([] as Item[]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItems().then((data) => {
      setItems(data);
      setIsLoading(false);
    });
  }, []);

  const addItem = (item: Item) => {
    try {
      addItemToDb(item).then((response) => console.log(response));
      setItems([...items, item]);
    } catch (e) {
      console.log(e);
    }
  };

  const addProgress = (progress: Progress, item: Item) => {
    try {
      const new_item = updateItemWithProgress(item, progress);
      updateItemInDb(new_item).then((response) => console.log(response));
      setItems(items.map((item_) => (item_.id === item.id ? new_item : item_)));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <AddNewItem addItem={addItem} />
      <ItemList
        items={items.filter((item) => !item.is_archived)}
        isLoading={isLoading}
        addProgress={addProgress}
      />
    </>
  );
}
