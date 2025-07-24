import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/reusable-table/reusable-table').then(
        (response) => response.ReusableTable
      ),
  },
];
