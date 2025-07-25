import { Component, inject } from '@angular/core';

import { TableDataService } from '../../services/table-data.service';
import { List } from '../../../features/products/pages/list/list';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [List],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
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
