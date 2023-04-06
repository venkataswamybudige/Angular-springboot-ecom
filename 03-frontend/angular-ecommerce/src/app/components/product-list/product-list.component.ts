import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  //templateUrl: './product-list.component.html',
  //templateUrl: './product-list-table.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {


  products: Product[] = [];
  currentCategoryId: number = 2;
  previousCategoryId: number = 1;

  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyWord = "";

  constructor(private productService: ProductService, 
                      private cartService : CartService,
                      private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyWord: string = this.route.snapshot.paramMap.get('keyword')!;

    //now if we have a diffrent keyword than prev 
    //then set page number to 1
    if(this.previousKeyWord != theKeyWord){
      this.thePageNumber = 1;
    }

    this.previousKeyWord  = theKeyWord;
    console.log(`theKeyword=${theKeyWord} , the page number ${this.thePageNumber}`)
    //now search for the products using that keywords.
    this.productService.searchtProductPaginate(this.thePageNumber-1,
                                               this.thePageSize,
                                               theKeyWord ).subscribe(this.processResult());

  }

 

  handleListProducts() {
    //check if id parameter is available.
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      //get the param id and convert from string to number using + symbol.
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

    } else {
      //not category id available default will set to the 1 
      this.currentCategoryId = 1;
    }

    //check if we have a different category then previous

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId
    console.log(`current category id=${this.currentCategoryId},thePageNumber${this.thePageNumber}`)
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId)
      .subscribe(this.processResult());
      
  }

  updatePageSelect(pageSize : string){
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult(){

    return (data :any ) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number+1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(theProduct: Product) {
    console.log(theProduct.name +"and"+ theProduct.unitPrice)

    const theCartItem   = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
    }

}
