import { Component, OnInit } from '@angular/core';
import { PaginationResponseOfProductDto } from '../../models/paginationResponseOfProductDto';
import { Product } from '../../models/product';
import { ProductParams } from '../../models/productParams';
import { SearchProductsRequest } from '../../models/searchProductsRequest';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  productsDto!: PaginationResponseOfProductDto;
  filterCriteria: SearchProductsRequest = {keyword:'', pageSize: 10 ,orderBy:['CategoryId']};
  constructor(
    public productService: ProductsService,
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {

    this.productService.productsSearch(this.filterCriteria).subscribe((result) => {
      this.productsDto = result;
      console.log(result);
    });
  }
}
