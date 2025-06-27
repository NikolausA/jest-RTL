import { DeleteButton } from "./DeleteButton";

type Props = Task & {
  onDelete: (id: Task["id"]) => void;
  onToggle: (id: Task["id"]) => void;
};

export const Item = ({ id, header, done, onDelete, onToggle }: Props) => {
  const isLong = header.length > 32;
  const displayedHeader = header.trim() === "" ? "Без названия" : header;

  return (
    <li className="item-wrapper">
      <input
        type="checkbox"
        id={id}
        defaultChecked={done}
        onChange={() => onToggle(id)}
      />
      <label
        htmlFor={id}
        className={isLong ? "task-label truncated" : "task-label"}
        title={isLong ? displayedHeader : undefined}
        onClick={() => onToggle(id)}
      >
        {done ? <s>{displayedHeader}</s> : displayedHeader}
      </label>
      <DeleteButton disabled={!done} onClick={() => onDelete(id)} />
    </li>
  );
};
