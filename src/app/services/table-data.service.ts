import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { IntegrationDataService } from './integration-data.service';
import { ColumnDefinition } from '../interfaces/column.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class TableDataService {
  private integrationDataService = inject(IntegrationDataService);
  private destroyRef = inject(DestroyRef);

  private dataSignal = signal<any[]>([]);
  private columnsSignal = signal<ColumnDefinition[]>([
    { field: 'id', header: 'ID', sortable: true },
    { field: 'name', header: 'Name', sortable: true, filterable: true },
    { field: 'email', header: 'Email', sortable: true, filterable: true },
  ]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  public data = computed(() => this.dataSignal());
  public columns = computed(() => this.columnsSignal());
  public loading = computed(() => this.loadingSignal());
  public error = computed(() => this.errorSignal());

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
          this.errorSignal.set(errorMessage);
          this.loadingSignal.set(false);
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
}
