import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Product } from 'src/app/modules/storeFront/models/product';
import { ProductParams } from 'src/app/modules/storeFront/models/productParams';
import {environment} from 'src/environments/environment';

@Injectable()
export class ProductApiService {

  baseUrl = environment.apiUrl + 'v1/products/';

  constructor(private http: HttpClient) {
  }

  getAlls(params: ProductParams) {
    return this.http.post(this.baseUrl + 'search', params);
  }

  // getById(id: string) {
  //   return this.http.get<Result<Product>>(this.baseUrl + id);
  // }

  getImageById(id: string) {
    return this.http.get(this.baseUrl + `image/${id}`);
  }

  create(product: Product) {
    return this.http.post(this.baseUrl, product);
  }

  update(product: Product) {
    return this.http.put(this.baseUrl + product.id, product);
  }

 
  delete(id: string) {
    return this.http.delete(this.baseUrl + id);
  }
}
