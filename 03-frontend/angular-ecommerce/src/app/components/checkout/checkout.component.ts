import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

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



  constructor(private formBuilder:FormBuilder, private luv2ShopFormService: Luv2ShopFormService){}
  ngOnInit(): void {
    this.checkOutFormGroup = this.formBuilder.group({
      customer : this.formBuilder.group({
        firstName : [''],
        lastName : [''],
        email : ['']
      }),
      shippingAddress: this.formBuilder.group({
        street : [''],
        city : [''],
        state:[''],
        country:[''],
        zipCode:['']
      }),
      billingAddress: this.formBuilder.group({
        street : [''],
        city : [''],
        state:[''],
        country:[''],
        zipCode:['']
      }),
      creditCard: this.formBuilder.group({
        cardType : [''],
        nameOnCard : [''],
        cardNumber:[''],
        securityCode:[''],
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


  }

  onSubmit(){
    console.log("Handling the submit button...");
    console.log(this.checkOutFormGroup.get('customer')?.value);
    console.log(this.checkOutFormGroup.get('customer')?.value.email);
    console.log(this.checkOutFormGroup.value)
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
}
