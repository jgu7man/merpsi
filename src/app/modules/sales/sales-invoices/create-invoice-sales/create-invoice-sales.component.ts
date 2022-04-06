import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { ClientModel } from 'src/app/models/clients.model';

@Component({
  selector: 'app-create-invoice-sales',
  templateUrl: './create-invoice-sales.component.html',
  styleUrls: ['./create-invoice-sales.component.scss']
})
export class CreateInvoiceSalesComponent implements OnInit {

  businessRef: string = this._cache.getDataKey('eid')!
  client: ClientModel | null= null

  salesForm: FormGroup = new FormGroup({
    client: new FormControl( '' ),
    cip: new FormControl( ''),
    email: new FormControl(''),
    date_expiration: new FormControl( '' ),
    date_emition: new FormControl( '' ),
    seller: new FormControl( '' ),
    currency: new FormControl( '' ),
    payment_method: new FormControl( '' )

  })
  constructor(
    private _cache: MxCache
  ) { }

  ngOnInit(): void {
  }

  findClient(client: string){
    
  }

  onSubmit(){
    console.log(this.salesForm.getRawValue())
  }

  getValue(client_: ClientModel){
    this.client = client_
    this.salesForm.patchValue({
      client: this.client.name,
      cip: this.client.cip,
      email: this.client.email
    })
    this.salesForm.controls.cip.disable()
    //console.log(list)
  }
}
