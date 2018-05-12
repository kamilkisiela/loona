import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { NetworkService } from '../network.service';

@Component({
  selector: 'app-network-switch',
  templateUrl: './network-switch.component.html',
  styleUrls: ['./network-switch.component.css'],
})
export class NetworkSwitchComponent implements OnInit {
  isOnline: Observable<boolean>;

  constructor(private networkService: NetworkService) {}

  ngOnInit() {
    this.isOnline = this.networkService.isOnline;
  }

  toggle() {
    if (this.networkService.isOnline.getValue()) {
      this.networkService.offline();
    } else {
      this.networkService.online();
    }
  }
}
