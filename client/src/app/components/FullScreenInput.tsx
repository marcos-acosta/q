import styles from "@/app/css/FullScreenInput.module.css";
import { combineClasses, SOURCE_CODE_PRO } from "@/util/css";
import { callbackOnEnter } from "@/util/jsx-util";
import { MouseEvent, useState } from "react";

export interface FullScreenInputProps {
  placeholderText: string;
  callback: (s: string) => void;
  cancel: () => void;
}

export default function FullScreenInput(props: FullScreenInputProps) {
  const [text, setText] = useState("");

  const handleEnter = () => {
    if (text.length) {
      props.callback(text);
    }
  };

  const handleEnterAndStopPropagation = (e: MouseEvent) => {
    e.stopPropagation();
    handleEnter();
  };

  return (
    <div className={styles.fullScreenInputContainer} onClick={props.cancel}>
      <input
        className={combineClasses(styles.inputBox, SOURCE_CODE_PRO.className)}
        placeholder={props.placeholderText}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => callbackOnEnter(e, handleEnter)}
        size={Math.max(text.length, 20)}
        autoFocus
      />
      <button
        className={styles.acceptInput}
        onClick={handleEnterAndStopPropagation}
      >
        <span
          className={combineClasses(
            "material-symbols-outlined",
            styles.addSymbol
          )}
        >
          check
        </span>
      </button>
    </div>
  );
}
