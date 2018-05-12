import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { Todo } from '../models';

const recentTodoQuery = gql`
  {
    recentTodo @client {
      id
      completed
      text
    }
  }
`;

const todosQuery = gql`
  {
    todos @client {
      id
      completed
      text
    }
  }
`;

const addTodoMutation = gql`
  mutation addTodo($text: String!) {
    addTodo(text: $text) @client {
      id
      completed
      text
    }
  }
`;

const toggleTodoMutation = gql`
  mutation toggleTodo($id: Int!) {
    toggleTodo(id: $id) @client {
      id
    }
  }
`;

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  todos: Observable<Todo[]>;
  recentTodo: Observable<Todo>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    // TODO: this needs to be updated after addTodo mutation
    this.todos = this.apollo
      .watchQuery<{ todos: Todo[] }>({
        query: todosQuery,
      })
      .valueChanges.pipe(map(result => result.data.todos));

    // TODO: this needs to be updated after addTodo mutation
    this.recentTodo = this.apollo
      .watchQuery<{ recentTodo: Todo }>({
        query: recentTodoQuery,
      })
      .valueChanges.pipe(map(result => result.data.recentTodo));
  }

  onTodo(text: string) {
    this.apollo
      .mutate({
        mutation: addTodoMutation,
        variables: {
          text,
        },
        update: (cache, result) => {
          const newTodo = result.data.addTodo;

          // TODO: this goes as part of a middlewares
          cache.writeQuery({
            query: recentTodoQuery,
            data: {
              recentTodo: newTodo,
            },
          });

          // TODO: this goes as part of a middlewares
          const previous: any = cache.readQuery({ query: todosQuery });
          const data = {
            todos: previous.todos.concat([newTodo]),
          };
          cache.writeData({ data });
        },
      })
      .subscribe();
  }

  onToggle(todo: Todo) {
    this.apollo
      .mutate({
        mutation: toggleTodoMutation,
        variables: {
          id: todo.id,
        },
      })
      .subscribe();
  }
}
