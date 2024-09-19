import { NamedQuery } from "../interfaces/query";
import QueryCard from "./QueryCard";
import style from "@/app/css/QueryList.module.css";

export interface QueryListProps {
  namedQueries: NamedQuery[];
  selectedQueryId: string | null;
  selectQuery: (nq: NamedQuery | null) => void;
  deleteQuery: (nq: NamedQuery) => void;
}

export default function QueryList(props: QueryListProps) {
  const heap = (
    <QueryCard
      queryName={"heap"}
      querySpec={"*"}
      isSelected={props.selectedQueryId === null}
      selectCallback={() => props.selectQuery(null)}
      key="heap"
      isDefault={true}
    />
  );
  const queryTabs = [
    heap,
    ...props.namedQueries.map((namedQuery) => (
      <QueryCard
        queryName={namedQuery.query_name}
        querySpec={namedQuery.creation_spec}
        isSelected={namedQuery.id === props.selectedQueryId}
        selectCallback={() => props.selectQuery(namedQuery)}
        delete={() => props.deleteQuery(namedQuery)}
        key={namedQuery.id}
      />
    )),
  ];

  return <div className={style.queryListContainer}>{queryTabs}</div>;
}
