import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./configureStore";

export interface taskListState {
  list: Task[];
  hideCompleted: boolean;
  notification: string;
}

const initialState: taskListState = {
  list: [],
  hideCompleted: false,
  notification: "",
};

export const taskListSlice = createSlice({
  name: "taskList",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task["header"]>) => {
      const uncompleted = state.list.filter((t) => !t.done);

      if (uncompleted.length >= 10) {
        state.notification = "Нельзя добавить больше 10 невыполненных задач";
        return;
      }

      state.list.push({
        id: crypto.randomUUID(),
        header: action.payload,
        done: false,
      });
    },
    completeTask: (state, action: PayloadAction<Task["id"]>) => {
      const task = state.list.find((x) => x.id === action.payload);

      if (task) {
        task.done = true;
      }
    },
    toggleTask: (state, action: PayloadAction<Task["id"]>) => {
      const task = state.list.find((x) => x.id === action.payload);

      if (task) {
        task.done = !task.done;

        if (task.done) {
          state.notification = `Задача "${task.header}" завершена`;
        }
      }
    },
    deleteTask: (state, action: PayloadAction<Task["id"]>) => {
      state.list = state.list.filter((x) => x.id !== action.payload);
    },
    toggleFilter: (state, action: PayloadAction) => {
      state.hideCompleted = !state.hideCompleted;
    },
    setNotification: (state, action: PayloadAction<Task["header"]>) => {
      state.notification = `Задача "${action.payload}" завершена`;
    },
    clearNotification: (state) => {
      state.notification = "";
    },
  },
});

export const {
  addTask,
  completeTask,
  deleteTask,
  toggleTask,
  toggleFilter,
  clearNotification,
} = taskListSlice.actions;

export default taskListSlice.reducer;

export const tasksSelector = (state: RootState) => {
  const { list, hideCompleted } = state.taskList;

  if (hideCompleted) {
    return list.filter((item) => item.done === false);
  }

  return list;
};

export const hideCompletedSelector = (state: RootState) =>
  state.taskList.hideCompleted;

export const fullCount = (state: RootState) => state.taskList.list.length;

export const completeCount = (state: RootState) =>
  state.taskList.list.filter((x) => x.done).length;

export const uncompleteCount = (state: RootState) =>
  state.taskList.list.filter((x) => !x.done).length;

export const getNotification = (state: RootState) =>
  state.taskList.notification;
