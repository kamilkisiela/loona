import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class Dispatcher extends Subject<any> implements OnDestroy {
  complete() {}

  ngOnDestroy() {
    super.complete();
  }
}
