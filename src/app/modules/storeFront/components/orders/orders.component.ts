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
import { ProductDetailsDto } from '../../models/productDetailsDto';
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
  productDetailsDto : ProductDetailsDto | any;
  orderForm!: FormGroup;

  orderFilterCriteria: SearchOrdersRequest = {pageSize: 5};
  orders : PaginationResponseOfOrdersDto| any;
  ordersColumns!: TableColumn[];
  orderQuantity:number = 0;

  productName:string = "";

  virtualOrder : Array<CreateOrdersRequest> = [];
  ordersVirtualColumns!: TableColumn[];
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

    this.initVirtualColumns();
  }

  intializeForm(){
    this.orderForm = this.fb.group({
      id: [],
      productName: [],
      name: ['', Validators.required],
      productId:  ['', Validators.required],
      price: [{value: '', disabled: true}, Validators.required],
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

  ddlChange($event : any){

    this.productService.productsGet($event).subscribe((res)=>{
      this.productDetailsDto = res;
      console.log("ProductPrice",this.productDetailsDto.price );
      this.orderForm.patchValue({
        price: this.productDetailsDto.price,
        productName : this.productDetailsDto.name
      });
     
    })
    console.log("event", this.orderForm.value);
    
  }

  //#region Orders
  initColumns(): void {
    this.ordersColumns = [
     // { name: 'Id', dataKey: 'id', isSortable: true, isShowable: true },
      { name: 'name', dataKey: 'name', isSortable: true, isShowable: true },
      { name: 'Product Name', dataKey: 'productName', isSortable: true, isShowable: true },
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

  //#endregion

  //#region Virtual Orders
  initVirtualColumns(): void {
    this.ordersVirtualColumns = [
     // { name: 'Id', dataKey: 'id', isSortable: true, isShowable: true },
      { name: 'name', dataKey: 'name', isSortable: true, isShowable: true },
      { name: 'Product Name', dataKey: 'productName', isSortable: true, isShowable: true },
      { name: 'Discount', dataKey: 'discountPercentage', isSortable: true, isShowable: true },
      { name: 'price', dataKey: 'price', isSortable: true, isShowable: true },
      { name: 'quantity', dataKey: 'quantity', isSortable: true, isShowable: true },
      
    ];
  }

  pageChangedVirtual(event: PaginatedFilter): void {
    
   
  }

 


  //#endregion


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
   
    this.filterCritieriaDiscount.productId = productId;
    this.discountRule.discountRulesSearch(this.filterCritieriaDiscount).subscribe((res)=>{
      this.discountRulesDto = res;


       // Get Product Index
    let index = this.virtualOrder.findIndex( obj => obj.productId == productId)

    // Get Current Quantity
    let orderIndex = this.virtualOrder.findIndex(obj => obj.name == this.orderForm.get('name')?.value)
    let orderDB = this.orders.data.findIndex((obj: { name: string; }) => obj.name == this.orderForm.get('name')?.value)
    if (orderIndex > -1 || orderDB > -1) {
      this.toastr.warning("Order Name already exist");
      return;
    }





    if (index > -1) {
      this.virtualOrder[index].quantity +=  this.orderForm.get('quantity')?.value;
    }
    else{
      this.virtualOrder.push(this.orderForm.getRawValue());
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
        this.virtualOrder[index].price =  this.virtualOrder[index].price - priceAfterDiscount;
        this.virtualOrder[index].discountPercentage = priceAfterDiscount;
      }

    }



    })


  }

}
