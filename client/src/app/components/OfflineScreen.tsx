import styles from "@/app/css/OfflineScreen.module.css";
import { SOURCE_CODE_PRO } from "../core/styling/css";

export default function OfflineScreen() {
  return (
    <div className={styles.messageContainer}>
      <div className={styles.verticalAligner}>
        <div className={SOURCE_CODE_PRO.className}>(+_+)</div>
        <div>You're offline!</div>
      </div>
    </div>
  );
}
