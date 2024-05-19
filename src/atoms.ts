import { atom } from 'recoil';

interface Todo {
  type: 'TODO';
  task: string;
}

interface Task {
  type: 'TASK';
  task: string;
  startTime: string;
  endTime: string;
}

export type TodoTask = Todo | Task;

interface TodosState {
  [key: string]: TodoTask[];
}

export const todosState = atom<TodosState>({
  key: 'todosState',
  default: {},
});
