import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { Observable } from 'rxjs';
import { IColumnDefinition } from '../interfaces/column-definition.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BackendService } from '../../core/services/backend.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductsDialog } from '../../features/products/components/products-dialog/products-dialog';

@Injectable({ providedIn: 'root' })
export class TableDataService {
  private backendService = inject(BackendService);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);

  private dataSignal = signal<any[]>([]);
  private columnsSignal = signal<IColumnDefinition[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  public data = computed(() => this.dataSignal());
  public columns = computed(() => this.columnsSignal());
  public loading = computed(() => this.loadingSignal());
  public error = computed(() => this.errorSignal());
  public globalFilterFields = computed(() =>
    this.columns().map((col) => col.field)
  );

  constructor() {
    this.loadData();
    this.loadMetadata();
  }

  private executeOperation(
    operation: Observable<any>,
    messages: { errorMessage: string; successMessage?: string },
    reloadData: boolean = true,
    isGetData: boolean = false,
    onSuccess?: (result: any) => void
  ) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    operation.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        this.loadingSignal.set(false);

        if (onSuccess) {
          onSuccess(result);
        }

        if (isGetData) {
          this.dataSignal.set(result ?? []);
        }

        if (result && reloadData) {
          this.loadData();
        }

        if (messages.successMessage) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: messages.successMessage,
          });
        }
      },
      error: (err: Error) => {
        this.errorSignal.set(messages.errorMessage);
        this.loadingSignal.set(false);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: messages.errorMessage,
        });
      },
    });
  }

  loadMetadata() {
    this.executeOperation(
      this.backendService.getMetadata(),
      { errorMessage: 'Failed to load metadata' },
      false,
      false,
      (result) => this.columnsSignal.set(result ?? [])
    );
  }

  loadData() {
    this.executeOperation(
      this.backendService.getData(),
      { errorMessage: 'Failed to load data' },
      false,
      true
    );
  }

  create(data: any) {
    this.executeOperation(this.backendService.create(data), {
      errorMessage: 'Failed to create record',
      successMessage: 'Record created successfully',
    });
  }

  update(data: any) {
    this.executeOperation(this.backendService.update(data), {
      errorMessage: 'Failed to update record',
      successMessage: 'Record updated successfully',
    });
  }

  delete(code: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.executeOperation(this.backendService.delete(code), {
          errorMessage: 'Failed to delete record',
          successMessage: 'Record delete successfully',
        });
      },
    });
  }

  showCreateDialog(columns: IColumnDefinition[]) {
    return this.dialogService.open(ProductsDialog, {
      header: 'Create New Record',
      width: '300px',
      data: {
        mode: 'create',
        columns: columns,
      },
      modal: true,
    });
  }

  showUpdateDialog(columns: IColumnDefinition[], record: any) {
    return this.dialogService.open(ProductsDialog, {
      header: 'Update Record',
      width: '300px',
      data: {
        mode: 'update',
        columns: columns,
        record: record,
      },
      modal: true,
    });
  }
}
