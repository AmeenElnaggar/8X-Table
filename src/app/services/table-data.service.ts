import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { IntegrationDataService } from './integration-data.service';
import { ColumnDefinition } from '../interfaces/column.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class TableDataService {
  private integrationDataService = inject(IntegrationDataService);
  private destroyRef = inject(DestroyRef);

  private dataSignal = signal<any[]>([]);
  private columnsSignal = signal<ColumnDefinition[]>([
    { field: 'code', header: 'Code', sortable: true },
    { field: 'name', header: 'Name', sortable: false, filterable: true },
    { field: 'email', header: 'Email', sortable: false, filterable: true },
    { field: 'actions', header: 'Actions' },
  ]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private displayCreateDialogSignal = signal<boolean>(false);
  private displayUpdateDialogSignal = signal<boolean>(false);
  private newRecordSignal = signal<any>({ code: '', name: '', email: '' });
  private selectedRecordSignal = signal<any>(null);

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
          console.log(err);
          this.errorSignal.set(errorMessage);
          this.loadingSignal.set(false);
          return of(null);
        }),

        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (result) => {
          console.log(result);
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

  create(data: any) {
    this.executeOperation(
      this.integrationDataService.create(data),
      'Failed to create record'
    );
  }

  update(data: any) {
    this.executeOperation(
      this.integrationDataService.update(data),
      'Failed to update record'
    );
  }

  delete(id: number) {
    this.executeOperation(
      this.integrationDataService.delete(id),
      'Failed to delete record'
    );
  }

  // dialog
}
