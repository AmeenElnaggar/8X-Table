import { Component, effect, inject } from '@angular/core';
import { ReusableDataTable } from './components/reusable-data-table/reusable-data-table';
import { TableDataService } from './services/table-data.service';

@Component({
  selector: 'app-root',
  imports: [ReusableDataTable],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private tableDataService = inject(TableDataService);

  data = this.tableDataService.data;
  columns = this.tableDataService.columns;
  loading = this.tableDataService.loading;
  error = this.tableDataService.error;

  onCreate(data: any) {
    this.tableDataService.create(data);
  }

  onUpdate(data: any) {
    this.tableDataService.update(data);
  }

  onDelete(id: any) {
    this.tableDataService.delete(id);
  }

  onRowSelect(data: any) {
    console.log('Row selected:', data);
  }
}
