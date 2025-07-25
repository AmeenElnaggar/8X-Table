import { Component, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IColumnDefinition } from '../../interfaces/column-definition.model';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-table-dialog',
  imports: [FormsModule, InputTextModule, ButtonModule],
  templateUrl: './table-dialog.html',
  styleUrl: './table-dialog.css',
})
export class TableDialog {
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
