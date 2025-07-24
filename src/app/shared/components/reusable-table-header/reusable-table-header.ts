import { Component, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-reusable-table-header',
  imports: [InputTextModule, ButtonModule],
  templateUrl: './reusable-table-header.html',
  styleUrl: './reusable-table-header.css',
})
export class ReusableTableHeader {
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
