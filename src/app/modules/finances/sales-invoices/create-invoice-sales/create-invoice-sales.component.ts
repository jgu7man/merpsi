import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { ManagerModel } from 'src/app/modules/admin/managers/manager.model';
import { ClientModel } from 'src/app/modules/clients/clients.model';
import { AuthService } from 'src/app/services/auth.service';
import { iInvoiceFooter, invoiceFooter, ProductInvoiceModel } from '../../invoices/invoice.model';
import { SelectConceptDialogComponent } from '../../invoices/select-concept.dialog/select-concept.dialog.component';
import { SalesInvoiceModel } from '../sales-invoice.model';
import { SalesService } from '../sales.service';
import { SelectConceptSalesDialogComponent } from '../select-concept-sales-dialog/select-concept-sales-dialog.component';

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
    client: new FormControl( '',[Validators.required] ),
    cip: new FormControl( '',[Validators.required]),
    email: new FormControl('',[Validators.required]),
  })

  salesForm: FormGroup = new FormGroup({
    client: this.clientform,
    invoice_ID: new FormControl( '',[Validators.required] ),
    seller: new FormControl( '',[Validators.required] ),
    date_expiration: new FormControl( '',[Validators.required] ),
    currency: new FormControl( '',[Validators.required] ),
    date_emition: new FormControl( '',[Validators.required] ),
    payment_method: new FormControl( '' ),

  })
  footerCalc: iInvoiceFooter  = {
    shipping: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
    taxes: []
  }
  @Output() submited: EventEmitter<any> = new EventEmitter()

  constructor(
    private _cache: MxCache,
    private _dialog: MatDialog,
    public sales: SalesService,
    private _dashboard: DashboardService,
    private _alert: MxAlert,

    
  ) { 
  }

  async ngOnInit(): Promise<void> {
    

    this.salesForm.valueChanges.pipe(
      distinctUntilChanged( ( x, y ) => JSON.stringify( x ) == JSON.stringify(y)),
      debounceTime( 500 ),
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
  }

  addConcept() {
    this._dialog.open(SelectConceptSalesDialogComponent, {
      width: '600px ',
    }).afterClosed().subscribe(concept => {
      this.concept = concept
     // this.sales.addConcept(concept)
    })
  }

   getChanges(changes: any){
     this.sales.getChanges(changes,this.concept)
  }

  getFooter(footer: invoiceFooter){
    this.sales.getFooter(footer)
  }



  deleteConcept(concept: ProductInvoiceModel){
    this.sales.deleteConcept(concept.UPC)
  }

  async saveInvoice(){
    console.log(this.sales.current$.value)
    let invoice = this.sales.current$.value!
    let taxs: any = []
    invoice.footer.taxes.map(tax => {
      taxs.push({...tax})
    })
    invoice.footer.taxes = taxs
    await this.sales.saveInvoice(invoice)
    this._alert.notify('la factura ha sido guardado con exito!')
    this.cleanForm()
    this.submited.emit()
  }

  cleanForm(){
    this.clientform.patchValue({
      client: '',
      cip: '',
      email: ''
    })

    this.salesForm.patchValue({
    invoice_ID: '',
    seller: '',
    date_expiration:'',
    currency: '',
    date_emition: '',
    payment_method: '',

    })
  }
}
