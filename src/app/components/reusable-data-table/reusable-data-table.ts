import {
  Component,
  ElementRef,
  TemplateRef,
  inject,
  input,
  output,
  signal,
  WritableSignal,
} from '@angular/core';

import { ColumnDefinition } from '../../interfaces/column.model';

import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TableDataService } from '../../services/table-data.service';

@Component({
  selector: 'app-reusable-data-table',
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
    IconField,
    InputIcon,
  ],
  templateUrl: './reusable-data-table.html',
  styleUrl: './reusable-data-table.css',
  providers: [MessageService, ConfirmationService],
})
export class ReusableDataTable {
  private tableDataService = inject(TableDataService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  data = input.required<any[]>();
  columns = input.required<ColumnDefinition[]>();
  create = output<void>();
  update = output<void>();
  delete = output<number>();
  rowSelect = output<void>();

  displayCreateDialog = signal<boolean>(false);
  displayUpdateDialog = signal<boolean>(false);
  newRecord = signal<any>({ name: '', email: '' });
  selectedRecord = signal<any>(null);

  showCreateDialog() {
    this.newRecord.set({ name: '', email: '' });
    this.displayCreateDialog.set(true);
  }

  hideCreateDialog() {
    this.displayCreateDialog.set(false);
  }

  showUpdateDialog(record: any) {
    this.selectedRecord.set({ ...record });
    this.displayUpdateDialog.set(true);
  }

  hideUpdateDialog() {
    this.displayUpdateDialog.set(false);
  }

  private handleAction(
    action: 'create' | 'update' | 'delete',
    data: any,
    dialogSignal?: WritableSignal<boolean>
  ) {
    if (action !== 'delete' && !this.isValidRecord(data)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields',
      });
      return;
    }

    const messages = {
      create: {
        success: 'Record created successfully',
        error: 'Failed to create record',
      },
      update: {
        success: 'Record updated successfully',
        error: 'Failed to update record',
      },
      delete: {
        success: 'Record deleted successfully',
        error: 'Failed to delete record',
      },
    };

    if (action === 'create') {
      this.create.emit(data);
    } else if (action === 'update') {
      this.update.emit(data);
    } else if (action === 'delete') {
      this.delete.emit(data);
    }

    if (dialogSignal) {
      dialogSignal.set(false);
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: messages[action].success,
    });
  }

  saveNewRecord() {
    this.handleAction('create', this.newRecord(), this.displayCreateDialog);
  }

  saveUpdatedRecord() {
    this.handleAction(
      'update',
      this.selectedRecord(),
      this.displayUpdateDialog
    );
  }

  confirmDelete(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.handleAction('delete', id);
      },
    });
  }

  // دول لسه مش عارف هعمل بيهم اي
  private isValidRecord(record: any): boolean {
    return record.name.trim() !== '' && record.email.trim() !== '';
  }

  // دي بتاعت السرش الجلوبال
  onFilterGlobal(event: Event, dt: any) {
    const input = event.target as HTMLInputElement;
    if (input) {
      dt.filterGlobal(input.value, 'contains');
    }
  }
}
