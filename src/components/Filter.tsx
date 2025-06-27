import { useDispatch, useSelector } from "react-redux";
import { toggleFilter, hideCompletedSelector } from "src/store/taskSlice";

export const Filter = () => {
  const hideCompleted = useSelector(hideCompletedSelector);
  const dispatch = useDispatch();

  const handleToggleFilter = () => {
    dispatch(toggleFilter());
  };

  return (
    <div className="filter">
      <button
        className={`filter-btn ${hideCompleted ? "active" : ""}`}
        onClick={handleToggleFilter}
      >
        {hideCompleted ? "Показать все задачи" : "Скрыть выполненные"}
      </button>
    </div>
  );
};
