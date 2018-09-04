import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <p>
      <a routerLink="/books">Books</a> | <a routerLink="/notes">Notes</a>
    </p>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {}
