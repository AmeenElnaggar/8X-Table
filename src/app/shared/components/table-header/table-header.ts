import { Component, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-table-header',
  imports: [InputTextModule, ButtonModule],
  templateUrl: './table-header.html',
  styleUrl: './table-header.css',
})
export class TableHeader {
  createClicked = output<void>();
  searchInput = output<string>();

  onCreateClick() {
    this.createClicked.emit();
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchInput.emit(value);
  }
}
