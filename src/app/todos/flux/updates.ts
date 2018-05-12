import { UpdateFn } from '../../apollo-flux';
import { todosQuery, recentTodoQuery } from './queries';

export const TodosUpdate: UpdateFn = update => {
  if (update.name === 'addTodo') {
    const newTodo = update.result.data.addTodo;
    const previous: any = update.cache.readQuery({ query: todosQuery });
    const data = {
      todos: previous.todos.concat([newTodo]),
    };

    update.cache.writeData({ data });
  }
};

export const RecentTodoUpdate: UpdateFn = update => {
  if (update.name === 'addTodo') {
    const newTodo = update.result.data.addTodo;
    update.cache.writeQuery({
      query: recentTodoQuery,
      data: {
        recentTodo: newTodo,
      },
    });
  }
};
