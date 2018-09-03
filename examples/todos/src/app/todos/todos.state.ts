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
        .toString(32)
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
  popTodoFromActive(mutation, ctx: Context) {
    const todo = mutation.result;

    if (todo.completed) {
      ctx.patchQuery(activeTodos, data => {
        if (!data.active) {
          data.active = [];
        }

        data.active = data.active.filter(o => o.id !== todo.id);
      });
    }
  }

  @Update(ToggleTodo)
  pushTodoFromActive(mutation, ctx: Context) {
    const todo = mutation.result;

    if (!todo.completed) {
      ctx.patchQuery(activeTodos, data => {
        if (!data.active) {
          data.active = [];
        }

        data.active = data.active.concat([todo]);
      });
    }
  }

  @Update(ToggleTodo)
  popTodoFromCompleted(mutation, ctx: Context) {
    const todo = mutation.result;

    if (!todo.completed) {
      ctx.patchQuery(completedTodos, data => {
        if (!data.completed) {
          data.completed = [];
        }

        data.completed = data.completed.filter(o => o.id !== todo.id);
      });
    }
  }

  @Update(ToggleTodo)
  pushTodoFromCompleted(mutation, ctx: Context) {
    const todo = mutation.result;

    if (todo.completed) {
      ctx.patchQuery(completedTodos, data => {
        if (!data.completed) {
          data.completed = [];
        }

        data.completed = data.completed.concat([todo]);
      });
    }
  }

  @Update(AddTodo)
  updateActiveOnAdd(mutation, ctx: Context) {
    const todo = mutation.result;

    ctx.patchQuery(activeTodos, data => {
      if (!data.active) {
        data.active = [];
      }

      data.active = data.active.concat([todo]);
    });
  }
}
