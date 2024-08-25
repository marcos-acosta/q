import { combineClasses } from "@/util/css";
import styles from "./../css/Button.module.css";

interface ButtonProps {
  iconName: string;
  classNames?: string[];
  callback?: () => {};
  toggled?: boolean;
}

export default function Button(props: ButtonProps) {
  return (
    <button
      className={combineClasses(
        styles.button,
        ...(props.classNames || []),
        props.toggled && styles.toggled
      )}
      onClick={props.callback}
    >
      <span
        className={combineClasses(
          "material-symbols-outlined",
          styles.buttonSymbol
        )}
      >
        {props.iconName}
      </span>
    </button>
  );
}
