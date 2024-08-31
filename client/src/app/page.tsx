"use client";

import { useEffect, useState } from "react";
import AddNewItem from "./components/AddNewItem";
import ItemList from "./components/ItemList";
import { Item } from "@/interfaces/item";
import { addItemToDb, fetchItems } from "./server/items";

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

  return (
    <>
      <AddNewItem addItem={addItem} />
      <ItemList items={items} isLoading={isLoading} />
    </>
  );
}
