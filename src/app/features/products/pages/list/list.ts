import {
  Component,
  inject,
  input,
  output,
  TemplateRef,
  viewChild,
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
import { TableDataService } from '../../../../shared/services/table-data.service';

import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TableHeader } from '../../../../shared/components/table-header/table-header';

@Component({
  selector: 'app-list',
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
export class List {
  private tableDataService = inject(TableDataService);

  table = viewChild.required<Table>('dt');

  data = input.required<any[]>();
  columns = input.required<IColumnDefinition[]>();
  customBodyTemplate = input<TemplateRef<any>>();

  create = output<any>();
  update = output<any>();
  delete = output<string>();
  rowSelect = output<any>();

  globalFilterFields = this.tableDataService.globalFilterFields;
  loading = this.tableDataService.loading;

  confirmDelete(code: string) {
    this.delete.emit(code);
  }

  onRowSelectEvent(event: any) {
    this.rowSelect.emit(event.data);
    this.onShowUpdateDialog(event.data);
  }

  onFilterGlobal(value: string) {
    this.table().filterGlobal(value, 'contains');
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
