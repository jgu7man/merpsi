import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { ClientModel } from 'src/app/models/clients.model';
import { SelectConceptDialogComponent } from 'src/app/modules/purchases/purchase-invoices/create-invoice/select-concept.dialog/select-concept.dialog.component';
import { SalesService } from 'src/app/services/sales.service';

@Component({
  selector: 'app-create-invoice-sales',
  templateUrl: './create-invoice-sales.component.html',
  styleUrls: ['./create-invoice-sales.component.scss']
})
export class CreateInvoiceSalesComponent implements OnInit {

  businessRef: string = this._cache.getDataKey('eid')!
  client: ClientModel | null= null

  clientform: FormGroup = new FormGroup({
    client: new FormControl( '' ),
    cip: new FormControl( ''),
    email: new FormControl(''),
  })

  salesForm: FormGroup = new FormGroup({
    client: this.clientform,
    seller: new FormControl( '' ),
    date_expiration: new FormControl( '' ),
    currency: new FormControl( '' ),
    date_emition: new FormControl( '' ),
    payment_method: new FormControl( '' ),

  })

  
  constructor(
    private _cache: MxCache,
    private _dialog: MatDialog,
    public sales: SalesService
  ) { }

  async ngOnInit(): Promise<void> {
    this.salesForm.valueChanges.pipe(
      distinctUntilChanged( ( x, y ) => JSON.stringify( x ) == JSON.stringify(y)),
      debounceTime( 3000 ),
      skip(1)
    ).subscribe( changes => {
      this.sales.current$.next( {
        ...this.sales.current$.value,
        ...changes
      } )
      console.log('este es el current')
      console.log(this.sales.current$.value)
    })

  }

  onSubmit(){
    console.log(this.salesForm.getRawValue())
  }

  getValue(client_: ClientModel){
    this.client = client_
    this.clientform.patchValue({
      client: this.client.name,
      cip: this.client.cip,
      email: this.client.email
    })
    this.clientform.controls.cip.disable()
    //console.log(list)
  }

  addConcept(){
    
    this._dialog.open(SelectConceptDialogComponent, {
      width: '600px ',
    } )
    //this.purchase.addConcept()
  }
}
