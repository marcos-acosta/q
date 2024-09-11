import { createRef, ReactElement, useState } from "react";
import ProgressCircle from "./ProgressCircle";
import styles from "@/app/css/CompletionButton.module.css";
import { combineClasses, SOURCE_CODE_PRO } from "@/util/css";
import { EffortType } from "@/interfaces/item";
import { callbackOnEnter } from "@/util/jsx-util";
import { parseTimeDurationToMinutes } from "@/util/parsing";

export interface CompletionButtonProps {
  isInputType: boolean;
  clickCallback: () => void;
  inputCallback: (d: any) => void;
  children: ReactElement;
  classNames?: string;
}

const CLOSED_INPUT_WIDTH = "0px";
const OPEN_INPUT_WIDTH = "40px";

export default function CompletionButton(props: CompletionButtonProps) {
  const [durationInput, setDurationInput] = useState("");
  const [hideInput, setHideInput] = useState(true);
  const inputRef = createRef<HTMLInputElement>();

  const handleClick = () => {
    if (props.isInputType) {
      setDurationInput("");
      if (hideInput) {
        openInput();
      } else {
        closeInput();
      }
    } else {
      props.clickCallback();
    }
  };

  const handleDurationInput = () => {
    try {
      const duration = parseTimeDurationToMinutes(durationInput);
      props.inputCallback(duration);
      setHideInput(true);
    } catch (e) {
      console.log(e);
    }
  };

  const openInput = () => {
    setHideInput(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const closeInput = () => {
    setHideInput(true);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  return (
    <div
      className={combineClasses(styles.completionContainer, props.classNames)}
      onClick={handleClick}
    >
      <input
        value={durationInput}
        onChange={(e) => setDurationInput(e.target.value)}
        className={combineClasses(
          styles.durationInput,
          SOURCE_CODE_PRO.className
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onKeyDown={(e) => callbackOnEnter(e, handleDurationInput)}
        style={{
          width: hideInput ? CLOSED_INPUT_WIDTH : OPEN_INPUT_WIDTH,
          paddingLeft: hideInput ? 0 : undefined,
          paddingRight: hideInput ? 0 : undefined,
        }}
        ref={inputRef}
      />
      {props.children}
    </div>
  );
}
