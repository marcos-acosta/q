import { NamedQuery } from "@/interfaces/query";
import QueryCard from "./QueryCard";

export interface QueryListProps {
  namedQueries: NamedQuery[];
  selectedQueryId: string | null;
  selectQuery: (nq: NamedQuery | null) => void;
}

export default function QueryList(props: QueryListProps) {
  const heap = (
    <QueryCard
      queryName={"heap"}
      querySpec={"*"}
      isSelected={props.selectedQueryId === null}
      selectCallback={() => props.selectQuery(null)}
      key="heap"
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
        key={namedQuery.id}
      />
    )),
  ];

  return <div>{queryTabs}</div>;
}
