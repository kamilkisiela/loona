import { NgModule, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ApolloFluxModule } from '../apollo-flux';
import { MaterialModule } from '../material/material.module';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { TodosComponent } from './todos/todos.component';
import { RecentTodoComponent } from './recent-todo/recent-todo.component';

const COMPONENTS = [TodoListComponent, TodoFormComponent, TodosComponent];

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [...COMPONENTS, RecentTodoComponent],
  exports: [...COMPONENTS],
})
export class TodosModule {}
