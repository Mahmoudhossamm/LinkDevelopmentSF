import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { PaginatedFilter } from 'src/app/core/Filters/PaginatedFilter';
import { TableColumn } from 'src/app/core/shared/table/table-column';
import { CreateOrdersRequest } from '../../models/createOrdersRequest';
import { PaginationResponseOfDiscountRulesDto } from '../../models/paginationResponseOfDiscountRulesDto';
import { PaginationResponseOfOrdersDto } from '../../models/paginationResponseOfOrdersDto';
import { PaginationResponseOfProductDto } from '../../models/paginationResponseOfProductDto';
import { SearchDiscountRulesRequest } from '../../models/searchDiscountRulesRequest';
import { SearchOrdersRequest } from '../../models/searchOrdersRequest';
import { SearchProductsRequest } from '../../models/searchProductsRequest';
import { DiscountRulesService } from '../../services/discountRules.service';
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
  orders : PaginationResponseOfOrdersDto| any;
  ordersColumns!: TableColumn[];
  orderQuantity:number = 0;

  virtualOrder : Array<CreateOrdersRequest> = [];
  
  filterCritieriaDiscount : SearchDiscountRulesRequest = {}; 
  discountRulesDto : PaginationResponseOfDiscountRulesDto = {data:[]} ;
  constructor(
    private orderService: OrdersService,
    private productService: ProductsService,
    private discountRule : DiscountRulesService,
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
      { name: 'Discount', dataKey: 'discountPercentage', isSortable: true, isShowable: true },
      { name: 'price', dataKey: 'price', isSortable: true, isShowable: true },
      { name: 'quantity', dataKey: 'quantity', isSortable: true, isShowable: true },
      
    ];
  }

  
  pageChanged(event: PaginatedFilter): void {
    this.orderFilterCriteria.pageNumber = event.pageNumber;
    this.orderFilterCriteria.pageSize = event.pageSize;
    this.getOrders();
  }

 
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



  saveOrders(){

    for (let index = 0; index < this.virtualOrder.length; index++) {
      this.orderService.ordersCreate(this.virtualOrder[index]).subscribe(response => {
      this.toastr.success("product Created");
      this.getOrders();
    });
    }

    
  }
  onSubmit(): void {

    // Get Current ProductId
    let productId : string = this.orderForm.get('productId')?.value;
    console.log("product",productId);

    this.filterCritieriaDiscount.productId = productId;
    this.discountRule.discountRulesSearch(this.filterCritieriaDiscount).subscribe((res)=>{
      console.log("Discount",res)
      this.discountRulesDto = res;


       // Get Product Index
    let index = this.virtualOrder.findIndex( obj => obj.productId == productId)

    // Get Current Quantity
    let orderIndex = this.virtualOrder.findIndex(obj => obj.name == this.orderForm.get('name')?.value)
    let orderDB = this.orders.data.findIndex((obj: { name: string; }) => obj.name == this.orderForm.get('name')?.value)
    if (orderIndex > -1 || orderDB > -1) {
      this.toastr.warning("Name already exist");
      return;
    }





    if (index > -1) {
      this.virtualOrder[index].quantity +=  this.orderForm.get('quantity')?.value;
    }
    else{
      this.virtualOrder.push(this.orderForm.value);
      index = this.virtualOrder.findIndex( obj => obj.productId == productId);
    }


    // Assign Discount Rules
    let quantity = 0;
    let percentage = 0;
    if (this.discountRulesDto.data?.length > 0) {
       quantity = this.discountRulesDto.data[0].quantity;
       percentage = this.discountRulesDto.data[0].percentage;
    }

   
    // Apply Discount Rules
    if (index > -1 && this.virtualOrder[index].quantity >= quantity ) {
      
      if (this.virtualOrder[index].discountPercentage == undefined) {
        let priceAfterDiscount = ((this.virtualOrder[index].price * percentage) / 100) 
        this.virtualOrder[index].price = priceAfterDiscount;
        this.virtualOrder[index].discountPercentage = percentage;
      }

    }



    })


   
   

    // this.virtualOrder.push(this.orderForm.value);


    // console.log("virtualOrder",this.virtualOrder);
   // this.toastr.success("product Created");

  }

}
