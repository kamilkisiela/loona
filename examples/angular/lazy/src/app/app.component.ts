import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span class="title">Loona example</span>
      <button mat-button routerLink="/books" routerLinkActive="active">/Books</button>
      <button mat-button routerLink="/notes" routerLinkActive="active">/Notes</button>
    </mat-toolbar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .title {
        display: block;
        margin-right: 50px;
      }

      .container {
        padding: 15px;
      }

      button {
        color: #7d88c1;
      }

      .active {
        color: #fff;
      }
    `,
  ],
})
export class AppComponent {}
