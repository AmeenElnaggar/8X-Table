import { Routes } from '@angular/router';
import { ProductsList } from './features/products/pages/list/products-list';
import { OrdersList } from './features/orders/pages/list/orders-list';

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
