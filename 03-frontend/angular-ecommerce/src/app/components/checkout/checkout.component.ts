import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{
  
  checkOutFormGroup! : FormGroup;

  totalPrice:number = 0;
  totalQuantity : number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [] ;

  countries : Country[] = [];

  shippingAddressStates : State[] = [] ;
  billingAddressStates : State[] = [] ;



  constructor(private formBuilder:FormBuilder, 
    private luv2ShopFormService: Luv2ShopFormService, 
    private cartService : CartService,
    private checkoutService : CheckoutService,
    private router : Router){}
  ngOnInit(): void {
    this.checkOutFormGroup = this.formBuilder.group({
      customer : this.formBuilder.group({
        firstName : new FormControl('',[Validators.required,
                                        Validators.minLength(2),
                                        CustomValidators.notOnlyWhiteSpace]),
        lastName :  new FormControl('',[Validators.required,
                                        Validators.minLength(2),
                                        CustomValidators.notOnlyWhiteSpace]),
        email : new FormControl('',
                                [Validators.required,
                                Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street : new FormControl('',[Validators.required,Validators.minLength(2),
                                    CustomValidators.notOnlyWhiteSpace]),
        city :  new FormControl('',[Validators.required,Validators.minLength(2),
                                    CustomValidators.notOnlyWhiteSpace]),
        state: new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required,Validators.minLength(2),
                                     CustomValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
        CustomValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
        CustomValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
        CustomValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType : new FormControl('', [Validators.required]),
        nameOnCard : new FormControl('', [Validators.required, Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace]),
        cardNumber:new FormControl('', [Validators?.required,Validators.pattern('[0-9]{16}')]),
        securityCode:new FormControl('', [Validators?.required,Validators.pattern('[0-9]{3}')]),
        expirationMonth:[''],
        expirationYear:['']
      })
    });

    //populate credit card months.

    const startMonth: number  = new Date().getMonth() +1;
    console.log("start month: " + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit card months : "+ JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )

    //populate credit card years.
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrived the credit card years :" + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )

    //populate countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrived the countries "+ JSON.stringify(data));
        this.countries = data;
      }
    )

    this.reviewCartDetails();

  }

  

  get firstName() {return this.checkOutFormGroup.get('customer.firstName');}

  get lastName() {return this.checkOutFormGroup.get('customer.lastName');}

  get email() {return this.checkOutFormGroup.get('customer.email');}

  get shippingAdressStreet() {return this.checkOutFormGroup.get('shippingAddress.street');}
  get shippingAdressCity() {return this.checkOutFormGroup.get('shippingAddress.city');} 
  get shippingAdressState() {return this.checkOutFormGroup.get('shippingAddress.state');}
  get shippingAdressCountry() {return this.checkOutFormGroup.get('shippingAddress.country');}
  get shippingAdressZipCode() {return this.checkOutFormGroup.get('shippingAddress.zipCode');}

  get billingAdressStreet() {return this.checkOutFormGroup.get('billingAddress.street');}
  get billingAdressCity() {return this.checkOutFormGroup.get('billingAddress.city');} 
  get billingAdressState() {return this.checkOutFormGroup.get('billingAddress.state');}
  get billingAdressCountry() {return this.checkOutFormGroup.get('billingAddress.country');}
  get billingAdressZipCode() {return this.checkOutFormGroup.get('billingAddress.zipCode');}

  get creditCardType() {return this.checkOutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard() {return this.checkOutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber() {return this.checkOutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode() {return this.checkOutFormGroup.get('creditCard.securityCode');}

  onSubmit(){
    console.log("Handling the submit button...");
    if(this.checkOutFormGroup.invalid){
      this.checkOutFormGroup.markAllAsTouched();
      return;
    }

    let order  = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems  = this.cartService.cartItems;

    // let orderItems : OrderItem[] = [];
    // for(let i = 0; i< cartItems.length;i++){
    //   orderItems[i] =  new OrderItem(cartItems[i]);
    // }

    let orderItems : OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    let purchase = new Purchase();

    purchase.customer = this.checkOutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkOutFormGroup.controls['shippingAddress'].value;
    const shippingState : State = JSON.parse(JSON.stringify(purchase.shippingAddress?.state));
    const shippingCountry : Country = JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkOutFormGroup.controls['billingAddress'].value;
    const billingState : State = JSON.parse(JSON.stringify(purchase.billingAddress?.state));
    const billingCountry : Country = JSON.parse(JSON.stringify(purchase.billingAddress?.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;


    purchase.order = order;
    purchase.orderItems = orderItems;


    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your order has been recieved.\n Order tracking number: ${response.orderTrackingNumber}`)

          this.resetCart();
        },
        error:  err => {
          alert(`There was an error: ${err.message}`)
        } 
      }
    )
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkOutFormGroup.reset();

    this.router.navigateByUrl("/products")
  }

  copyShippingAddressToBillingAddress(event: any){
    if(event.target.checked){
      this.checkOutFormGroup.controls['billingAddress'].
      setValue(this.checkOutFormGroup.controls['shippingAddress'].value);

      this.billingAddressStates = this.shippingAddressStates
    }else{
      this.checkOutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }
 

  handleMonthsAndYears(){
    const creditCardFormGroup  = this.checkOutFormGroup.get('creditCard');
    const currentYear  = new Date().getFullYear();
    const selectedYear: number  =  Number(creditCardFormGroup?.value.expirationYear);

    let startMonth : number;
    if(currentYear === selectedYear){
      startMonth = new Date().getMonth()+1;
    }else{
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit card months : "+ JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  }

  getStates(fromGroupName : string){
    const formGroup = this.checkOutFormGroup.get(fromGroupName);
    const countryCode  =  formGroup?.value.country.code;
    const countryName  =  formGroup?.value.country.name;

    console.log(`${formGroup?.value} Country code : ${countryCode}`)
    console.log(`${formGroup?.value} Country Name : ${countryName}`)

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if(fromGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }

        formGroup?.get('state')?.setValue(data[0]);
      }
    )
    }

    reviewCartDetails() {
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
