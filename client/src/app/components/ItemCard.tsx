import { EffortType, Item, Progress } from "@/interfaces/item";
import styles from "./../css/ItemCard.module.css";
import { useState } from "react";
import { parseTimeDurationToMinutes } from "@/util/parsing";
import { getItemCompletionStatus } from "@/util/progress";
import {
  capitalize,
  formatTag,
  summarizeTaskTimeSpec,
} from "@/util/formatting";
import ProgressCircle from "./ProgressCircle";
import { combineClasses, SOURCE_CODE_PRO } from "@/util/css";
import { joinNodes } from "@/util/jsx-util";

interface ItemCardProps {
  item: Item;
  addProgress: (p: Progress, i: Item) => void;
  archive: () => void;
}

export default function ItemCard(props: ItemCardProps) {
  const [timeInput, setTimeInput] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const item = props.item;

  const addOneTimeProgress = () =>
    props.addProgress(
      {
        timestamp: Date.now(),
        contribution_times: 1,
      },
      item
    );

  const addDurationProgress = () => {
    try {
      props.addProgress(
        {
          timestamp: Date.now(),
          contribution_minutes: parseTimeDurationToMinutes(timeInput),
        },
        item
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleCompletionClick = () => {
    if (item.effort_type === EffortType.COMPLETION) {
      addOneTimeProgress();
    }
  };

  const tagsElement = item.tags.length > 0 && (
    <span>
      {item.tags.map((tag) => (
        <span key={tag} className={styles.tag}>
          {formatTag(tag)}
        </span>
      ))}
    </span>
  );

  const completionStatus = getItemCompletionStatus(item, new Date());
  const taskSpecSummary = summarizeTaskTimeSpec(item);
  const tagDelimiter = <span className={styles.bulletPoint}>•</span>;

  const actionButtons = [
    <button onClick={props.archive} className={styles.actionButton}>
      <span className="material-symbols-outlined">archive</span>
    </button>,
    <button onClick={() => {}} className={styles.actionButton}>
      <span className="material-symbols-outlined">edit</span>
    </button>,
  ];

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={styles.itemCardContainer}>
        <div className={styles.completeBox}>
          <ProgressCircle
            completed={completionStatus.progress}
            total={completionStatus.quota || 1}
            onClick={handleCompletionClick}
          />
        </div>
        <div className={styles.itemNameAndActionsContainer}>
          <div className={styles.itemName}>{capitalize(item.name)}</div>
          {isHovering && (
            <div className={styles.actions}>
              {joinNodes(actionButtons, " ")}
            </div>
          )}
        </div>
        <div className={combineClasses(styles.info, SOURCE_CODE_PRO.className)}>
          {joinNodes(
            [taskSpecSummary, tagsElement].filter(Boolean),
            tagDelimiter
          )}
        </div>
      </div>
    </div>
  );
}
