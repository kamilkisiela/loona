import {toggleTodo, addTodo} from './todos.graphql';

export class AddTodo {
  static mutation = addTodo;
  variables: any;
  constructor(text: string) {
    this.variables = {
      text,
    };
  }
}

export class ToggleTodo {
  static mutation = toggleTodo;
  variables: any;
  constructor(id: string) {
    this.variables = {
      id,
    };
  }
}
