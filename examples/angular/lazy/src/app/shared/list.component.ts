import {Component, Input} from '@angular/core';

export interface ListItem {
  title: string;
  subtitle: string;
}

@Component({
  selector: 'list',
  template: `
    <mat-list>
      <h3 mat-subheader>{{title}}</h3>
      <mat-list-item *ngFor="let item of list">
        <h4 mat-line>{{item.title}}</h4>
        <p mat-line> {{item.subtitle}} </p>
      </mat-list-item>
      <mat-divider></mat-divider>
    </mat-list>
  `,
})
export class ListComponent {
  @Input()
  public list: Array<ListItem> = [];
  @Input()
  public title: string;
}
