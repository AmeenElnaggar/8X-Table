import { Component, inject } from '@angular/core';

import { TableDataService } from '../../services/table-data.service';
import { ProductsTable } from '../../../features/products/pages/products-table/products-table';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [ProductsTable],
  templateUrl: './reusable-table.html',
  styleUrl: './reusable-table.css',
})
export class ReusableTable {
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
