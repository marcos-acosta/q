import { EffortType, Item, Progress } from "@/app/interfaces/item";
import styles from "./../css/ItemCard.module.css";
import { useState } from "react";
import { getItemCompletionStatus } from "@/app/core/data/progress";
import {
  capitalize,
  combineClasses,
  SOURCE_CODE_PRO,
  tagToColor,
} from "@/app/core/styling/css";
import CompletionButton from "./CompletionButton";
import ProgressCircle from "./ProgressCircle";
import { joinNodes } from "@/app/core/styling/jsx-util";
import { summarizeTaskTimeSpec } from "@/app/core/data-rendering/time-spec";

interface ItemCardProps {
  item: Item;
  addProgress?: (p: Progress, i: Item) => void;
  archive?: () => void;
  delete?: () => void;
  demo?: boolean;
}

export default function ItemCard(props: ItemCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  const item = props.item;

  const addOneTimeProgress = () => {
    if (props.demo || !props.addProgress) {
      return;
    }
    props.addProgress(
      {
        timestamp: Date.now(),
        contribution_times: 1,
      },
      item
    );
  };

  const addDurationProgress = (duration_minutes: number) => {
    if (props.demo || !props.addProgress) {
      return;
    }
    props.addProgress(
      {
        timestamp: Date.now(),
        contribution_minutes: duration_minutes,
      },
      item
    );
  };

  const tagsElement = item.tags.length > 0 && (
    <span>
      {item.tags.map((tag) => (
        <span key={tag} className={styles.tag}>
          #
          {
            <span
              className={styles.tagBody}
              style={{ textDecorationColor: tagToColor(tag) }}
            >
              {tag}
            </span>
          }
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
    <button onClick={props.delete} className={styles.actionButton}>
      <span className="material-symbols-outlined">delete</span>
    </button>,
  ];

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={styles.itemCardContainer}>
        {!props.demo && (
          <div className={styles.completeBox}>
            <CompletionButton
              isInputType={item.effort_type === EffortType.DURATION}
              clickCallback={addOneTimeProgress}
              inputCallback={addDurationProgress}
            >
              <ProgressCircle
                completed={completionStatus.progress}
                total={completionStatus.quota || 1}
              />
            </CompletionButton>
          </div>
        )}
        <div className={styles.itemNameAndActionsContainer}>
          <div
            className={combineClasses(
              styles.itemName,
              completionStatus.is_completed && styles.completedName
            )}
          >
            {capitalize(item.name)}
          </div>
          {isHovering && !props.demo && (
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
