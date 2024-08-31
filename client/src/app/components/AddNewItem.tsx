"use client";

import { Item } from "@/interfaces/item";
import { parseItemInput } from "@/util/item-input";
import { useState } from "react";

export interface AddNewItemProps {
  addItem: (i: Item) => void;
}

export default function AddNewItem(props: AddNewItemProps) {
  const [itemSpec, setItemSpec] = useState("");

  const addItem = async () => {
    try {
      const item: Item = parseItemInput(itemSpec);
      props.addItem(item);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <input
        value={itemSpec}
        onChange={(e) => setItemSpec(e.target.value)}
        size={100}
      />
      <button onClick={addItem}>test</button>
    </div>
  );
}
