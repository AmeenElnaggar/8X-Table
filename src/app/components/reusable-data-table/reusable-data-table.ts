import {
  Component,
  inject,
  input,
  output,
  viewChild,
  ViewChild,
} from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableDataService } from '../../services/table-data.service';
import { ColumnDefinition } from '../../interfaces/column.model';

@Component({
  selector: 'app-reusable-data-table',
  standalone: true,
  imports: [
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressSpinnerModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    CommonModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './reusable-data-table.html',
  styleUrl: './reusable-data-table.css',
})
export class ReusableDataTable {
  private tableDataService = inject(TableDataService);

  data = input.required<any[]>();
  columns = input.required<ColumnDefinition[]>();
  create = output<any>();
  update = output<any>();
  delete = output<string>();
  rowSelect = output<any>();

  displayCreateDialog = this.tableDataService.displayCreateDialog;
  displayUpdateDialog = this.tableDataService.displayUpdateDialog;
  newRecord = this.tableDataService.newRecord;
  selectedRecord = this.tableDataService.selectedRecord;
  globalFilterFields = this.tableDataService.globalFilterFields;

  table = viewChild.required<Table>('dt');

  showCreateDialog() {
    this.tableDataService.showCreateDialog();
  }

  hideCreateDialog() {
    this.tableDataService.hideCreateDialog();
  }

  showUpdateDialog(record: any) {
    console.log(record);
    this.tableDataService.showUpdateDialog(record);
  }

  hideUpdateDialog() {
    this.tableDataService.hideUpdateDialog();
  }

  saveNewRecord() {
    this.create.emit(this.newRecord());
  }

  saveUpdatedRecord() {
    this.update.emit(this.selectedRecord());
  }

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
}
