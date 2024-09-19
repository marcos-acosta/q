import { THEME_COLORS } from "@/app/core/styling/css";
import styles from "./../css/ProgressCircle.module.css";

export interface ProgressCircleProps {
  completed: number;
  total: number;
  onClick?: () => void;
  styles?: Object;
}

export default function ProgressCircle(props: ProgressCircleProps) {
  const percentage = Math.min(
    Math.max(Math.round((props.completed / props.total) * 10000) / 100, 0),
    100
  );
  return (
    <div
      className={styles.progressCircle}
      onClick={props.onClick}
      style={{
        background: `conic-gradient( ${THEME_COLORS.black}, ${percentage}%, transparent 0)`,
        ...props.styles,
      }}
    />
  );
}
