import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Category } from 'src/app/modules/admin/catalog/models/category';
import { CategoryParams } from 'src/app/modules/admin/catalog/models/categoryParams';
@Injectable()
export class CategoryApiService {
  baseUrl = environment.apiUrl + 'v1/categories/';
  constructor(private http: HttpClient) {
  }

  // getAlls(params: HttpParams) {
  //   return this.http.get(this.baseUrl, {params: params});
  // }

  getAlls(params: CategoryParams) {
    return this.http.post(this.baseUrl + 'search', params);
  }

  getById(id: string) {
    return this.http.get<Category>(this.baseUrl + id);
  }

  create(category: Category) {
    return this.http.post(this.baseUrl, category);
  }

  update(category: Category) {
    return this.http.put(this.baseUrl + category.id, category);
  }

 
  delete(id: string) {
    return this.http.delete(this.baseUrl + id);
  }
}
