import { Mutation } from '../../apollo-flux';
import { Post } from '../models';

export class UpvotePost implements Mutation {
  name = 'upvote';
  variables: { id: number };
  extra: { post: Post };

  constructor(post: Post) {
    this.variables = { id: post.id };
    this.extra = {
      post,
    };
  }
}
