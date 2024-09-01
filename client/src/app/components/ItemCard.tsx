import { EffortType, Item, ProgressContribution } from "@/interfaces/item";
import styles from "./../css/ItemCard.module.css";
import { useState } from "react";
import { parseTimeDurationToMinutes } from "@/util/parsing";
import { getCurrentPeriodForItem } from "@/util/dates";

interface ItemCardProps {
  item: Item;
  addProgress: (p: ProgressContribution, i: Item) => void;
}

export default function ItemCard(props: ItemCardProps) {
  const [timeInput, setTimeInput] = useState("");

  const item = props.item;

  const addOneTimeProgress = () =>
    props.addProgress(
      {
        timestamp: Date.now(),
        contribution_type: EffortType.COMPLETION,
        contribution_times: 1,
        date_range: getCurrentPeriodForItem(item),
      },
      item
    );

  const addDurationProgress = () => {
    try {
      props.addProgress(
        {
          timestamp: Date.now(),
          contribution_type: EffortType.DURATION,
          contribution_minutes: parseTimeDurationToMinutes(timeInput),
          date_range: getCurrentPeriodForItem(item),
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
