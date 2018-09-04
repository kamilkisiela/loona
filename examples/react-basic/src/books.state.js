// import gql from 'graphql-tag';

// export class AddBook {
//     static mutation = gql`
//       mutation addBook($title: String!) @client {
//         addBook(title: $title)
//       }
//     `;
  
//     constructor(
//       public variables: {
//         title: string;
//       },
//     ) {}
//   }
  
//   export const allBooks = gql`
//     query allBooks @client {
//       books {
//         id
//         title
//       }
//     }
//   `;
  
//   @State({
//     defaults: {
//       books: [
//         {
//           id: 1,
//           title: 'Book A',
//           __typename: 'Book',
//         },
//       ],
//     },
//   })
//   export class BooksState {
//     @Mutation(AddBook)
//     addBook({title}) {
//       const book = {
//         id: parseInt(
//           Math.random()
//             .toString()
//             .substr(2),
//         ),
//         title,
//         __typename: 'Book',
//       };
  
//       return new Promise((resolve) => {
//         setTimeout(() => {
//         resolve(book);
//         }, 1000);
//       });
//     }
  
//     @Update(AddBook)
//     updateBooks(mutation, {patchQuery}) {
//       patchQuery(allBooks, data => {
//         data.books.push(mutation.result);
//       });
//     }
  
//     @Action(AddBook)
//     onBook() {
//       console.log('book added!');
//       return of({});
//     }
//   }