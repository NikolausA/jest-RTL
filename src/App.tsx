import "./styles.css";
import { NewTaskBar } from "./modules/NewTaskBar";
import { TaskList } from "./modules/TaskList";
import { NotifierContainer } from "./modules/NotifierContainer";
import { Filter } from "./components/Filter";

export const App = () => {
  return (
    <div className="root-container">
      <h3>Список задач</h3>
      <NewTaskBar />
      <Filter />
      <TaskList />
      <NotifierContainer />
    </div>
  );
};
