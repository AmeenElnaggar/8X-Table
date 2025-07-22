import {
  computed,
  DestroyRef,
  effect,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
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
  private columnsSignal = signal<ColumnDefinition[]>([
    { field: 'id', header: 'ID', sortable: true },
    { field: 'name', header: 'Name', sortable: false, filterable: true },
    { field: 'email', header: 'Email', sortable: false, filterable: true },
    { field: 'actions', header: 'Actions' },
  ]);
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

  constructor() {
    this.loadData();
  }

  private isValidRecord(record: any): boolean {
    return record['name']?.trim() !== '' && record['email']?.trim() !== '';
  }

  private executeOperation(
    operation: Observable<any>,
    errorMessage: string,
    reloadData: boolean = true,
    isGetData: boolean = false
  ) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    operation
      .pipe(
        catchError((err) => {
          this.errorSignal.set(errorMessage);
          this.loadingSignal.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
          });
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (result) => {
          if (isGetData) {
            this.dataSignal.set(result ?? []);
          }
          if (result && reloadData) {
            this.loadData();
          }
          this.loadingSignal.set(false);
        },
      });
  }

  loadData() {
    this.executeOperation(
      this.integrationDataService.getData(),
      'Failed to load data',
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
    this.executeOperation(
      this.integrationDataService.create(data),
      'Failed to create record'
    );
    this.displayCreateDialogSignal.set(false);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Record created successfully',
    });
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
    this.executeOperation(
      this.integrationDataService.update(data),
      'Failed to update record'
    );
    this.displayUpdateDialogSignal.set(false);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Record updated successfully',
    });
  }

  delete(code: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.executeOperation(
          this.integrationDataService.delete(code),
          'Failed to delete record'
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Record deleted successfully',
        });
      },
    });
  }

  showCreateDialog() {
    this.newRecordSignal.set({ name: '', email: '' });
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
