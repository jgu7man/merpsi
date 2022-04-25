import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { ClientModel } from 'src/app/modules/clients/clients.model';
import { invoiceFooter, ProductInvoiceModel } from '../../invoices/invoice.model';
import { SelectConceptDialogComponent } from '../../invoices/select-concept.dialog/select-concept.dialog.component';
import { SalesInvoiceModel } from '../sales-invoice.model';
import { SalesService } from '../sales.service';

@Component({
  selector: 'app-create-invoice-sales',
  templateUrl: './create-invoice-sales.component.html',
  styleUrls: ['./create-invoice-sales.component.scss']
})
export class CreateInvoiceSalesComponent implements OnInit {

  businessRef: string = this._cache.getDataKey('eid')!
  client: ClientModel | null= null
  concept: ProductInvoiceModel | null = null 
  // private currentSubscription: Subscription


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
  footerCalc: invoiceFooter  = {
    shipping: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
    taxes: []
  }

  
  constructor(
    private _cache: MxCache,
    private _dialog: MatDialog,
    public sales: SalesService
  ) { 
  }

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
    })

  }
 

  getfooterCalculos(invoice: SalesInvoiceModel){

    let subtotal = 0
    if (invoice) {
      invoice.details.forEach(d => subtotal += d.amount)
      invoice.footer.subtotal = subtotal
      invoice.footer.total = (invoice.footer.shipping + invoice.footer.subtotal) - invoice.footer.discount
    }
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
    } ).  afterClosed().subscribe( concept => {
      //console.log(result)
      this.concept = concept
      this.sales.addConcept(concept)
    })
    //this.purchase.addConcept()
  }

  async getChanges(changes: any){
     this.sales.getChanges(changes,this.concept)

  }

  getFooter(footer: invoiceFooter){
    console.log('soy el output')
    this.sales.getFooter(footer)
   // this.setTotales(footer)
  }

}
