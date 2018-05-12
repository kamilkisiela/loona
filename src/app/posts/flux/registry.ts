import gql from 'graphql-tag';

export const upvoteMutation = gql`
  mutation upvotePost($id: Int!) {
    upvotePost(postId: $id) {
      id
      votes
    }
  }
`;

export const UpvoteMutation = {
  name: 'upvote',
  options: {
    mutation: upvoteMutation,
  },
};
