import { Item } from "@/interfaces/item";
import styles from "./../css/ItemCard.module.css";

interface ItemCardProps {
  item: Item;
}

export default function ItemCard(props: ItemCardProps) {
  const item = props.item;
  return (
    <div className={styles.itemCardContainer}>
      {item.is_goal && <div>(g)</div>}
      <span>{item.name}</span>, <span>{item.priority}</span>
      {item.tags.map((tag) => (
        <div key={tag}>#{tag}</div>
      ))}
    </div>
  );
}
