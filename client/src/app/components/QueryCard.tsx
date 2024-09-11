interface QueryCardProps {
  queryName: string;
  querySpec: string;
  isSelected: boolean;
  selectCallback: () => void;
}

export default function QueryCard(props: QueryCardProps) {
  return (
    <div
      style={{
        border: "1px solid black",
        backgroundColor: props.isSelected ? "yellow" : "white",
      }}
      onClick={props.selectCallback}
    >
      <div>{props.queryName}</div>
      <div>{props.querySpec}</div>
    </div>
  );
}
