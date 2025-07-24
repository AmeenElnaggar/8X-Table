import { Component, inject, input, output, viewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IColumnDefinition } from '../../../../shared/interfaces/column-definition.model';
import { TableDataService } from '../../../../shared/services/table-data.service';

import { DynamicDialogModule } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-products-table',
  imports: [
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    CommonModule,
    IconFieldModule,
    InputIconModule,
    DynamicDialogModule,
  ],
  templateUrl: './products-table.html',
  styleUrl: './products-table.css',
})
export class ProductsTable {
  private tableDataService = inject(TableDataService);

  data = input.required<any[]>();
  columns = input.required<IColumnDefinition[]>();
  create = output<any>();
  update = output<any>();
  delete = output<string>();
  rowSelect = output<any>();

  table = viewChild.required<Table>('dt');
  globalFilterFields = this.tableDataService.globalFilterFields;
  loading = this.tableDataService.loading;

  confirmDelete(code: string) {
    this.delete.emit(code);
  }

  onRowSelectEvent(event: any) {
    this.rowSelect.emit(event.data);
  }

  onFilterGlobal(event: Event) {
    const input = event.target as HTMLInputElement;
    this.table().filterGlobal(input.value, 'contains');
  }

  onShowCreateDialog() {
    const ref = this.tableDataService.showCreateDialog(this.columns());
    ref.onClose.subscribe((result) => {
      if (result) {
        this.create.emit(result);
      }
    });
  }

  onShowUpdateDialog(record: any) {
    const ref = this.tableDataService.showUpdateDialog(this.columns(), record);
    ref.onClose.subscribe((result) => {
      if (result) {
        this.update.emit(result);
      }
    });
  }
}
