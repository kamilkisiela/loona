import { Mutation } from '../../apollo-flux';

export class AddTodoMutation implements Mutation {
  name = 'addTodo';
  variables: { text: string };

  constructor(text: string) {
    this.variables = { text };
  }
}

export class ToggleTodoMutation implements Mutation {
  name = 'toggleTodo';
  variables: { id: number };

  constructor(id: number) {
    this.variables = { id };
  }
}
