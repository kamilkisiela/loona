import {State, Mutation, OnMutation, Patch, Write} from '@loona/angular';

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
  @Write(todoFragment)
  add(_, args) {
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
  @Patch(todoFragment, ({id}) => `Todo:${id}`)
  toggle(todo) {
    todo.completed = !todo.completed;
  }

  @OnMutation(ToggleTodo)
  @Patch(activeTodos)
  popTodoFromActive(state, info) {
    const todo = info.result;

    if (todo.completed) {
      if (!state.active) {
        state.active = [];
      }

      state.active = state.active.filter(o => o.id !== todo.id);
    }
  }

  @OnMutation(ToggleTodo)
  @Patch(activeTodos)
  pushTodoFromActive(state, info) {
    const todo = info.result;

    if (!todo.completed) {
      if (!state.active) {
        state.active = [];
      }

      state.active = state.active.concat([todo]);
    }
  }

  @OnMutation(ToggleTodo)
  @Patch(completedTodos)
  popTodoFromCompleted(state, info) {
    const todo = info.result;

    if (!todo.completed) {
      if (!state.completed) {
        state.completed = [];
      }

      state.completed = state.completed.filter(o => o.id !== todo.id);
    }
  }

  @OnMutation(ToggleTodo)
  @Patch(completedTodos)
  pushTodoFromCompleted(state, info) {
    const todo = info.result;

    if (todo.completed) {
      if (!state.completed) {
        state.completed = [];
      }

      state.completed = state.completed.concat([todo]);
    }
  }

  @OnMutation(AddTodo)
  @Patch(activeTodos)
  updateActivateOnAdd(state, info) {
    const todo = info.result;

    if (!state.active) {
      state.active = [];
    }

    state.active = state.active.concat([todo]);
  }
}

// helpers

// function isCompleted(info) {
//   return info.result.completed === true;
// }

// function isActive(info) {
//   return !isCompleted(info);
// }

// function ofMutation(mutation) {
//   return info => info.name === getNameOfMutation(mutation.mutation);
// }

// function all(...funcs: any[]) {
//   return info => funcs.every(fn => fn(info));
// }
