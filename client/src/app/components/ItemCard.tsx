import { Item, Progress } from "@/interfaces/item";
import styles from "./../css/ItemCard.module.css";
import { useState } from "react";
import { parseTimeDurationToMinutes } from "@/util/parsing";
import { getItemCompletionStatus } from "@/util/progress";

interface ItemCardProps {
  item: Item;
  addProgress: (p: Progress, i: Item) => void;
}

export default function ItemCard(props: ItemCardProps) {
  const [timeInput, setTimeInput] = useState("");

  const item = props.item;

  const completion_status = getItemCompletionStatus(item, new Date());

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

  return (
    <div className={styles.itemCardContainer}>
      {item.is_goal && <div>(g)</div>}
      <span>{item.name}</span>, <span>{item.priority}</span>
      {item.tags.map((tag) => (
        <div key={tag}>#{tag}</div>
      ))}
      <div>
        Progress: {completion_status.progress} / {completion_status.quota}
        {completion_status.is_completed && <div>completed!</div>}
      </div>
      <div>
        <div>
          <button onClick={addOneTimeProgress}>+1</button>
        </div>
        <div>
          <input
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
          />
          <button onClick={addDurationProgress}>+t</button>
        </div>
      </div>
    </div>
  );
}
