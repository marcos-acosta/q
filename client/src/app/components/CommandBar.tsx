"use client";

import { Item, ItemSchema } from "@/app/interfaces/item";
import { combineClasses, SOURCE_CODE_PRO } from "@/app/core/styling/css";
import { useEffect, useState } from "react";
import styles from "@/app/css/CommandBar.module.css";
import { callbackOnEnter } from "@/app/core/styling/jsx-util";
import { parseInputToQuery } from "@/app/core/input-parsing/query-parsing";
import FullScreenInput from "./FullScreenInput";
import { Query } from "../interfaces/query";
import { parseItemInputSpec } from "../core/input-parsing/item-parsing";
import { v4 } from "uuid";

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
  const [isSavingQuery, setIsSavingQuery] = useState(false);

  const parseResult = parseItemInputSpec(inputSpec);

  useEffect(() => {
    if (commandBarMode === CommandBarMode.QUERY) {
      setInputSpec(props.querySpecInEffect);
    }
  }, [props.querySpecInEffect, commandBarMode]);

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
      if (parseResult.partial_item && !parseResult.any_error) {
        let newItem = parseResult.partial_item;
        newItem.creation_timestamp = Date.now();
        newItem.id = v4();
        newItem.creation_spec = inputSpec.trim();
        props.addItem(ItemSchema.parse(parseResult.partial_item));
      } else if (parseResult.any_error) {
        // TODO
        console.log("There was an error: ", parseResult);
      }
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

  const handleSaveQuery = (queryName: string) => {
    props.addNamedQuery(queryName);
    setIsSavingQuery(false);
  };

  return (
    <>
      {isSavingQuery && (
        <FullScreenInput
          placeholderText={"bookmark name"}
          callback={handleSaveQuery}
          cancel={() => setIsSavingQuery(false)}
        />
      )}
      <div className={styles.itemInputContainer}>
        <div className={styles.commandBarActions}>
          {commandBarMode === CommandBarMode.QUERY &&
            props.querySpecInEffect.length > 0 && (
              <span
                className={combineClasses(
                  "material-symbols-outlined",
                  styles.saveQuery
                )}
                onClick={() => setIsSavingQuery(true)}
              >
                bookmark_star
              </span>
            )}
        </div>
        <div className={styles.commandBarModeIndicator} onClick={switchMode}>
          <span
            className={combineClasses(
              "material-symbols-outlined",
              styles.indicator
            )}
          >
            {commandBarMode === CommandBarMode.ADD
              ? "list_alt_add"
              : "filter_alt"}
          </span>
        </div>
        <input
          value={inputSpec}
          onChange={(e) => setInputSpec(e.target.value)}
          className={combineClasses(styles.inputBox, SOURCE_CODE_PRO.className)}
          size={Math.max(inputSpec.length, 20)}
          onKeyDown={(e) => callbackOnEnter(e, handleEnter)}
        />
      </div>
    </>
  );
}
