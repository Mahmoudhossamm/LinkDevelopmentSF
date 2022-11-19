import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './storeFront/components/orders/orders.component';
import { ProductListComponent } from './storeFront/components/product-list/product-list.component';
import { StoreFrontComponent } from './storeFront/store-front.component';


const routes: Routes = [
  {
    path:'',
    component: StoreFrontComponent
  },
  {
    path:'product-list',
    component: ProductListComponent
  },
  {
    path:'orders',
    component: OrdersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
