import { Component } from '@angular/core';
import { RealtimeService } from '../services/realtime.service';

@Component({
  selector: 'app-users-counter',
  templateUrl: './users-counter.component.html',
  styleUrls: ['./users-counter.component.scss'],
})
export class UsersCounterComponent {
  counter: Number;
  constructor(private service: RealtimeService) {}

  ngOnInit(): void {
    this.service.currentCounter.subscribe(
      (counter) => (this.counter = counter)
    );
  }
}
