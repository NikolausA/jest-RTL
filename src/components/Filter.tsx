import { useDispatch, useSelector } from "react-redux";
import { setFilter, filterSelector } from "src/store/taskSlice";

export type FilterType = "all" | "completed" | "active";

export const Filter = () => {
  const currentFilter = useSelector(filterSelector);
  const dispatch = useDispatch();

  const handleFilterChange = (filter: FilterType) => {
    dispatch(setFilter(filter));
  };

  const filterOptions = [
    { value: "all" as const, label: "Все задачи" },
    { value: "completed" as const, label: "Выполненные" },
    { value: "active" as const, label: "Невыполненные" },
  ];

  return (
    <div className="filter">
      {filterOptions.map(({ value, label }) => (
        <button
          key={value}
          className={`filter-btn ${currentFilter === value ? "active" : ""}`}
          onClick={() => handleFilterChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
