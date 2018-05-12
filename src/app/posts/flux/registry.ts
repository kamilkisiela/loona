import gql from 'graphql-tag';

import { MutationDef } from '../../apollo-flux';
import { UpvotePost } from './mutations';

export const upvoteMutation = gql`
  mutation upvotePost($id: Int!) {
    upvotePost(postId: $id) {
      id
      votes
    }
  }
`;

export const UpvoteMutation: MutationDef = {
  name: 'upvote',
  options: (mutation: UpvotePost) => ({
    mutation: upvoteMutation,
    optimisticResponse: {
      upvotePost: {
        id: mutation.extra.post.id,
        votes: mutation.extra.post.votes + 1,
        __typename: 'Post',
      },
    },
  }),
};
