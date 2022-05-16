import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import Swal from 'sweetalert2';
import { FooterService } from '../../invoices/footer-invoice/footer.service';
import { iProductInvoice } from '../../invoices/invoice.model';
import { SalesInvoiceModel } from '../../sales-invoices/sales-invoice.model';
import { SalesService } from '../../sales-invoices/sales.service';
import { AppliedTaxModel } from '../../taxes/taxes.model';
import { CreditNoteService } from '../credit-note.service';

@Component({
  selector: 'app-form-credit-note',
  templateUrl: './form-credit-note.component.html',
  styleUrls: ['./form-credit-note.component.scss']
})
export class FormCreditNoteComponent implements OnInit {
  

  businessRef = this._cache.getDataKey('eid')
  invoice_Ref: SalesInvoiceModel | null = null
  conceptNC: string = ''
  invoiceId: string | null = null

  creditNoteForm: FormGroup = new FormGroup({
    date_emition: new FormControl(''),
    noteId: new FormControl(''),
    invoiceIdRef: new FormControl(''),
    concept: new FormControl(this.conceptNC),
  })

  @Output() submited: EventEmitter<any> = new EventEmitter()
  taxes: AppliedTaxModel[] = []


  constructor(
    private _cache: MxCache,
    public sales: SalesService,
    public credit: CreditNoteService,
    private activatedRoute: ActivatedRoute,
    private _alert: MxAlert,
    private _footer: FooterService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.conceptNC = params.tipo
      this.invoiceId = params.invoiceId
    })
  }

  async ngOnInit(): Promise<void> {
    try {
      if ( !this.invoiceId ) throw { message: 'No existe invoiceId' }
      this.invoice_Ref = await this.credit.getInvoice(this.invoiceId)
      this.credit.nextCurrent(this.invoice_Ref)
      this.creditNoteForm.patchValue({
        concept: this.conceptNC,
        invoiceIdRef: this.invoice_Ref!.invoice_ID
      })
      if ( this.conceptNC == 'anulacion'){
        if ( !this.credit.currentSales$.value ) throw { message: 'No existe el currentSales'}
        this._footer.currentfoot$.next(this.credit.currentSales$.value.footer)
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



  async save() {

    try {
      if (!this.credit.currentNC$.value) throw { message: 'No existe el current de nota de credito'}
      let noteCredit = this.credit.currentNC$.value
      noteCredit.noteId = this.creditNoteForm.controls.noteId.value
      let taxe: any = []
      /* destructuracion de taxes para que no se quede el modelo */
      noteCredit.footer.taxes.forEach(tax => { taxe.push({...tax}) })
      noteCredit.footer.taxes = taxe
      
        await this.credit.saveCreditNote(this.credit.currentNC$.value)
       console.log(this.credit.currentNC$.value)
        Swal.fire('Guardado')
    
    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
  }

  getChanges(event: iProductInvoice) {
    this.credit.recalculate(event, this.conceptNC)
    
  }

}
