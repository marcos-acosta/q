"use client";

import { useEffect, useState } from "react";
import CommandBar from "./components/CommandBar";
import ItemList from "./components/ItemList";
import { Item, Progress } from "@/interfaces/item";
import { addItemToDb, fetchItems, updateItemInDb } from "./server/items";
import { updateItemWithProgress } from "@/util/progress";
import { DEFAULT_QUERY, filterItemsByQuery } from "@/util/filtering";
import { basicSortItems } from "@/util/sorting";
import { Query } from "@/interfaces/query";

export default function Q() {
  const [items, setItems] = useState([] as Item[]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [querySpecInEffect, setQuerySpecInEffect] = useState("");

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

  const setQueryAndSpec = (q: Query, querySpec: string) => {
    setQuery(q);
    setQuerySpecInEffect(querySpec);
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

  const archive = (item: Item) => {
    try {
      const new_item: Item = { ...item, is_archived: true };
      updateItemInDb(new_item).then((response) => console.log(response));
      setItems(items.map((item_) => (item_.id === item.id ? new_item : item_)));
    } catch (e) {
      console.log(e);
    }
  };

  const filteredItems = basicSortItems(filterItemsByQuery(items, query));

  return (
    <>
      <CommandBar
        addItem={addItem}
        setQuery={setQueryAndSpec}
        querySpecInEffect={querySpecInEffect}
      />
      <ItemList
        items={filteredItems}
        isLoading={isLoading}
        addProgress={addProgress}
        archive={archive}
      />
    </>
  );
}
