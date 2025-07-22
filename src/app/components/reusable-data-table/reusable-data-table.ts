import { Component, TemplateRef, input, output } from '@angular/core';

import { ColumnDefinition } from '../../interfaces/column.model';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

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
  ],
  templateUrl: './reusable-data-table.html',
  styleUrl: './reusable-data-table.css',
})
export class ReusableDataTable {
  data = input.required<any[]>();
  columns = input.required<ColumnDefinition[]>();

  create = output<void>();
  update = output<void>();
  delete = output<void>();
  rowSelect = output<void>();
}
