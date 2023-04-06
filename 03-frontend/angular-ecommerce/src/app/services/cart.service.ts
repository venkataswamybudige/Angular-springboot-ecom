import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {
    //check if we have already that item incart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;
    //find the item in  the cart based on the item id
     if (this.cartItems.length > 0) {
    //   for (let tempCartItem of this.cartItems) {
    //     if (tempCartItem.id === theCartItem.id) {
          existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)!;
        //   break;
        // }
    
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      //just add the item to the array.
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();
  }
  //compute the cart total price and quantity
  computeCartTotals() {
    let totalPricevalue : number = 0;
    let totalQuantityValue : number =  0;
    for (let currentCartItem of this.cartItems){
      totalPricevalue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue +=  currentCartItem.quantity
    }

    //publish the new values .. all subscribers will receive  the new data.
    this.totalPrice.next(totalPricevalue);
    this.totalQuantity.next(totalQuantityValue);  

    this.logCartData(totalPricevalue,totalQuantityValue);
  }

  logCartData(totalPricevalue: number, totalQuantityValue: number) {
   console.log("Content of the cart.")
    for(let tempCartItem of this.cartItems){
      const subTotalPrice  = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name :${tempCartItem.name}, quantity : ${tempCartItem.quantity} , unitPrice : ${tempCartItem.unitPrice} , subtotal price ${subTotalPrice}`);
    }
    console.log(`total price${totalPricevalue.toFixed(2)} , total quantity ${totalQuantityValue}`)
    console.log(`-------------`)
  }

  //check if we found it.
  

}





