import {State, Mutation} from '@loona/angular';

import {AddTodo, ToggleTodo} from './todos.actions';
import {todoFragment, activeTodos, completedTodos} from './todos.graphql';

@State({
  defaults: {
    completed: [],
    active: [],
  },
  typeDefs: `
    type Todo {
      id: ID!
      text: String!
      completed: Boolean!
    }

    type Mutation {
      addTodo(text: String!): Todo
      toggleTodo(id: ID!): Todo
    }

    type Query {
      active: [Todo]
      completed: [Todo]
    }
  `,
})
export class TodosState {
  @Mutation(AddTodo)
  add(_, {text}, {cache}) {
    const todo = {
      id: Math.random()
        .toString(32)
        .substr(2),
      text,
      completed: false,
      __typename: 'Todo',
    };

    cache.writeFragment({
      fragment: todoFragment,
      id: `Todo:${todo.id}`,
      data: todo,
    });

    // updates
    this.updateActivateOnAdd(todo, {cache});

    return todo;
  }

  @Mutation(ToggleTodo)
  toggle(_, {id}, {cache}) {
    const todo = cache.readFragment({
      id: `Todo:${id}`,
      fragment: todoFragment,
    });

    todo.completed = !todo.completed;

    cache.writeFragment({
      id: `Todo:${id}`,
      fragment: todoFragment,
      data: todo,
    });

    // updates
    this.updateActiveOnToggle(todo, {cache});
    this.updateCompletedOnToggle(todo, {cache});

    return todo;
  }

  updateActiveOnToggle(todo, context) {
    const active = context.cache.readQuery({query: activeTodos});

    if (!active.todos) {
      active.todos = [];
    }

    if (todo.completed) {
      context.cache.writeData({
        data: {
          active: active.todos.filter(o => o.id !== todo.id),
        },
      });
    } else {
      context.cache.writeData({
        data: {
          active: active.todos.concat([todo]),
        },
      });
    }
  }

  updateCompletedOnToggle(todo, context) {
    const completed = context.cache.readQuery({query: completedTodos});

    if (!completed.todos) {
      completed.todos = [];
    }

    if (todo.completed) {
      context.cache.writeData({
        data: {
          completed: completed.todos.concat([todo]),
        },
      });
    } else {
      context.cache.writeData({
        data: {
          completed: completed.todos.filter(o => o.id !== todo.id),
        },
      });
    }
  }

  updateActivateOnAdd(todo, context) {
    const previous = context.cache.readQuery({query: activeTodos});

    if (!previous.todos) {
      previous.todos = [];
    }

    const data = {
      active: previous.todos.concat([todo]),
    };

    context.cache.writeData({data});
  }
}
