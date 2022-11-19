import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { PaginatedFilter } from 'src/app/core/Filters/PaginatedFilter';
import { TableColumn } from 'src/app/core/shared/table/table-column';
import { PaginationResponseOfOrdersDto } from '../../models/paginationResponseOfOrdersDto';
import { PaginationResponseOfProductDto } from '../../models/paginationResponseOfProductDto';
import { SearchOrdersRequest } from '../../models/searchOrdersRequest';
import { SearchProductsRequest } from '../../models/searchProductsRequest';
import { OrdersService } from '../../services/orders.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  filterCriteria: SearchProductsRequest = {pageSize: 5};
  productsDto: PaginationResponseOfProductDto | any;
  orderForm!: FormGroup;

  orderFilterCriteria: SearchOrdersRequest = {pageSize: 5};
  orders : PaginationResponseOfOrdersDto| any;;
  ordersColumns!: TableColumn[];
  constructor(
    private orderService: OrdersService,
    private productService: ProductsService,
    private fb: FormBuilder,
    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.intializeForm();
    this.getProducts();

    
    this.initColumns();
    this.getOrders();
  }

  intializeForm(){
    this.orderForm = this.fb.group({
      id: [],
      name: ['', Validators.required],
      productId:  ['', Validators.required],
      price:  ['', Validators.required],
      quantity:  ['', Validators.required],
    
    });
  }

  getProducts(): void {
    this.productService.productsSearch(this.filterCriteria).subscribe((result) => {
      this.productsDto = result;
      console.log(result);
    });
  }

  getOrders(){
    this.orderService.ordersSearch(this.orderFilterCriteria).subscribe((res)=>{
      this.orders = res;
    })
  }



  initColumns(): void {
    this.ordersColumns = [
     // { name: 'Id', dataKey: 'id', isSortable: true, isShowable: true },
      { name: 'name', dataKey: 'name', isSortable: true, isShowable: true },
      { name: 'description', dataKey: 'description', isSortable: true, isShowable: true },
      { name: 'Product Name', dataKey: 'productName', isSortable: true, isShowable: true },
      { name: 'price', dataKey: 'price', isSortable: true, isShowable: true },
      { name: 'quantity', dataKey: 'quantity', isSortable: true, isShowable: true },
      { name: 'Action', dataKey: 'action', position: 'right' },
    ];
  }

  
  pageChanged(event: PaginatedFilter): void {
    this.orderFilterCriteria.pageNumber = event.pageNumber;
    this.orderFilterCriteria.pageSize = event.pageSize;
    this.getOrders();
  }

  // openForm(DiscountRules?: DiscountRules): void {
  //   const dialogRef = this.dialog.open(DiscountRulesFormComponent, {
  //     data: DiscountRules,
  //   });
  //   dialogRef.afterClosed().subscribe(() => {
  //       this.getorders();
  //   });
  // }

 

  // sort($event: Sort): void {
  //   this.orderFilterCriteria.orderBy = $event.active + ' ' + $event.direction;
  //   this.getOrders();
  // }

  filter($event: string): void {
    this.orderFilterCriteria.keyword = $event.trim().toLocaleLowerCase();
    this.orderFilterCriteria.pageNumber = 1;
    this.orderFilterCriteria.pageSize = 10;
    this.getOrders();
  }

  reload(): void {
    this.orderFilterCriteria.keyword = '';
    this.orderFilterCriteria.pageNumber = 1;
    this.orderFilterCriteria.pageSize = 10;
    this.getOrders();
  }

  onSubmit(): void {
    this.orderService.ordersCreate(this.orderForm.value).subscribe(response => {
      this.toastr.success("product Updated");
      this.getOrders();
    });
  }

}
