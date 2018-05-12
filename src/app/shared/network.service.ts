import { Injectable, InjectionToken, Inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface NetworkGate {
  open(): void;
  close(): void;
}

export const NetworkGate = new InjectionToken<NetworkGate>(
  '[app] network-gate',
);

@Injectable()
export class NetworkService implements OnInit {
  isOnline = new BehaviorSubject<boolean>(true);

  constructor(@Inject(NetworkGate) private gate: NetworkGate) {}

  ngOnInit() {
    window.addEventListener('online', () => this.online());
    window.addEventListener('offline', () => this.offline());
  }

  online() {
    this.gate.open();
    this.isOnline.next(true);
  }

  offline() {
    this.gate.close();
    this.isOnline.next(false);
  }
}
