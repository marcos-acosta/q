"use client";

import { useEffect, useState } from "react";
import { Item } from "@/interfaces/item";
import { fetchItems } from "./server/items";
import { NamedQuery } from "@/interfaces/query";
import { fetchNamedQueries } from "./server/queries";
import MainView from "./components/MainView";

export default function Q() {
  const [items, setItems] = useState([] as Item[]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [namedQueries, setNamedQueries] = useState([] as NamedQuery[]);
  const [isLoadingQueries, setIsLoadingQueries] = useState(true);

  useEffect(() => {
    fetchItems().then((data) => {
      setItems(data);
      setIsLoadingItems(false);
    });
  }, []);

  useEffect(() => {
    fetchNamedQueries().then((data) => {
      setNamedQueries(data);
      setIsLoadingQueries(false);
    });
  }, []);

  return (
    <MainView
      items={items}
      isItemsLoading={isLoadingItems}
      setItems={setItems}
      queries={namedQueries}
      isQueriesLoading={isLoadingQueries}
      setQueries={setNamedQueries}
    />
  );
}
