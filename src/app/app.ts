import { Component, effect, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TableStore } from './store/table.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  store = inject(TableStore);

  constructor() {
    effect(() => {
      console.log(this.store.recordHistory());
    });
  }
}
