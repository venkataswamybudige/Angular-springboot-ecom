import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice : number = 0; 
  totalQuantity : number  = 0;

  constructor(private cartService: CartService){}

  ngOnInit(): void {
    this.updateCartStatus();
  }
  updateCartStatus() {
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
  }

}
