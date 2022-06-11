import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { PersonalService } from 'src/app/modules/admin/managers/personal.service';
import Swal from 'sweetalert2';
import { FooterCreditoDebitoService } from '../../invoices/footer-credito-debito/footer-credito-debito.service';
import { InvoiceConceptService } from '../../invoices/invoice-concept/invoice-concept.service';
import { Invoice } from '../../invoices/invoice.model';
import { SalesInvoiceModel } from '../../sales-invoices/sales-invoice.model';
import { SalesService } from '../../sales-invoices/sales.service';
import { iStub } from '../../stubs-invoice/stub.model';
import { StubService } from '../../stubs-invoice/stub.service';
import { AppliedTaxModel, TaxModel } from '../../taxes/taxes.model';
import { TaxesService } from '../../taxes/taxes.service';
import { CreditNoteService } from '../credit-note.service';
import { CreditNoteModel, FooterNoteModel } from '../creditNote.model';

@Component({
  selector: 'app-form-credit-note',
  templateUrl: './form-credit-note.component.html',
  styleUrls: ['./form-credit-note.component.scss']
})
export class FormCreditNoteComponent implements OnInit, OnDestroy {


  invoice_Ref: SalesInvoiceModel | null = null
  conceptNC: string = ''
  invoiceId: string | null = null


  taxes: AppliedTaxModel[] = []
  stubList: iStub[] = []
  stubSelect: iStub | null = null
  prefix: string = ''


  constructor(
    public sales: SalesService,
    public credit: CreditNoteService,
    public stub: StubService,
    public footer_service: FooterCreditoDebitoService,
    public footer: FooterCreditoDebitoService,
    public invoiceConcept: InvoiceConceptService,
    private _activatedRoute: ActivatedRoute,
    private _alert: MxAlert,
    private _taxes: TaxesService,
    private _manager: PersonalService,

  ) {
    /* Recibo los parametros que llegan desde la URL */
    this._activatedRoute.params.subscribe(params => {
      this.conceptNC = params.tipo
      this.invoiceId = params.invoiceId
    })
    /* Se carga la lista de laos Talonarios de NC*/
    this.stub.list$.pipe().subscribe(list => {
      list.forEach(d => {
        if (d.active && d.currentIndex < d.endIndex && d.type === 'credit') {
          this.stubList.push(d)
        }
      })
      this.credit.stubList$.next(this.stubList)
    })
  }
  ngOnDestroy(): void {
    this._taxes.leave()
    this.prefix = ''
    this.stubSelect = null
    this.stubList = []
    this.credit.stubSelect$.next(null)
  }

  async ngOnInit(): Promise<void> {
    try {
      if (!this.invoiceId) throw { message: 'No existe invoiceId' }

      this.invoice_Ref = await this.credit.getInvoice(this.invoiceId)
      if (!this.invoice_Ref) throw { message: 'No Existe la factura relacionada' }

      /* se obtienen los impuestos colocados en la factura para aplicarselos al concepto de la Nota de credito*/
      let footer_tax = this.invoice_Ref.footer.taxes
      let taxe: TaxModel[] = footer_tax.map(tax => { return new TaxModel(0, tax.name, tax.rate) })

      if (this.conceptNC == 'disminucion') {
        let det = this.invoiceConcept.details_Notes$.value
        /* se calcula el subtotal de los detalles de la nota de credito */
        let amount = det.reduce((acc, item) => acc + item.amount, 0)
        let amount_tax = 0
        /* se calcula el monto total de los impuestos y se le suma al subtotal para sacar el total de los conceptos de la factura 
        y poder aplicar la formula de (totalFactura - total de conceptos) = 0  */
        taxe.map(tax => { amount_tax = amount_tax + (new AppliedTaxModel(tax, amount)).amount })
        amount = amount + amount_tax


        const foot = new FooterNoteModel(this.invoice_Ref.footer, det, amount, taxe)
        this.footer.footer$.next(foot)
      } else {
        const foot = new FooterNoteModel(this.invoice_Ref.footer, this.invoiceConcept.details_Notes$.value, null, taxe)
        this.footer.footer$.next(foot)
      }
      console.log(this.invoiceConcept.details_Notes$.value);


    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }

  }
  async save() {
    try {
      if (!this.credit.stubSelect$.value) throw { message: ' No existe el talonario' }
      if (!this.footer_service.footer$.value) throw { message: ' No existe el footer' }
      if (!this.invoice_Ref) throw { message: ' No existe la factura de referencia' }
      if (!this._manager.current) throw { message: 'No se ha iniciado la sesion' }

      if (this.footer_service.footer$.value.total > 0) {
        if (this.footer_service.footer$.value.total <= this.invoice_Ref.footer.total) {
          const manager: Invoice.manager = {
            id: this._manager.current.uid!,
            name: this._manager.current.name,
            ref: this._manager.managerRef
          }
          let noteCredit = new CreditNoteModel(
            this.invoice_Ref.invoiceId,
            this.credit.stubSelect$.value.prefixIndexCurrent,
            manager,
            this.conceptNC,
            this.invoiceConcept.details_Notes$.value,
            this.footer_service.footer$.value
          )
          this.credit.saveCreditNote(noteCredit)


        } else {
          Swal.fire(`El total de la Nota de Credito no puede ser mayor a ${this.invoice_Ref.footer.total}`)
        }
      } else {

        Swal.fire(`El total de la Nota de Credito no puede ser 0.00`)
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


  selectStub(data: MatSelectChange) {
    this.credit.stubSelect$.next(data.value)
    if (!this.credit.stubSelect$.value) throw { message: ' No existe el talonario' }
    let stub = this.credit.stubSelect$.value
    stub.prefixIndexCurrent = stub.prefix + '-' + ((stub.currentIndex || 0) + 1)
  }

}
