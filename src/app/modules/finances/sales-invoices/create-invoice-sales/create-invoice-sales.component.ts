import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { MxCrudService } from 'libs/@marxa/crud-panel/src/public-api';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { PersonalService } from 'src/app/modules/admin/managers/personal.service';
import { ClientModel } from 'src/app/modules/clients/clients.model';
import Swal from 'sweetalert2';
import { FooterService } from '../../invoices/footer-invoice/footer.service';
import { InvoiceConceptService } from '../../invoices/invoice-concept/invoice-concept.service';
import { Invoice, ProductInvoiceModel } from '../../invoices/invoice.model';
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
export class CreateInvoiceSalesComponent implements OnInit, OnDestroy {

  businessRef: string = this._cache.getDataKey('eid')!
  client: ClientModel | null = null
  concept: ProductInvoiceModel | null = null
  stubList: iStub[] = []
  stubSelect: iStub | null = null
  // closesSub: Subscription

  @Input() invoice: SalesInvoiceModel | null = null

  stubForm: FormControl = new FormControl('')
  clientform: FormGroup = new FormGroup({
    CRF: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
  })

  salesForm: FormGroup = new FormGroup({
    seller: new FormControl('', [Validators.required]),
    currency: new FormControl('', [Validators.required]),
    payment_method: new FormControl(''),

  })
  @Output() submited: EventEmitter<any> = new EventEmitter()

  constructor(
    public sales: SalesService,
    public stub: StubService,
    private _cache: MxCache,
    private _dialog: MatDialog,
    private _alert: MxAlert,
    private _taxes: TaxesService,
    private _crud: MxCrudService,
    public conceptInvoice: InvoiceConceptService,
    private _manager: PersonalService,
    private _footer: FooterService

  ) {
    // this.closesSub = this._crud.onClosed.subscribe(() => {
    //   this.stubForm.patchValue('')
    // })
  }

  async ngOnInit() {
    if (this.invoice) {
      this.clientform.patchValue({
        // cip: this.invoice.cliente.name,
        name: this.invoice.client.name,
        // email: this.invoice.cliente.
      })
      this.salesForm.patchValue({
        seller: this.invoice.seller,
        currency: this.invoice.currency,
        payment_method: this.invoice.payment_method,
      })

      //this.readOnlyForm()
      this.conceptInvoice.details_invoice$.next(this.invoice.details)
      this._footer.currentfoot_invoice$.next(this.invoice.footer)
    }
  }
  readOnlyForm() {

    this.clientform.controls.cip.disable()
    this.clientform.controls.name.disable()
    this.clientform.controls.email.disable()

    this.salesForm.controls.client.disable()
    this.salesForm.controls.seller.disable()
    this.salesForm.controls.date_expiration.disable()
    this.salesForm.controls.currency.disable()
    this.salesForm.controls.date_emition.disable()
    this.salesForm.controls.payment_method.disable()

  }

  onSubmit() {
    console.log(this.salesForm.getRawValue())
  }

  getValue(client_: ClientModel) {
    this.client = client_
    this.clientform.patchValue({
      CRF: this.client.CRF,
      name: this.client.name,
      email: this.client.contact ? this.client.contact.email : ''
    })
  }

  addConcept() {
    this._dialog.open(SelectConceptSalesDialogComponent, {
      width: '600px ',
    }).afterClosed().subscribe(concept => {
      if (concept){
        this.concept = concept
        console.log(this.concept!.getdata());

      }
      
    })
  }

  async saveInvoice() {
    if (!this.client) throw { message: 'No existe el cliente'}
    if (!this.sales.stubSelect$.value) throw { message: 'No existe el talonario'}
    if ( !this._manager.current) throw { message: 'No se ha iniciado la sesion'}
    if ( !this._footer.currentfoot$.value ) throw { message: ' No existe el footer'}


    const client: Invoice.client = {
      id: this.client.id!,
      name: this.client.name!,
      cip: this.client.CRF!
    }
    const data = {
      ...this.salesForm.value
    }

    const manager: Invoice.manager = {
      id: this._manager.current.uid!,
      name: this._manager.current.name,
      ref: this._manager.managerRef
    }

    const invoice = new SalesInvoiceModel(
      this.sales.stubSelect$.value.prefixIndexCurrent,
      client,
      data.seller,
      data.currency,
      data.payment_method,
      manager,
      this.conceptInvoice.details$.value,
      this._footer.currentfoot$.value.getdata()
    )

    console.log(invoice)
    await this.sales.saveInvoice(invoice)

    /* Se actualiza el index current en el talonario seleccionado */
    const stub = this.sales.stubSelect$.value
    stub.currentIndex = stub.currentIndex + 1
      this.stub.update(stub)
    
    this._alert.notify('la factura ha sido guardado con exito!')
    this.submited.emit()
  }

  async selectStubInvoice(event: MatSelectChange) {
    console.log(event.value)
    let stub = event.value
    if (stub != '') {
      this.sales.stubSelect$.next(stub)
      //if (this.sales.current$.value) {
        this.sales.stubSelect$.value!.prefixIndexCurrent = stub.prefix + '-' + ((stub.currentIndex || 0) + 1)
        console.log(this.sales.stubSelect$.value!.prefixIndexCurrent);

     // }
    }
  }


  async createCredit() {
    let valid = await this.sales.findNoteCredits(this.invoice!)
    if ( valid ){
      this._dialog.open(CreditDebitNoteDialogComponent, {
        width: '1200px',
        height: '400px',
        data: {document: 'credit',
              invoice: this.invoice}
      }).afterClosed().subscribe(concept => {
        this.concept = concept
        // this.sales.addConcept(concept)
      })
    }else{
      Swal.fire('No se puede aplicar mas notas de credito a esta factura')
    }
    
  }
  createDebit() {
    try {
      this._dialog.open(CreditDebitNoteDialogComponent, {
        width: '1200px',
        height: '400px',
        data: {document: 'debit',
              invoice:this.invoice}
      }).afterClosed().subscribe(concept => {
        this.concept = concept
      })
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
    this.stubForm.patchValue('')
    this.conceptInvoice.details$.next([])
    this.conceptInvoice.details_invoice$.next([])
    //this.conceptInvoice.details_Notes$.next([])
    this._footer.currentfoot$.next(null)

  }
}
