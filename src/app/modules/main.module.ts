import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';

import { MaterialModule } from '../core/material/material.module';
import { SharedModule } from '../core/shared/shared.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProductListComponent } from './storeFront/components/product-list/product-list.component';
import { HeaderComponent } from './storeFront/components/header/header.component';
import { StoreFrontComponent } from './storeFront/store-front.component';
import { ProductsService } from './storeFront/services/products.service';

@NgModule({
  declarations: [
    HeaderComponent,
    ProductListComponent,
    StoreFrontComponent,

  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule,
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    HttpClientModule,

  ],
  providers: [
    DecimalPipe,ProductsService
  ],
})
export class MainModule { }
