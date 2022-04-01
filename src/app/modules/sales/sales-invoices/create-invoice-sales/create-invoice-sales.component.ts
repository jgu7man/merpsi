import { Component, OnInit } from '@angular/core';
import { FormControl, FormControlName, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-invoice-sales',
  templateUrl: './create-invoice-sales.component.html',
  styleUrls: ['./create-invoice-sales.component.scss']
})
export class CreateInvoiceSalesComponent implements OnInit {

  salesForm: FormGroup = new FormGroup({
    client: new FormControl( '' ),
    date_expiration: new FormControl( '' ),
    date_emition: new FormControl( '' ),
    seller: new FormControl( '' ),
    coin: new FormControl( '' ),
    payment_method: new FormControl( '' )

  })
  constructor() { }

  ngOnInit(): void {
  }

  findClient(client: string){
    
  }

  onSubmit(){
    console.log(this.salesForm.getRawValue())
  }
}
