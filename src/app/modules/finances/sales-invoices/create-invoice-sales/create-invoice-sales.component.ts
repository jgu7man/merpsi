import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { PersonalService } from 'src/app/modules/admin/managers/personal.service';
import { ClientCreationModel } from 'src/app/modules/clients/clients.model';
import Swal from 'sweetalert2';
import { CreditNoteService } from '../../credit-note/credit-note.service';
import { FooterService } from '../../shared/footer-invoice/footer.service';
import { DetailsConceptService } from '../../shared/invoice-details/invoice-details.service';
import { Invoice, ProductInvoiceModel } from '../../shared/invoice.model';
import { iStub } from '../../stubs-invoice/stub.model';
import { StubService } from '../../stubs-invoice/stub.service';
import { TaxesService } from '../../taxes/taxes.service';
import { SalesInvoiceModel, SalesInvoiceReadingModel } from '../sales-invoice.model';
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
  client: ClientCreationModel | null = null
  concept: ProductInvoiceModel | null = null
  stubList: iStub[] = []
  stubSelect: iStub | null = null
  // closesSub: Subscription

  @Input() invoice: SalesInvoiceReadingModel | null = null

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
    public conceptInvoice: DetailsConceptService,
    private _cache: MxCache,
    private _dialog: MatDialog,
    private _alert: MxAlert,
    private _taxes: TaxesService,
    private _manager: PersonalService,
    private _footer: FooterService,
    private _credit: CreditNoteService

  ) {
  }

  async ngOnInit() {
    if (this.invoice) {
      this.clientform.patchValue({
        name: this.invoice.client.name,
      })
      this.salesForm.patchValue({
        seller: this.invoice.seller,
        currency: this.invoice.currency,
        payment_method: this.invoice.payment_method,
      })
      this.conceptInvoice.details_invoice$.next(this.invoice.details)
      this._footer.currentfoot_invoice$.next(this.invoice.footer)
    }
  }

  getValue(client_: ClientCreationModel) {
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
      if (concept) {
        this.concept = concept
      }
    })
  }

  get validationButtons(): boolean { 
    return ((this.salesForm.invalid || this.clientform.invalid) && (this.conceptInvoice.details$.value.length <= 0 || this.invoice != null))
  }

  async saveInvoice() {
    if (!this.client) throw { message: 'No existe el cliente' }
    if (!this.sales.stubSelect$.value) throw { message: 'No existe el talonario' }
    if (!this._manager.current) throw { message: 'No se ha iniciado la sesion' }
    if (!this._footer.currentfoot$.value) throw { message: ' No existe el footer' }


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

     this.sales.saveInvoice(invoice)

    this.clean()
    this._alert.notify('la factura ha sido guardado con exito!')
    this.submited.emit()
  }
  clean() {
    this._footer.currentfoot$.next(null)
    this.conceptInvoice.details$.next([])
    this._taxes.applidedTaxes = []
    this.sales.stubSelect$.next(null)
    this.salesForm.patchValue({
    seller: '',
    currency: '',
    payment_method: '',
    })
    this.client = null

  }

  async selectStubInvoice(event: MatSelectChange) {
    console.log(event.value)
    let stub = event.value
    if (stub != '') {
      this.sales.stubSelect$.next(stub)
      this.sales.stubSelect$.value!.prefixIndexCurrent = stub.prefix + '-' + ((stub.currentIndex || 0) + 1)
      console.log(this.sales.stubSelect$.value!.prefixIndexCurrent);
    }
  }


  async createCredit() {
    let valid = await this._credit.findNoteCredits(this.invoice!)
    if (valid) {
      this._dialog.open(CreditDebitNoteDialogComponent, {
        width: '1200px',
        height: '400px',
        data: {
          document: 'credit',
          invoice: this.invoice,
          origin: 'invoice'
        }
      }).afterClosed().subscribe(concept => {
        this.concept = concept
      })
    } else {
      Swal.fire('No se puede aplicar mas notas de credito a esta factura')
    }

  }
  async createDebit() {
    try {
      if ( !this.invoice) throw { message: 'No se encuentra la factura relacionada'}
      if ( this.invoice.avalibleAmount > 0 ) {
        this._dialog.open(CreditDebitNoteDialogComponent, {
          width: '1200px',
          height: '400px',
          data: {
            document: 'debit',
            invoice: this.invoice,
            origin: 'invoice'
          }
        }).afterClosed().subscribe(concept => {
          this.concept = concept
        })
      } else {
        Swal.fire('No puedes crear una Nota de Debito porque Existe una Nota de Credito de Anulacion para este Documento')
      }
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
    this._footer.currentfoot$.next(null)

  }
}
