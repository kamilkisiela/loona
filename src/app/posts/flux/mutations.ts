import { Mutation } from '../../apollo-flux';

export class UpvoteMutation implements Mutation {
  name = 'upvote';
  variables: { id: number };

  constructor(id: number) {
    this.variables = { id };
  }
}
