import style from "@/app/css/QueryCard.module.css";
import { combineClasses, SOURCE_CODE_PRO } from "@/util/css";

interface QueryCardProps {
  queryName: string;
  querySpec: string;
  isSelected: boolean;
  selectCallback: () => void;
}

export default function QueryCard(props: QueryCardProps) {
  return (
    <div className={style.queryCardContainer} onClick={props.selectCallback}>
      <div
        className={combineClasses(
          style.queryCardName,
          props.isSelected && style.selected
        )}
      >
        {props.queryName}
      </div>
      <div
        className={combineClasses(
          style.queryCardSpec,
          SOURCE_CODE_PRO.className
        )}
      >
        {props.querySpec}
      </div>
    </div>
  );
}
