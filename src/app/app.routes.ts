import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/table/table').then(
        (response) => response.Table
      ),
  },
];
