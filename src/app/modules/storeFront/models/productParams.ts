import { PaginatedFilter } from "src/app/core/Filters/PaginatedFilter";


export class ProductParams implements PaginatedFilter {
  keyword?: string;
  categoryId?: number;
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
}
