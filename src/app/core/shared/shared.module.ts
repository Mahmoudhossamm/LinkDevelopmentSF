import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from './table/table.component';
import { MaterialModule } from '../material/material.module';
import { DataPropertyGetterPipe } from '../pipes/data-property-getter.pipe';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    NotFoundComponent,
    TableComponent,
    DataPropertyGetterPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  exports:[
    FormsModule,
    ReactiveFormsModule,
    TableComponent

  ]
})
export class SharedModule { }
