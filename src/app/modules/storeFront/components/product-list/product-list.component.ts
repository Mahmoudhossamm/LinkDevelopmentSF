import { Component, OnInit } from '@angular/core';
import { PaginationResponseOfProductDto } from '../../models/paginationResponseOfProductDto';
import { SearchProductsRequest } from '../../models/searchProductsRequest';
import { ProductsService } from '../../services/products.service';
import { PaginatedFilter } from 'src/app/core/Filters/PaginatedFilter';
import { TableColumn } from 'src/app/core/shared/table/table-column';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  productsDto: PaginationResponseOfProductDto | any;
  productColumns!: TableColumn[];
  filterCriteria: SearchProductsRequest = {keyword:'', pageSize: 10 ,orderBy:['CategoryId']};
  constructor(
    public productService: ProductsService,
  ) { }

  ngOnInit(): void {
    this.filterCriteria.pageSize = 5;
    this.getProducts();
    this.initColumns();
   
  }

  getProducts(): void {

    this.productService.productsSearch(this.filterCriteria).subscribe((result) => {
      this.productsDto = result;
      console.log(result);
    });
  }
  initColumns(): void {
    this.productColumns = [
      //{ name: 'Id', dataKey: 'id', isSortable: true, isShowable: true },
      { name: 'Name', dataKey: 'name', isSortable: true, isShowable: true },
      { name: 'CategoryName', dataKey: 'categoryName', isSortable: true, isShowable: true },
      { name: 'Description', dataKey: 'description', isSortable: true, isShowable: true },
      { name: 'Price', dataKey: 'price', isSortable: true, isShowable: true },
      { name: 'Quantity', dataKey: 'quantity', isSortable: true, isShowable: true },
      
    ];
  }

  pageChanged(event: PaginatedFilter): void {
    this.filterCriteria.pageNumber = event.pageNumber;
    this.filterCriteria.pageSize = event.pageSize;
    this.getProducts();
  }

 


  filter($event: string): void {
    console.log('asd',$event)
    this.filterCriteria.keyword = $event.trim().toLocaleLowerCase();
    this.filterCriteria.pageNumber = 0;
    this.filterCriteria.pageSize = 0;
    this.getProducts();
  }

  reload(): void {
    this.filterCriteria.keyword = '';
    this.filterCriteria.pageNumber = 0;
    this.filterCriteria.pageSize = 0;
    this.getProducts();
  }
}
