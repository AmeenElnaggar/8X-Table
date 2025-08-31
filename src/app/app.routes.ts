import { Routes } from '@angular/router';
import { ProductsList } from './features/products/pages/list/list';
import { OrdersList } from './features/orders/pages/list/list';

export const routes: Routes = [
  {
    path: 'products',
    component: ProductsList,
  },
  {
    path: 'orders',
    component: OrdersList,
  },
];
