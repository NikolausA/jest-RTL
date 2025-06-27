import { render, screen } from "@testing-library/react";
import { Item } from "src/components/Item";

const item: Task = {
  id: "1",
  header: "купить хлеб",
  done: false,
};

describe("Элемент списка задач", () => {
  it("отрисовывает обрезанный заголовок с подсказкой (tooltip), если длина > 32 символов", () => {
    const onDelete = jest.fn();
    const onToggle = jest.fn();

    const longHeader = "Очень длинное название задачи, больше 32 символов";
    const task = {
      id: "1",
      header: longHeader,
      done: false,
    };

    render(<Item {...task} onDelete={onDelete} onToggle={onToggle} />);

    const label = screen.getByText(/Очень длинное название задачи/i);
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("title", longHeader); // тултип есть
    expect(label).toHaveClass("truncated"); // применён класс
  });
  it("не применяет обрезку и title, если заголовок <= 32 символа", () => {
    const shortHeader = "Купить молоко";
    const task = {
      id: "2",
      header: shortHeader,
      done: false,
    };

    render(<Item {...task} onDelete={jest.fn()} onToggle={jest.fn()} />);

    const label = screen.getByText(shortHeader);
    expect(label).toBeInTheDocument();
    expect(label).not.toHaveAttribute("title");
    expect(label).not.toHaveClass("truncated");
  });
  it("название не должно быть пустым, отображается заглушка", () => {
    const task = {
      id: "2",
      header: "",
      done: false,
    };

    render(<Item {...task} onDelete={jest.fn()} onToggle={jest.fn()} />);

    expect(screen.getByText("Без названия")).toBeInTheDocument();
  });
  it("нельзя удалять невыполненные задачи", () => {
    const task = {
      id: "2",
      header: "Купить молоко",
      done: false,
    };

    render(<Item {...task} onDelete={jest.fn()} onToggle={jest.fn()} />);

    const deleteBtn = screen.getByRole("button");

    expect(deleteBtn).toBeDisabled();
  });
});
