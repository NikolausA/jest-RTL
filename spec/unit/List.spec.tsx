import { render, screen } from "@testing-library/react";
import { List } from "src/components/List";
import { taskListSlice } from "../../src/store/taskSlice";

const items: Task[] = [
  {
    id: "1",
    header: "купить хлеб",
    done: false,
  },
  {
    id: "2",
    header: "купить молоко",
    done: false,
  },
  {
    id: "3",
    header: "выгулять собаку",
    done: true,
  },
];

it("отображение списка задач", () => {
  const onDelete = jest.fn();
  const onToggle = jest.fn();

  const { rerender, asFragment } = render(
    <List items={items} onDelete={onDelete} onToggle={onToggle} />
  );
  const firstRender = asFragment();

  items.pop();

  rerender(<List items={items} onDelete={onDelete} onToggle={onToggle} />);
  const secondRender = asFragment();

  expect(firstRender).toMatchDiffSnapshot(secondRender);
});

it("Список содержит не больше 10 невыполненных задач", () => {
  const state = {
    list: Array.from({ length: 10 }, (_, i) => ({
      id: String(i),
      header: `Task ${i}`,
      done: false,
    })),
    hideCompleted: false,
    notification: "",
  };

  const newState = taskListSlice.reducer(
    state,
    taskListSlice.actions.addTask("новая задача")
  );

  expect(newState.list).toHaveLength(10); // не изменилась
  expect(newState.notification).toBe(
    "Нельзя добавить больше 10 невыполненных задач"
  );
});
