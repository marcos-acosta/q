import styles from "@/app/css/QueryCard.module.css";
import { combineClasses, SOURCE_CODE_PRO, tagToColor } from "@/util/css";
import { andStopPropagate, joinNodes } from "@/util/jsx-util";
import { useState } from "react";

interface QueryCardProps {
  queryName: string;
  querySpec: string;
  isSelected: boolean;
  selectCallback: () => void;
  delete?: () => void;
  isDefault?: boolean;
}

export default function QueryCard(props: QueryCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  const actionButtons = [
    <button
      onClick={(e) => andStopPropagate(e, () => {})}
      className={styles.actionButton}
    >
      <span className="material-symbols-outlined">edit</span>
    </button>,
    <button
      onClick={(e) => andStopPropagate(e, props.delete)}
      className={styles.actionButton}
    >
      <span className="material-symbols-outlined">delete</span>
    </button>,
  ];

  return (
    <div
      className={styles.queryCardContainer}
      onClick={props.selectCallback}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {props.isSelected && (
        <div className={styles.queryCardSelectedIndicator}>•</div>
      )}
      <div
        className={combineClasses(
          styles.queryCardName,
          props.isSelected && styles.selected
        )}
      >
        <span
          className={styles.queryName}
          style={{
            textDecorationColor: props.isDefault
              ? undefined
              : tagToColor(props.queryName),
          }}
        >
          {props.queryName}
        </span>
        {isHovering && (
          <div className={styles.actions}>{joinNodes(actionButtons, " ")}</div>
        )}
      </div>
      <div
        className={combineClasses(
          styles.queryCardSpec,
          SOURCE_CODE_PRO.className
        )}
      >
        {props.querySpec}
      </div>
    </div>
  );
}
