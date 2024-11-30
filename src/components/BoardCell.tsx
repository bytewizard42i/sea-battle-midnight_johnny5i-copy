function BoardCell(props: {
  id: number;
  hit: boolean;
  miss: boolean;
  fire: any;
}) {
  const className = `${props.hit ? "hit" : ""} ${props.miss ? "miss" : ""}`;
  return (
    <td onClick={() => props.fire(props.id)}>
      <div id={props.id.toString()} className={className}></div>
    </td>
  );
}

export default BoardCell;
