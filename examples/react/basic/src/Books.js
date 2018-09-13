import React from 'react';
import {Mutation, Query, Action, connect, graphql} from '@loona/react';
import {AddBook, AddRandomBook, allBooks, recentBook} from './books.state';

const ShowActionsView = ({addBook, addRandomBook}) => {
  return (
    <React.Fragment>
      <div>
        <p>
          When dispatching a mutation through 'Action' component, you cannot
          access the result:
        </p>
        <button onClick={() => addBook('from Action')}>Dispatch</button>-
        instead of dispatching an action, it treats mutation as action
      </div>
      <div>
        <p>Action can dispatch Mutation:</p>
        <button onClick={() => addRandomBook()}>Dispatch</button>- dispatches an
        action that dispatches a mutation
      </div>
    </React.Fragment>
  );
};

const mapDispatch = dispatch => ({
  addBook: title => dispatch(new AddBook({title})),
  addRandomBook: () => dispatch(new AddRandomBook()),
});

const ShowActions = connect(mapDispatch)(ShowActionsView);

const ShowMutationView = props => {
  return (
    <button
      onClick={() =>
        props.addBook({
          variables: {
            title: 'from withMutation',
          },
        })
      }
    >
      mutate
    </button>
  );
};

const ShowMutation = graphql(AddBook.mutation, {name: 'addBook'})(
  ShowMutationView,
);

export class Books extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Action>
          {dispatch => (
            <button onClick={() => dispatch(new AddRandomBook())}>
              Dispatch random!
            </button>
          )}
        </Action>
        <ShowActions />
        <ShowMutation />
        <Mutation mutation={AddBook.mutation}>
          {(mutate, {loading}) => (
            <div>
              <p>
                Calling mutation through 'Mutation' component allows you to
                access the result:
              </p>
              <button
                onClick={() =>
                  mutate({
                    variables: {
                      title: 'from Mutation',
                    },
                  })
                }
              >
                Mutate
              </button>
              - calls mutation
              {loading ? <p>Adding a new book</p> : null}
            </div>
          )}
        </Mutation>
        <Query query={recentBook}>
          {({data, loading}) => {
            if (loading) return '';

            if (!data.recentBook) {
              return null;
            }

            return <p>Added book: {data.recentBook.title}</p>;
          }}
        </Query>
        <div>
          <p>Books:</p>
          <Query query={allBooks}>
            {({data, loading}) => {
              if (loading) return 'Loading...';
              return (
                <ul>
                  {data.books.map(book => (
                    <li key={book.id}>{book.title}</li>
                  ))}
                </ul>
              );
            }}
          </Query>
        </div>
      </React.Fragment>
    );
  }
}
