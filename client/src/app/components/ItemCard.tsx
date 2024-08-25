import { Item } from "@/interfaces/item";
import styles from "./../css/ItemCard.module.css";
import { formatPlanning } from "@/util/item-utils";

interface ItemCardProps {
  item: Item;
  isBlocked: boolean;
}

export default function ItemCard(props: ItemCardProps) {
  const item = props.item;
  return (
    <div className={styles.itemCardContainer}>
      {item.is_goal && <div>(g)</div>}
      <div>{item.name}</div>
      {props.isBlocked && <div>(blocked)</div>}
      {formatPlanning(item)}
      {item.tags.map((tag) => (
        <div key={tag}>#{tag}</div>
      ))}
    </div>
  );
}
