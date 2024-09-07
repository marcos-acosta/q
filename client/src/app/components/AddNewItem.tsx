"use client";

import { Item } from "@/interfaces/item";
import { combineClasses, SOURCE_CODE_PRO } from "@/util/css";
import { parseItemInput } from "@/util/item-input";
import { useState } from "react";
import styles from "@/app/css/AddNewItem.module.css";

export interface AddNewItemProps {
  addItem: (i: Item) => void;
}

export default function AddNewItem(props: AddNewItemProps) {
  const [itemSpec, setItemSpec] = useState("");

  const addItem = () => {
    try {
      const item: Item = parseItemInput(itemSpec);
      props.addItem(item);
      setItemSpec("");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={styles.itemInputContainer}>
      <input
        value={itemSpec}
        onChange={(e) => setItemSpec(e.target.value)}
        className={combineClasses(styles.inputBox, SOURCE_CODE_PRO.className)}
        size={Math.max(itemSpec.length, 20)}
      />
      <button onClick={addItem} className={styles.addItemButton}>
        <span
          className={combineClasses(
            styles.whiteIcon,
            "material-symbols-outlined"
          )}
        >
          add
        </span>
      </button>
    </div>
  );
}
