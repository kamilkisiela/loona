import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {
    path: 'books',
    loadChildren: './books/books.module#BooksModule',
  },
  {
    path: 'notes',
    loadChildren: './notes/notes.module#NotesModule',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'books',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
