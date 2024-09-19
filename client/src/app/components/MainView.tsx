"use client";

import { useEffect, useState } from "react";
import CommandBar from "./CommandBar";
import ItemList from "./ItemList";
import { Item, Progress } from "@/app/interfaces/item";
import {
  addItemToDb,
  deleteItemInDb,
  updateItemInDb,
} from "@/app/server/items";
import { updateItemWithProgress } from "@/app/core/data/progress";
import {
  DEFAULT_QUERY,
  filterItemsByQuery,
} from "@/app/core/queries/filtering";
import { basicSortItems } from "@/app/core/sorting/sorting";
import { addNamedQueryToDb, deleteQueryInDb } from "@/app/server/queries";
import { v4 as uuid_v4 } from "uuid";
import style from "@/app/css/MainView.module.css";
import QueryList from "./QueryList";
import { NamedQuery, Query } from "../interfaces/query";

export interface MainViewProps {
  items: Item[];
  setItems: (i: Item[]) => void;
  isItemsLoading: boolean;
  queries: NamedQuery[];
  isQueriesLoading: boolean;
  setQueries: (q: NamedQuery[]) => void;
  isOffline: boolean;
}

export default function MainView(props: MainViewProps) {
  const [querySpecInEffect, setQuerySpecInEffect] = useState("");
  const [queryInEffect, setQueryInEffect] = useState(null as Query | null);
  const [selectedQueryId, setSelectedQueryId] = useState(null as string | null);
  const setNow = useState(Date.now())[1];

  useEffect(() => {
    const updateNow = () => setNow(Date.now());
    // Update every 5 minutes
    const intervalId = setInterval(updateNow, 1000 * 60 * 5);
    return () => clearInterval(intervalId);
  }, []);

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

  const deleteQuery = (nq: NamedQuery) => {
    try {
      deleteQueryInDb(nq).then((response) => console.log(response));
      props.setQueries(props.queries.filter((_nq) => _nq.id !== nq.id));
    } catch (e) {
      console.log(e);
    }
  };

  return props.isOffline ? (
    <div>you're offline</div>
  ) : (
    <div>
      <div className={style.queryBar}>
        <QueryList
          namedQueries={props.queries}
          selectedQueryId={selectedQueryId}
          selectQuery={selectQuery}
          deleteQuery={deleteQuery}
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
