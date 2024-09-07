import { THEME_COLORS } from "@/util/css";
import styles from "./../css/ProgressBar.module.css";

export interface ProgressCircleProps {
  completed: number;
  total: number;
  onClick: () => void;
}

export default function ProgressCircle(props: ProgressCircleProps) {
  const percentage = Math.min(
    Math.max(Math.round((props.completed / props.total) * 10000) / 100, 0),
    100
  );
  return (
    <div
      className={styles.progressBar}
      onClick={props.onClick}
      style={{
        background: `conic-gradient( ${THEME_COLORS.black}, ${percentage}%, transparent 0)`,
      }}
    />
  );
}
