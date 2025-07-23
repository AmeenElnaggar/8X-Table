import {
  computed,
  DestroyRef,
  effect,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { IntegrationDataService } from './integration-data.service';
import { ColumnDefinition } from '../interfaces/column.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class TableDataService {
  private integrationDataService = inject(IntegrationDataService);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  private dataSignal = signal<any[]>([]);
  private columnsSignal = signal<ColumnDefinition[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private displayCreateDialogSignal = signal<boolean>(false);
  private displayUpdateDialogSignal = signal<boolean>(false);
  private newRecordSignal = signal<any>({ name: '', email: '' });
  private selectedRecordSignal = signal<any | null>(null);

  public data = computed(() => this.dataSignal());
  public columns = computed(() => this.columnsSignal());
  public loading = computed(() => this.loadingSignal());
  public error = computed(() => this.errorSignal());
  public displayCreateDialog = computed(() => this.displayCreateDialogSignal());
  public displayUpdateDialog = computed(() => this.displayUpdateDialogSignal());
  public newRecord = computed(() => this.newRecordSignal());
  public selectedRecord = computed(() => this.selectedRecordSignal());
  public globalFilterFields = computed(() =>
    this.columns().map((col) => col.field)
  );

  constructor() {
    this.loadData();
    this.loadMetadata();
  }

  private isValidRecord(record: any): boolean {
    return (
      record &&
      Object.keys(record).every((key) => {
        return record[key]?.toString().trim() !== '';
      })
    );
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
      this.integrationDataService.getMetadata(),
      { errorMessage: 'Failed to load metadata' },
      false,
      false,
      (result) => this.columnsSignal.set(result ?? [])
    );
  }

  loadData() {
    this.executeOperation(
      this.integrationDataService.getData(),
      { errorMessage: 'Failed to load data' },
      false,
      true
    );
  }

  // ممكن ندمج الكود هنا ونعمل فانكشن مشتركه
  create(data: any) {
    if (!this.isValidRecord(data)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields',
      });
      return;
    }
    this.executeOperation(this.integrationDataService.create(data), {
      errorMessage: 'Failed to create record',
      successMessage: 'Record created successfully',
    });
    this.displayCreateDialogSignal.set(false);
  }

  update(data: any) {
    if (!this.isValidRecord(data)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields',
      });
      return;
    }
    this.executeOperation(this.integrationDataService.update(data), {
      errorMessage: 'Failed to update record',
      successMessage: 'Record updated successfully',
    });
    this.displayUpdateDialogSignal.set(false);
  }

  delete(code: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.executeOperation(this.integrationDataService.delete(code), {
          errorMessage: 'Failed to delete record',
          successMessage: 'Record delete successfully',
        });
      },
    });
  }

  showCreateDialog() {
    const newRecord: any = {};
    this.columnsSignal()
      .filter((col) => col.field !== 'id')
      .forEach((col) => {
        newRecord[col.field] = col.type === 'number' ? 0 : '';
      });
    this.newRecordSignal.set(newRecord);
    this.displayCreateDialogSignal.set(true);
  }

  hideCreateDialog() {
    this.displayCreateDialogSignal.set(false);
  }

  showUpdateDialog(record: any) {
    this.selectedRecordSignal.set({ ...record });
    this.displayUpdateDialogSignal.set(true);
  }

  hideUpdateDialog() {
    this.displayUpdateDialogSignal.set(false);
  }
}
