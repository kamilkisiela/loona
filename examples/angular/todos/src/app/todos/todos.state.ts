import {State, Mutation, Update, Context} from '@loona/angular';

import {AddTodo, ToggleTodo} from './todos.actions';
import {todoFragment, activeTodos, completedTodos} from './todos.graphql';

@State({
  defaults: {
    completed: [],
    active: [],
  },
})
export class TodosState {
  @Mutation(AddTodo)
  add(args) {
    const todo = {
      id: Math.random()
        .toString(16)
        .substr(2),
      text: args.text,
      completed: false,
      __typename: 'Todo',
    };

    return todo;
  }

  @Mutation(ToggleTodo)
  toggle(args, ctx: Context) {
    return ctx.patchFragment(todoFragment, {id: args.id}, data => {
      data.completed = !data.completed;
    });
  }

  @Update(ToggleTodo)
  updateActive(mutation, ctx: Context) {
    const todo = mutation.result;

    ctx.patchQuery(activeTodos, data => {
      if (todo.completed) {
        data.active = data.active.filter(o => o.id !== todo.id);
      } else {
        data.active = data.active.concat([todo]);
      }
    });
  }

  @Update(ToggleTodo)
  updateCompleted(mutation, ctx: Context) {
    const todo = mutation.result;

    ctx.patchQuery(completedTodos, data => {
      if (todo.completed) {
        data.completed = data.completed.concat([todo]);
      } else {
        data.completed = data.completed.filter(o => o.id !== todo.id);
      }
    });
  }

  @Update(AddTodo)
  updateActiveOnAdd(mutation, ctx: Context) {
    const todo = mutation.result;

    ctx.patchQuery(activeTodos, data => {
      data.active = data.active.concat([todo]);
    });
  }
}
