"use client";

import { Item } from "@/interfaces/item";
import { combineClasses, SOURCE_CODE_PRO } from "@/util/css";
import { parseItemInput } from "@/util/item-input";
import { useState } from "react";
import styles from "@/app/css/CommandBar.module.css";
import { callbackOnEnter } from "@/util/jsx-util";
import { parseInputToQuery } from "@/util/query-input";
import { Query } from "@/interfaces/query";

export interface CommandBarProps {
  addItem: (i: Item) => void;
  setQuery: (q: Query, qs: string) => void;
  querySpecInEffect: string;
  addNamedQuery: (qn: string) => void;
}

const enum CommandBarMode {
  ADD,
  QUERY,
}

export default function CommandBar(props: CommandBarProps) {
  const [inputSpec, setInputSpec] = useState("");
  const [commandBarMode, setCommandBarMode] = useState(CommandBarMode.ADD);

  const handleEnter = () => {
    if (commandBarMode === CommandBarMode.ADD) {
      addItem();
    } else {
      const query = parseInputToQuery(inputSpec);
      if (query) {
        props.setQuery(query, inputSpec);
      }
    }
  };

  const addItem = () => {
    try {
      const item: Item = parseItemInput(inputSpec);
      props.addItem(item);
      setInputSpec("");
    } catch (e) {
      console.log(e);
    }
  };

  const switchMode = () => {
    setCommandBarMode(
      commandBarMode === CommandBarMode.ADD
        ? CommandBarMode.QUERY
        : CommandBarMode.ADD
    );
    if (commandBarMode === CommandBarMode.ADD) {
      setInputSpec(props.querySpecInEffect);
    } else {
      setInputSpec("");
    }
  };

  return (
    <div className={styles.itemInputContainer}>
      <div className={styles.commandBarModeIndicator} onClick={switchMode}>
        <span
          className={combineClasses(
            "material-symbols-outlined",
            styles.indicator
          )}
        >
          {commandBarMode === CommandBarMode.ADD ? "playlist_add" : "search"}
        </span>
      </div>
      <input
        value={inputSpec}
        onChange={(e) => setInputSpec(e.target.value)}
        className={combineClasses(styles.inputBox, SOURCE_CODE_PRO.className)}
        size={Math.max(inputSpec.length, 20)}
        onKeyDown={(e) => callbackOnEnter(e, handleEnter)}
      />
      <div className={styles.commandBarActions}>
        {commandBarMode === CommandBarMode.QUERY &&
          props.querySpecInEffect.length > 0 && (
            <span
              className={combineClasses(
                "material-symbols-outlined",
                styles.saveQuery
              )}
              onClick={() => props.addNamedQuery("unnamed query")}
            >
              bookmark_add
            </span>
          )}
      </div>
    </div>
  );
}
