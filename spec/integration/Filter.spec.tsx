// - Подготовка тест-сьюта
// - Виртуальный рендер компонента
// - Поиск элемента
// - Взаимодействие с элементом
// - Проверка результата
import { render, screen, waitFor } from "@testing-library/react";
import ue from "@testing-library/user-event";
import { App } from "src/App";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { taskListSlice } from "../../src/store/taskSlice";
import { tasksSelector } from "../../src/store/taskSlice";

const createTestStore = (initialTasks: Task[] = []) => {
  return configureStore({
    reducer: {
      taskList: taskListSlice.reducer,
    },
    preloadedState: {
      taskList: {
        list: initialTasks,
        hideCompleted: false,
        notification: "",
      },
    },
  });
};

const mockTasks: Task[] = [
  { id: "1", header: "Задача 1", done: false },
  { id: "2", header: "Задача 2", done: true },
  { id: "3", header: "Задача 3", done: false },
  { id: "4", header: "Задача 4", done: true },
];

const userEvent = ue.setup({
  advanceTimers: jest.advanceTimersByTime,
});

describe("Список задач", () => {
  // не содержит выполненные задачи
  // после нажатия на кнопку фильтрации
  it("с включенным фильтром", async () => {
    const testStore = createTestStore(mockTasks);

    render(
      <Provider store={testStore}>
        <App />
      </Provider>
    );

    const filterBtn = screen.getByRole("button", {
      name: "Скрыть выполненные",
    });

    await userEvent.click(filterBtn);

    await waitFor(() => {
      expect(screen.queryByText("Задача 2")).not.toBeInTheDocument();
      expect(screen.queryByText("Задача 4")).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Задача 1")).toBeInTheDocument();
    expect(screen.queryByText("Задача 3")).toBeInTheDocument();

    expect(filterBtn).toHaveTextContent("Показать все задачи");
  });

  it("с выключенным фильтром", async () => {
    const testStore = createTestStore(mockTasks);

    render(
      <Provider store={testStore}>
        <App />
      </Provider>
    );

    const filterBtn = screen.getByRole("button", {
      name: "Скрыть выполненные",
    });

    await userEvent.click(filterBtn);
    await userEvent.click(filterBtn);

    expect(screen.getByText("Задача 1")).toBeInTheDocument();
    expect(screen.getByText("Задача 2")).toBeInTheDocument();
    expect(screen.getByText("Задача 3")).toBeInTheDocument();
    expect(screen.getByText("Задача 4")).toBeInTheDocument();

    expect(filterBtn).toHaveTextContent("Скрыть выполненные");
  });
  // с включенным фильтром при клике на задачу она удаляется из вывода
  it("с включенным фильтром", async () => {
    const testStore = createTestStore(mockTasks);

    render(
      <Provider store={testStore}>
        <App />
      </Provider>
    );

    const filterBtn = screen.getByRole("button", {
      name: "Скрыть выполненные",
    });

    await userEvent.click(filterBtn);

    await waitFor(() => {
      expect(screen.queryByText("Задача 2")).not.toBeInTheDocument();
      expect(screen.queryByText("Задача 4")).not.toBeInTheDocument();
    });

    const checkBtn = screen.getByRole("checkbox", { name: "Задача 1" });

    await userEvent.click(checkBtn);

    await waitFor(() => {
      expect(screen.queryByText("Задача 1")).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Задача 3")).toBeInTheDocument();

    expect(filterBtn).toHaveTextContent("Показать все задачи");
  });
});
