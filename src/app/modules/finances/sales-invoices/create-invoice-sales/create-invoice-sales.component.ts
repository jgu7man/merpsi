import { T } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { ClientModel } from 'src/app/modules/clients/clients.model';
import Swal from 'sweetalert2';
import { iInvoiceFooter, InvoiceFooterModel, ProductInvoiceModel } from '../../invoices/invoice.model';
import { iStub } from '../../stubs-invoice/stub.model';
import { StubService } from '../../stubs-invoice/stub.service';
import { TaxesService } from '../../taxes/taxes.service';
import { SalesInvoiceModel } from '../sales-invoice.model';
import { SalesService } from '../sales.service';
import { SelectConceptSalesDialogComponent } from '../select-concept-sales-dialog/select-concept-sales-dialog.component';
import { CreditDebitNoteDialogComponent } from './credit-debit-note.dialog/credit-debit-note.dialog.component';

@Component({
  selector: 'app-create-invoice-sales',
  templateUrl: './create-invoice-sales.component.html',
  styleUrls: ['./create-invoice-sales.component.scss']
})
export class CreateInvoiceSalesComponent implements OnInit, OnDestroy{

  businessRef: string = this._cache.getDataKey('eid')!
  client: ClientModel | null = null
  concept: ProductInvoiceModel | null = null
  stubList: iStub[] = []
  stubSelect: iStub | null = null
  
  @Input() invoice: SalesInvoiceModel | null = null


  clientform: FormGroup = new FormGroup({
    cip: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
  })

  salesForm: FormGroup = new FormGroup({
    client: this.clientform,
    seller: new FormControl('', [Validators.required]),
    date_expiration: new FormControl('', [Validators.required]),
    currency: new FormControl('', [Validators.required]),
    date_emition: new FormControl('', [Validators.required]),
    payment_method: new FormControl(''),

  })
  @Output() submited: EventEmitter<any> = new EventEmitter()

  constructor(
    private _cache: MxCache,
    private _dialog: MatDialog,
    public sales: SalesService,
    private _alert: MxAlert,
    public stub: StubService,
    private _router: Router,
    private _taxes: TaxesService


  ) {
   
    this.stub.list$.pipe(
    ).subscribe( list => {
      list.forEach(d => {
          if (d.active && d.currentIndex < d.endIndex && d.type === 'sale') {
            this.stubList.push(d)
          }
        })
    })  
  }

  async ngOnInit() {
    if (this.invoice) {
      this.clientform.patchValue({
        cip: this.invoice.client.cip,
        name: this.invoice.client.name,
        email: this.invoice.client.email
      })
      this.salesForm.patchValue({
        client: this.invoice.client,
        seller: this.invoice.seller,
        date_expiration: this.invoice.date_expiration,
        currency: this.invoice.currency,
        date_emition: this.invoice.document_date,
        payment_method: this.invoice.payment_method,
      })

      this.sales.current$.next(this.invoice)
    }
    
    this.salesForm.valueChanges.pipe(
      distinctUntilChanged((x, y) => JSON.stringify(x) == JSON.stringify(y)),
      debounceTime(500),
      skip(1)
    ).subscribe(changes => {
      this.sales.current$.next({
        ...this.sales.current$.value,
        ...changes
      })
    })

  }


  getfooterCalculos(invoice: SalesInvoiceModel) {
    let subtotal = 0
    if (invoice) {
      invoice.details.forEach(d => subtotal += d.amount)
      invoice.footer.subtotal = subtotal
      invoice.footer.total = (invoice.footer.shipping + invoice.footer.subtotal) - invoice.footer.discount
    }
  }

  onSubmit() {
    console.log(this.salesForm.getRawValue())
  }

  getValue(client_: ClientModel) {
    this.client = client_
    this.clientform.patchValue({
      cip: this.client.cip,
      name: this.client.name,
      email: this.client.email
    })
    this.clientform.controls.cip.disable()
    this.sales.updateCurrent('client', this.clientform.getRawValue())
    console.log(this.clientform.getRawValue());

  }

  addConcept() {
    this._dialog.open(SelectConceptSalesDialogComponent, {
      width: '600px ',
    }).afterClosed().subscribe(concept => {
      this.concept = concept
    })
  }

  /**funcion que se encarga de actualizar el current con los cambios realizados en el concept */
  getChanges(changes: any) {
    this.sales.getChanges(changes, this.concept)
  }

  /** funcion que se encarga de actualizar el current con los cambios del footer*/
  getFooter(footer: InvoiceFooterModel) {
    this.sales.getFooter(footer)
  }

  deleteConcept(concept: ProductInvoiceModel) {
    this.sales.deleteConcept(concept.UPC)
  }

  async saveInvoice() {
    console.log(this.sales.current$.value)
    let invoice = this.sales.current$.value!
    let taxs: any = []
    invoice.footer.taxes.map(tax => {
      taxs.push({ ...tax })
    })
    invoice.footer.taxes = taxs
    await this.sales.saveInvoice(invoice)
    /**Se actualiza el index current en el talonario seleccionado */
    if (this.stubSelect) {  
      this.stubSelect.currentIndex = this.stubSelect.currentIndex + 1
      this.stub.update(this.stubSelect)
    }
    this._alert.notify('la factura ha sido guardado con exito!')
    this.cleanForm()
    this.submited.emit()
  }

  cleanForm() {
    this.clientform.patchValue({
      client: '',
      cip: '',
      email: ''
    })

    this.salesForm.patchValue({
      invoice_ID: '',
      seller: '',
      date_expiration: '',
      currency: '',
      date_emition: '',
      payment_method: '',

    })
  }

  async selectStubInvoice(event: MatSelectChange) {
    console.log(event.value)
    let stub = event.value
    this.stubSelect = stub
    if (this.sales.current$.value) {
      let nro = stub.prefix + '-' + ((stub.currentIndex || 0) + 1)
      await this.sales.updateCurrent('invoice_ID', nro)
    }
    // this.stubSelect!.nroStub = 
    // this.stubSelect!.currentIndex = stub.currentIndex + 1
  }

  createCredit(){
    this._dialog.open(CreditDebitNoteDialogComponent, {
      width: '1200px',
      height: '400px',
      data: 'credit'
    }).afterClosed().subscribe(concept => {
      this.concept = concept
      // this.sales.addConcept(concept)
    })
  }
  createDebit(){
    try {
      this._dialog.open(CreditDebitNoteDialogComponent, {
        width: '1200px',
        height: '400px',
        data: 'debit'
      }).afterClosed().subscribe(concept => {
        this.concept = concept
        // this.sales.addConcept(concept)
      })
      // Swal.fire({
      // title: 'Estas seguro en crear una nota de Debito?',
      //   confirmButtonText:'aceptar',
      //   showCancelButton:true
      // }).then(result =>{
      //   if (result.isConfirmed){
      //     if ( !this.sales.current$.value ) throw { message: ' No existe el current de sales'}
      //       this._router.navigate([`/business/${this.businessRef}/finances/new-debit-notes/${this.sales.current$.value.invoice_ID}`])
      //   }
      // })
    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
  }

  ngOnDestroy(): void {
    this._taxes.leave()
  }
}
