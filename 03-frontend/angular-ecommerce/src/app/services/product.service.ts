import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import {map} from 'rxjs/operators'
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private categoryUrl = 'http://localhost:8080/api/product-category';
  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient) { }

  getProductListPaginate(thePage : number, 
                          thePageSize:number,
                          theCategoryId:number): Observable<GetResponse>{

    //need to build a URL based on the category id.
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
     + `&page=${thePage}&size=${thePageSize}`; 
    return this.httpClient.get<GetResponse>(searchUrl);
  }

  getProductList(theCategoryId:number): Observable<Product[]>{

    //need to build a URL based on the category id.
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`; 
    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response=> response._embedded.products));
  }

  getProduct(theProductId: number) : Observable<Product>{
   //need to build the URL based on the product id.
   const productUrl = `${this.baseUrl}/${theProductId}`;
   return this.httpClient.get<Product>(productUrl);
  }

  getProductCategories() : Observable<ProductCategory[]>{

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyWord: string) : Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`; 
    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response=> response._embedded.products));
  }
}

  interface GetResponseProductCategory{
    _embedded:{
      productCategory: ProductCategory[];
    }
  }

  interface GetResponse{
    _embedded:{
      products: Product[];
    },
    page:{
      size:number,
      totalElements:number,
      totalPages:number,
      number : number
    }
  }

