import { Mutation } from '../../apollo-flux';

export class AddTodo implements Mutation {
  name = 'addTodo';
  variables: { text: string };

  constructor(text: string) {
    this.variables = { text };
  }
}

export class ToggleTodo implements Mutation {
  name = 'toggleTodo';
  variables: { id: string };

  constructor(id: string) {
    this.variables = { id };
  }
}
