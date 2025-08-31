import {
  Component,
  ViewChild,
  TemplateRef,
  inject,
  viewChild,
  output,
} from '@angular/core';
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
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TableHeader } from '../../../../shared/components/table-header/table-header';
import { TableStore } from '../../../../store/table.store';

@Component({
  selector: 'app-list',
  standalone: true,
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
    TableHeader,
  ],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class OrdersList {
  private tableStore = inject(TableStore);

  table = viewChild.required<Table>('dt');

  records = this.tableStore.records;
  columns = this.tableStore.columns;
  loading = this.tableStore.isLoading;
  error = this.tableStore.error;

  ngOnInit() {
    this.tableStore.setContext('orders');
    this.tableStore.setEndpoints({
      data: 'orders-data',
      metadata: 'orders-metadata',
    });
    this.tableStore.loadData();
    this.tableStore.loadMetadata();
  }

  confirmDelete(code: string) {
    this.tableStore.deleteRecord(code);
  }

  onRowSelectEvent(event: any) {
    this.onShowUpdateDialog(event.data);
  }

  onFilterGlobal(value: string) {
    this.table().filterGlobal(value, 'contains');
  }

  onShowCreateDialog() {
    const ref = this.tableStore.showCreateDialog();
    ref.onClose.subscribe((result) => {
      if (result) {
        this.tableStore.create(result);
      }
    });
  }

  onShowUpdateDialog(record: any) {
    const ref = this.tableStore.showUpdateDialog(record);
    ref.onClose.subscribe((result) => {
      if (result) {
        this.tableStore.update(result);
      }
    });
  }

  onShowViewDialog(record: any) {
    const ref = this.tableStore.showViewDialog(record);
    ref.onClose.subscribe((result) => {
      if (result) {
        console.log('View Dialog closed with result:', result);
      }
    });
  }
}
