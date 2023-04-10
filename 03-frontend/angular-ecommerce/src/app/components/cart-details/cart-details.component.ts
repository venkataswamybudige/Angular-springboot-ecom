import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit{

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity:number  = 0;

  constructor(private cartService : CartService){}

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    //get a handle to the cart item
    this.cartItems = this.cartService.cartItems;
    //subscribe to the cart total price.

 //subscribe to the cart total price
 this.cartService.totalPrice.subscribe(
  data => {
    console.log(`cart service total proce ${data}` )
    this.totalPrice = data}

);
//subscribe to the cart total quantity.
  this.cartService.totalQuantity.subscribe(
    data => {
      console.log(`cart service total quantity ${data}` )
      this.totalQuantity = data
    }
  )
    //compute cart total price and quantity.
        this.cartService.computeCartTotals

  }



  incrementQuantity(tempCartItem: CartItem){
    this.cartService.addToCart(tempCartItem);
  }

  decrementQuantity(tempCartItem: CartItem){
    this.cartService.decrementQuantity(tempCartItem);
  }

  remove(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
    }





}
