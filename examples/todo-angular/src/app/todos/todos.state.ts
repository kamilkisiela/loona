import {State, Mutation, Update} from '@loona/angular';
import {
  WriteFragment,
  UpdateFragment,
  UpdateQuery,
  getNameOfMutation,
} from '@loona/core';

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
  @WriteFragment(todoFragment)
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
  @UpdateFragment(todoFragment, ({id}) => `Todo:${id}`)
  toggle(todo) {
    todo.completed = !todo.completed;
  }

  @Update(all(ofMutation(ToggleTodo), isCompleted))
  @UpdateQuery(activeTodos)
  popTodoFromActive(state, info) {
    const todo = info.result;

    if (!state.active) {
      state.active = [];
    }

    state.active = state.active.filter(o => o.id !== todo.id);
  }

  @Update(all(ofMutation(ToggleTodo), isActive))
  @UpdateQuery(activeTodos)
  pushTodoFromActive(state, info) {
    const todo = info.result;

    if (!state.active) {
      state.active = [];
    }

    state.active = state.active.concat([todo]);
  }

  @Update(all(ofMutation(ToggleTodo), isActive))
  @UpdateQuery(completedTodos)
  popTodoFromCompleted(state, info) {
    const todo = info.result;

    if (!state.completed) {
      state.completed = [];
    }

    state.completed = state.completed.filter(o => o.id !== todo.id);
  }

  @Update(all(ofMutation(ToggleTodo), isCompleted))
  @UpdateQuery(completedTodos)
  pushTodoFromCompleted(state, info) {
    const todo = info.result;

    if (!state.completed) {
      state.completed = [];
    }

    state.completed = state.completed.concat([todo]);
  }

  @Update(ofMutation(AddTodo))
  @UpdateQuery(activeTodos)
  updateActivateOnAdd(state, info) {
    const todo = info.result;

    if (!state.active) {
      state.active = [];
    }

    state.active = state.active.concat([todo]);
  }
}

// helpers

function isCompleted(info) {
  return info.result.completed === true;
}

function isActive(info) {
  return !isCompleted(info);
}

function ofMutation(mutation) {
  return info => info.name === getNameOfMutation(mutation.mutation);
}

function all(...funcs: any[]) {
  return info => funcs.every(fn => fn(info));
}
