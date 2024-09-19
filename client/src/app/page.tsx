"use client";

import { useEffect, useState } from "react";
import { Item } from "@/app/interfaces/item";
import { fetchItems } from "./server/items";
import { fetchNamedQueries } from "./server/queries";
import MainView from "./components/MainView";
import { NamedQuery } from "./interfaces/query";

export default function Q() {
  const [items, setItems] = useState([] as Item[]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [namedQueries, setNamedQueries] = useState([] as NamedQuery[]);
  const [isLoadingQueries, setIsLoadingQueries] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    fetchItems().then((data) => {
      setItems(data);
      setIsLoadingItems(false);
    });
    fetchNamedQueries().then((data) => {
      setNamedQueries(data);
      setIsLoadingQueries(false);
    });
  }, []);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    addEventListener("offline", handleOffline);
    addEventListener("online", handleOnline);
    return () => {
      removeEventListener("offline", handleOffline);
      removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <MainView
      items={items}
      isItemsLoading={isLoadingItems}
      setItems={setItems}
      queries={namedQueries}
      isQueriesLoading={isLoadingQueries}
      setQueries={setNamedQueries}
      isOffline={isOffline}
    />
  );
}
