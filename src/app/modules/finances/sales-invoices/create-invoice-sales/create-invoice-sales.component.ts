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
import { ClientModel } from 'src/app/modules/clients/clients.model';
import { ProductInvoiceModel } from '../../invoices/invoice.model';
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
  closesSub: Subscription

  @Input() invoice: SalesInvoiceModel | null = null

  stubForm: FormControl = new FormControl('')
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
    public sales: SalesService,
    public stub: StubService,
    private _cache: MxCache,
    private _dialog: MatDialog,
    private _alert: MxAlert,
    private _taxes: TaxesService,
    private _crud: MxCrudService
  ) {
    this.closesSub = this._crud.onClosed.subscribe(() => {
      this.stubForm.patchValue('')
    })
  }

  async ngOnInit() {
    if (this.invoice) {
      this.clientform.patchValue({
        // cip: this.invoice.cliente.name,
        name: this.invoice.client.name,
        // email: this.invoice.cliente.
      })
      this.salesForm.patchValue({
        client: this.invoice.client,
        seller: this.invoice.seller,
        date_expiration: this.invoice.action_date,
        currency: this.invoice.currency,
        date_emition: this.invoice.registered_date,
        payment_method: this.invoice.payment_method,
      })

      this.readOnlyForm()

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
      // cip: this.client.cip,
      name: this.client.name,
      // email: this.client.email
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

  /* Funcion que se encarga de actualizar el current con los cambios realizados en el concept */
  getChanges(changes: any) {
    this.sales.getChanges(changes, this.concept)
  }

  /* Funcion que se encarga de actualizar el current con los cambios del footer*/
  // getFooter(footer: InvoiceFooterModel) {
  //   this.sales.getFooter(footer)
  // }

  deleteConcept(concept: ProductInvoiceModel) {
    this.sales.deleteConcept(concept.product.UPC)
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

    /* Se actualiza el index current en el talonario seleccionado */
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
    this.stubForm.patchValue('seleccione')
  }

  async selectStubInvoice(event: MatSelectChange) {
    console.log(event.value)
    let stub = event.value
    if (stub != '') {
      this.sales.stubSelect$.next(stub)
      if (this.sales.current$.value) {
        this.sales.stubSelect$.value!.prefixIndexCurrent = stub.prefix + '-' + ((stub.currentIndex || 0) + 1)
        this.sales.updateCurrent('invoiceId', this.sales.stubSelect$.value!.prefixIndexCurrent)
        console.log(this.sales.stubSelect$.value!.prefixIndexCurrent);

      }
    }
  }


  createCredit() {
    this._dialog.open(CreditDebitNoteDialogComponent, {
      width: '1200px',
      height: '400px',
      data: 'credit'
    }).afterClosed().subscribe(concept => {
      this.concept = concept
      // this.sales.addConcept(concept)
    })
  }
  createDebit() {
    try {
      this._dialog.open(CreditDebitNoteDialogComponent, {
        width: '1200px',
        height: '400px',
        data: 'debit'
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
  }
}
