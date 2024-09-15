"use client";

import { useState } from "react";
import CommandBar from "./CommandBar";
import ItemList from "./ItemList";
import { Item, Progress } from "@/interfaces/item";
import {
  addItemToDb,
  deleteItemInDb,
  updateItemInDb,
} from "@/app/server/items";
import { updateItemWithProgress } from "@/util/progress";
import { DEFAULT_QUERY, filterItemsByQuery } from "@/util/filtering";
import { basicSortItems } from "@/util/sorting";
import { NamedQuery, Query } from "@/interfaces/query";
import { addNamedQueryToDb } from "@/app/server/queries";
import { v4 as uuid_v4 } from "uuid";
import style from "@/app/css/MainView.module.css";
import QueryList from "./QueryList";

export interface MainViewProps {
  items: Item[];
  setItems: (i: Item[]) => void;
  isItemsLoading: boolean;
  queries: NamedQuery[];
  isQueriesLoading: boolean;
  setQueries: (q: NamedQuery[]) => void;
}

export default function MainView(props: MainViewProps) {
  const [querySpecInEffect, setQuerySpecInEffect] = useState("");
  const [queryInEffect, setQueryInEffect] = useState(null as Query | null);
  const [selectedQueryId, setSelectedQueryId] = useState(null as string | null);

  const addItem = (item: Item) => {
    try {
      addItemToDb(item).then((response) => console.log(response));
      props.setItems([...props.items, item]);
    } catch (e) {
      console.log(e);
    }
  };

  const addNamedQuery = (queryName: string) => {
    if (!queryInEffect) {
      return;
    }
    const namedQuery: NamedQuery = {
      query: queryInEffect,
      creation_spec: querySpecInEffect,
      query_name: queryName,
      id: uuid_v4(),
      creation_timestamp: Date.now(),
    };
    try {
      addNamedQueryToDb(namedQuery).then((response) => console.log(response));
      props.setQueries([...props.queries, namedQuery]);
      selectQuery(namedQuery);
    } catch (e) {
      console.log(e);
    }
  };

  const setQueryAndSpec = (q: Query, querySpec: string) => {
    setQueryInEffect(q);
    setQuerySpecInEffect(querySpec);
  };

  const addProgress = (progress: Progress, item: Item) => {
    try {
      const new_item = updateItemWithProgress(item, progress);
      updateItemInDb(new_item).then((response) => console.log(response));
      props.setItems(
        props.items.map((item_) => (item_.id === item.id ? new_item : item_))
      );
    } catch (e) {
      console.log(e);
    }
  };

  const archive = (item: Item) => {
    try {
      const new_item: Item = { ...item, is_archived: true };
      updateItemInDb(new_item).then((response) => console.log(response));
      props.setItems(
        props.items.map((item_) => (item_.id === item.id ? new_item : item_))
      );
    } catch (e) {
      console.log(e);
    }
  };

  const deleteItem = (item: Item) => {
    try {
      deleteItemInDb(item).then((response) => console.log(response));
      props.setItems(props.items.filter((_item) => _item.id !== item.id));
    } catch (e) {
      console.log(e);
    }
  };

  const filteredItems = basicSortItems(
    filterItemsByQuery(
      props.items,
      queryInEffect ? queryInEffect : DEFAULT_QUERY
    )
  );

  const selectQuery = (namedQuery: NamedQuery | null) => {
    setQueryInEffect(namedQuery ? namedQuery.query : null);
    setQuerySpecInEffect(namedQuery ? namedQuery.creation_spec : "");
    setSelectedQueryId(namedQuery ? namedQuery.id : null);
  };

  return (
    <div className={style.mainGrid}>
      <div className={style.leftBar}>
        <QueryList
          namedQueries={props.queries}
          selectedQueryId={selectedQueryId}
          selectQuery={selectQuery}
        />
      </div>
      <div>
        <CommandBar
          addItem={addItem}
          setQuery={setQueryAndSpec}
          querySpecInEffect={querySpecInEffect}
          addNamedQuery={addNamedQuery}
        />
        <ItemList
          items={filteredItems}
          isLoading={props.isItemsLoading}
          addProgress={addProgress}
          archive={archive}
          delete={deleteItem}
        />
      </div>
    </div>
  );
}
