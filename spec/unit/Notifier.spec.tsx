import { act, render, screen, waitFor } from "@testing-library/react";
import { Notifier } from "src/components/Notifier";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import taskListReducer, { addTask } from "../../src/store/taskSlice";
import { NotifierContainer } from "../../src/modules/NotifierContainer";
import { TaskList } from "../../src/modules/TaskList";
import userEvent from "@testing-library/user-event";

describe("Окно оповещения", () => {
  it("автоматически исчезает с экрана через 2 секунды", async () => {
    const fn = jest.fn();

    render(<Notifier open={true} task="Любая задача" onClose={fn} />);

    jest.runAllTimers();

    expect(fn).toBeCalled();
  });
  it("при выполнении задачи должно появляться оповещение", async () => {
    const fn = jest.fn();

    render(<Notifier open={true} task="Любая задача" onClose={fn} />);

    expect(screen.getByText("Любая задача")).toBeInTheDocument();
  });
  it("одновременно может быть только одно оповещение", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const store = configureStore({ reducer: { taskList: taskListReducer } });
    store.dispatch(addTask("Первая задача"));
    store.dispatch(addTask("Вторая задача"));

    render(
      <Provider store={store}>
        <NotifierContainer />
        <TaskList />
      </Provider>
    );

    await user.click(screen.getByRole("checkbox", { name: "Первая задача" }));

    expect(
      screen.getByText('Задача "Первая задача" завершена')
    ).toBeInTheDocument();

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() =>
      expect(
        screen.queryByText('Задача "Первая задача" завершена')
      ).not.toBeInTheDocument()
    );

    await user.click(screen.getByRole("checkbox", { name: "Вторая задача" }));

    const notifiers = screen.getAllByText('Задача "Вторая задача" завершена', {
      selector: ".notifier-wrapper",
    });

    expect(notifiers).toHaveLength(1);

    expect(notifiers[0]).toBeInTheDocument();

    act(() => {
      jest.runAllTimers();
    });
  });
});
