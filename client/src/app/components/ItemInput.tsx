import styles from "@/app/css/ItemInput.module.css";
import { combineClasses, SOURCE_CODE_PRO } from "@/app/core/styling/css";
import { callbackOnEnter } from "@/app/core/styling/jsx-util";
import { useState } from "react";
import { parseItemInputSpec } from "../core/input-parsing/item-parsing";
import ItemCard from "./ItemCard";
import { ParseResult } from "../core/input-parsing/spec-parsing";
import { Item, ItemSchema } from "../interfaces/item";
import { v4 } from "uuid";

export interface ItemInputProps {
  callback: (i: Item) => void;
  cancel: () => void;
}

const convertInputSpecToItemOrError = (
  inputSpec: string
): [Item | undefined, string | undefined] => {
  const parsedInputSpec: ParseResult<Item> = parseItemInputSpec(inputSpec);
  let item = undefined as Item | undefined;
  let errorMessage = undefined as string | undefined;
  if (!parsedInputSpec.any_error && parsedInputSpec.partial_result) {
    const partialItem = parsedInputSpec.partial_result;
    partialItem.creation_spec = inputSpec;
    partialItem.creation_timestamp = Date.now();
    partialItem.id = v4();
    try {
      item = ItemSchema.parse(partialItem);
    } catch (e) {
      errorMessage = "Something's wrong with your syntax.";
    }
  } else {
    errorMessage = parsedInputSpec.input_spec_parts.find(
      (part) => part.error
    )?.error;
  }
  return [item, errorMessage];
};

export default function ItemInput(props: ItemInputProps) {
  const [inputSpec, setInputSpec] = useState("");

  const [item, errorMessage] = convertInputSpecToItemOrError(inputSpec);

  const handleEnter = () => {
    if (item) {
      props.callback(item);
      props.cancel();
    }
  };

  const placeholderText = "add a new item";

  return (
    <div className={styles.fullScreenInputContainer} onClick={props.cancel}>
      <input
        className={combineClasses(
          styles.inputBox,
          SOURCE_CODE_PRO.className,
          errorMessage && inputSpec.length > 0 && styles.inputError
        )}
        placeholder={placeholderText}
        value={inputSpec}
        onChange={(e) => setInputSpec(e.target.value)}
        onKeyDown={(e) => callbackOnEnter(e, handleEnter)}
        size={Math.max(inputSpec.length, placeholderText.length)}
        autoFocus
      />
      {inputSpec.length > 0 &&
        (item ? (
          <ItemCard item={item} demo={true} />
        ) : (
          <div
            className={combineClasses(
              styles.errorMessage,
              SOURCE_CODE_PRO.className
            )}
          >
            {errorMessage}
          </div>
        ))}
    </div>
  );
}
