"use client";

import { useEffect, useState } from "react";
import useKeyboardControl from "react-keyboard-control";
import { KeyboardHook } from "react-keyboard-control";
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
import styles from "@/app/css/MainView.module.css";
import QueryList from "./QueryList";
import { NamedQuery, Query } from "../interfaces/query";
import ItemInput from "./ItemInput";
import { combineClasses } from "../core/styling/css";
import QueryInput from "./QueryInput";

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
  const [queryInEffect, setQueryInEffect] = useState(null as Query | null);
  const [selectedQueryId, setSelectedQueryId] = useState(null as string | null);
  const [isShowingItemInput, setIsShowingItemInput] = useState(false);
  const [isShowingQueryInput, setIsShowingQueryInput] = useState(false);
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
      query_name: queryName,
      id: uuid_v4(),
      creation_timestamp: Date.now(),
    };
    try {
      addNamedQueryToDb(namedQuery).then((response) => console.log(response));
      props.setQueries([...props.queries, namedQuery]);
      selectQuery(namedQuery);
      setIsShowingQueryInput(false);
    } catch (e) {
      console.log(e);
    }
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

  const selectQuery = (namedQuery: NamedQuery | null) => {
    setQueryInEffect(namedQuery ? namedQuery.query : null);
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

  const cancelQuery = () => {
    setIsShowingQueryInput(false);
    setQueryInEffect(null);
    setSelectedQueryId(null);
  };

  const cancelAll = () => {
    setIsShowingItemInput(false);
    cancelQuery();
  };

  const showQueryInput = () => {
    setIsShowingQueryInput(true);
    setQueryInEffect(null);
    setSelectedQueryId(null);
  };

  const keyboardHooks: KeyboardHook[] = [
    {
      keyboardEvent: { key: "a" },
      callback: () => setIsShowingItemInput(true),
      allowWhen: !isShowingItemInput,
      preventDefault: true,
    },
    {
      keyboardEvent: { key: "q" },
      callback: showQueryInput,
      allowWhen: !isShowingItemInput,
      preventDefault: true,
    },
    {
      keyboardEvent: { key: "Escape" },
      callback: cancelAll,
      allowWhen: isShowingItemInput || isShowingQueryInput,
      allowOnTextInput: true,
    },
  ];
  useKeyboardControl(keyboardHooks);

  const filteredItems = basicSortItems(
    filterItemsByQuery(
      props.items,
      queryInEffect ? queryInEffect : DEFAULT_QUERY
    )
  );

  return props.isOffline ? (
    <div>you're offline</div>
  ) : (
    <div
      className={combineClasses(
        styles.mainViewContainer,
        isShowingItemInput && styles.preventScrolling
      )}
    >
      {isShowingItemInput && (
        <ItemInput
          callback={addItem}
          cancel={() => setIsShowingItemInput(false)}
        />
      )}
      <div className={styles.twoPanelLayout}>
        <div
          className={combineClasses(
            styles.queryBar,
            styles.queryBarPlaceholder
          )}
        />
        <div className={styles.itemListAndQueryContainer}>
          {isShowingQueryInput && (
            <div className={styles.queryInputContainer}>
              <QueryInput
                callback={setQueryInEffect}
                cancel={cancelQuery}
                saveQuery={addNamedQuery}
              />
            </div>
          )}
          <div className={styles.itemListContainer}>
            <ItemList
              items={filteredItems}
              isLoading={props.isItemsLoading}
              addProgress={addProgress}
              archive={archive}
              delete={deleteItem}
            />
          </div>
        </div>
      </div>
      <div className={styles.queryBar}>
        <QueryList
          namedQueries={props.queries}
          selectedQueryId={selectedQueryId}
          selectQuery={selectQuery}
          deleteQuery={deleteQuery}
        />
      </div>
    </div>
  );
}
