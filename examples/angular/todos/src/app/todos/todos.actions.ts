import {toggleTodo, addTodo} from './todos.graphql';

export class AddTodo {
  static mutation = addTodo;

  variables: {text: string};

  constructor(text: string) {
    this.variables = {
      text,
    };
  }
}

export class ToggleTodo {
  static mutation = toggleTodo;

  variables: {id: string};

  constructor(id: string) {
    this.variables = {
      id,
    };
  }
}
