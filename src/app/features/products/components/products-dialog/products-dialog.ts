import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableDataService } from '../../../../shared/services/table-data.service';
import { MessageService } from 'primeng/api';
import { IColumnDefinition } from '../../../../shared/interfaces/column-definition.model';

@Component({
  selector: 'app-products-dialog',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './products-dialog.html',
  styleUrl: './products-dialog.css',
})
export class ProductsDialog {
  private config = inject(DynamicDialogConfig);
  private dialogRef = inject(DynamicDialogRef);
  private messageService = inject(MessageService);

  record = signal<any>({});
  columns = signal<IColumnDefinition[]>([]);
  mode = signal<'create' | 'update'>('create');

  ngOnInit() {
    this.columns.set(this.config.data.columns);
    this.mode.set(this.config.data.mode);

    this.record.set(
      this.config.data.record
        ? { ...this.config.data.record }
        : this.createEmptyRecord()
    );
  }

  private isValidRecord(record: any): boolean {
    return (
      record &&
      Object.keys(record).every((key) => {
        return record[key]?.toString().trim() !== '';
      })
    );
  }

  createEmptyRecord() {
    const empty: any = {};
    for (const col of this.columns()) {
      if (col.field !== 'id') empty[col.field] = '';
    }
    return empty;
  }

  save() {
    if (!this.isValidRecord(this.record())) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields',
      });
      return;
    }
    this.dialogRef.close(this.record());
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
