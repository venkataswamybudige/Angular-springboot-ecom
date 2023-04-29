import { CartItem } from "./cart-item";

export class OrderItem {
    imageUrl : string | undefined;
    quantity : number | undefined;
    unitPrice: number | undefined;
    productId: number | undefined;

    constructor(cartItem : CartItem){
        this.imageUrl = cartItem.imageUrl;
        this.quantity = cartItem.quantity;
        this.unitPrice = cartItem.unitPrice;
        this.productId = cartItem.id;
    }
}
