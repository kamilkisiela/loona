import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material';

import {GraphQLModule} from './graphql.module';
import {AppComponent} from './app.component';
import {TodosListComponent} from './todos/todos-list.component';
import {AddTodoComponent} from './todos/add-todo.component';

@NgModule({
  declarations: [AppComponent, TodosListComponent, AddTodoComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    GraphQLModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
