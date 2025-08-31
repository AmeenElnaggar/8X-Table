import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject, DestroyRef } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService } from 'primeng/dynamicdialog';
import { BackendService } from '../core/services/backend.service';
import { TableDialog } from '../shared/components/table-dialog/table-dialog';
import { IColumnDefinition } from '../shared/interfaces/column-definition.model';

interface TableState {
  records: any[];
  columns: IColumnDefinition[];
  isLoading: boolean;
  error: string | null;
  context: string;
  endpoints: {
    data: string;
    metadata: string;
  };
  recordHistory: { [key: string]: any[] };
  reloadFlag: boolean;
}

const initialState: TableState = {
  records: [],
  columns: [],
  isLoading: false,
  error: null,
  context: '',
  endpoints: {
    data: '',
    metadata: '',
  },
  recordHistory: {},
  reloadFlag: false,
};

export const TableStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const api = inject(BackendService);
    const destroyRef = inject(DestroyRef);
    const messageService = inject(MessageService);
    const confirmationService = inject(ConfirmationService);
    const dialogService = inject(DialogService);

    const executeOperation = (
      operation: Observable<any>,
      messages: { errorMessage: string; successMessage?: string },
      reloadData: boolean = true,
      isGetData: boolean = false,
      onSuccess?: (result: any) => void
    ) => {
      patchState(store, { isLoading: true, error: null });
      operation.pipe(takeUntilDestroyed(destroyRef)).subscribe({
        next: (result) => {
          patchState(store, { isLoading: false });

          if (onSuccess) {
            onSuccess(result);
          }

          if (isGetData) {
            patchState(store, { records: result ?? [] });
            patchState(store, {
              recordHistory: {
                ...store.recordHistory(),
                [store.context()]: [...(result ?? [])],
              },
            });
          }

          if (result && reloadData && store.endpoints().data) {
            loadData();
          }

          if (messages.successMessage) {
            messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: messages.successMessage,
            });
          }
        },
        error: (err: Error) => {
          patchState(store, { error: messages.errorMessage, isLoading: false });
          messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: messages.errorMessage,
          });
        },
      });
    };

    const setContext = (context: string) => {
      if (store.records().length > 0) {
        patchState(store, {
          recordHistory: {
            ...store.recordHistory(),
            [store.context()]: [...store.records()],
          },
        });
      }
      patchState(store, { context });

      const savedRecords = store.recordHistory()[context];
      if (savedRecords && savedRecords.length > 0) {
        patchState(store, { records: [...savedRecords] });
      }
    };

    const setEndpoints = (endpoints: { data: string; metadata: string }) => {
      patchState(store, { endpoints });
    };

    const triggerReload = () => {
      if (!store.endpoints().data || !store.endpoints().metadata) {
        messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Endpoints not set. Please set endpoints before reloading.',
        });
        return;
      }
      patchState(store, { reloadFlag: !store.reloadFlag() });
      loadData();
      loadMetadata();
    };

    const loadMetadata = () => {
      const metadataEndpoint = store.endpoints().metadata;
      if (!metadataEndpoint) {
        messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Metadata endpoint not set',
        });
        return;
      }
      executeOperation(
        api.getMetadata(metadataEndpoint),
        {
          errorMessage: `Failed to load ${store.context() || 'data'} metadata`,
        },
        false,
        false,
        (result) => patchState(store, { columns: result ?? [] })
      );
    };

    const loadData = () => {
      const dataEndpoint = store.endpoints().data;
      if (!dataEndpoint) {
        messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Data endpoint not set',
        });
        return;
      }
      executeOperation(
        api.getData(dataEndpoint),
        { errorMessage: `Failed to load ${store.context() || 'data'} data` },
        false,
        true
      );
    };

    const create = (data: any) => {
      const dataEndpoint = store.endpoints().data;
      if (!dataEndpoint) {
        messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Data endpoint not set',
        });
        return;
      }
      executeOperation(api.create(dataEndpoint, data), {
        errorMessage: `Failed to create ${store.context() || 'record'} record`,
        successMessage: `${store.context() || 'Record'} created successfully`,
      });
    };

    const update = (data: any) => {
      const dataEndpoint = store.endpoints().data;
      if (!dataEndpoint) {
        messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Data endpoint not set',
        });
        return;
      }
      executeOperation(api.update(dataEndpoint, data), {
        errorMessage: `Failed to update ${store.context() || 'record'} record`,
        successMessage: `${store.context() || 'Record'} updated successfully`,
      });
    };

    const deleteRecord = (code: string) => {
      const dataEndpoint = store.endpoints().data;
      if (!dataEndpoint) {
        messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Data endpoint not set',
        });
        return;
      }
      confirmationService.confirm({
        message: `Are you sure you want to delete this ${
          store.context() || 'record'
        }?`,
        header: 'Confirm Delete',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          executeOperation(api.delete(dataEndpoint, code), {
            errorMessage: `Failed to delete ${
              store.context() || 'record'
            } record`,
            successMessage: `${
              store.context() || 'Record'
            } deleted successfully`,
          });
        },
      });
    };

    const showCreateDialog = () => {
      return dialogService.open(TableDialog, {
        header: `Create New ${store.context() || 'Record'}`,
        width: '300px',
        data: {
          mode: 'create',
          columns: store.columns(),
        },
        modal: true,
      });
    };

    const showUpdateDialog = (record: any) => {
      return dialogService.open(TableDialog, {
        header: `Update ${store.context() || 'Record'}`,
        width: '300px',
        data: {
          mode: 'update',
          columns: store.columns(),
          record: record,
        },
        modal: true,
      });
    };

    const showViewDialog = (record: any) => {
      return dialogService.open(TableDialog, {
        header: `View ${store.context() || 'Record'} Details`,
        width: '400px',
        data: {
          mode: 'view',
          columns: store.columns(),
          record: record,
        },
        modal: true,
      });
    };

    return {
      setContext,
      setEndpoints,
      loadMetadata,
      loadData,
      create,
      update,
      deleteRecord,
      showCreateDialog,
      showUpdateDialog,
      showViewDialog,
      triggerReload,
    };
  })
);
