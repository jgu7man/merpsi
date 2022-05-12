import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { Footer } from 'primeng/api';
import { iInvoiceFooter, iProductInvoice } from '../../invoices/invoice.model';
import { SalesInvoiceModel } from '../../sales-invoices/sales-invoice.model';
import { SalesService } from '../../sales-invoices/sales.service';
import { CreditNoteService } from '../credit-note.service';

@Component({
  selector: 'app-form-credit-note',
  templateUrl: './form-credit-note.component.html',
  styleUrls: ['./form-credit-note.component.scss']
})
export class FormCreditNoteComponent implements OnInit {

  businessRef = this._cache.getDataKey('eid')
  invoice_Ref: SalesInvoiceModel | null = null
  conceptNC: number = 1
  invoiceId: string | null = null

  creditNoteForm: FormGroup = new FormGroup({
    date_emition: new FormControl(''),
    invoiceId: new FormControl(''),
    invoiceIdRef: new FormControl(''),
    manager: new FormControl(''),
    concept: new FormControl(this.conceptNC),
  })

  @Output() submited: EventEmitter<any> = new EventEmitter()


  constructor(
    private _cache: MxCache,
    public sales: SalesService,
    public credit: CreditNoteService,
    private activatedRoute: ActivatedRoute,
    private _alert: MxAlert
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.conceptNC = params.tipo
      this.invoiceId = params.invoiceId
    })
  }

  async ngOnInit(): Promise<void> {
    console.log(this.sales.current$.value)
    if (this.invoiceId ) {
      this.invoice_Ref = await this.credit.getInvoice(this.invoiceId)
      this.credit.nextCurrent(this.invoice_Ref)
      this.creditNoteForm.patchValue({
        concept: this.conceptNC,
        invoiceIdRef: this.invoice_Ref!.invoice_ID
      })
    }
  }



  async save() {
    if (this.credit.currentNC$.value) {
      if (this.credit.currentNC$.value.footer.total <= this.invoice_Ref!.footer.total) {
        //  this.credit.saveCreditNote(this.credit.currentNC$.value.details,
        //    this.creditNoteForm.value, 
        //    this.conceptNC,
        //    this.invoice_Ref!)
        this.submited.emit()
      } else {
        this._alert.notify('El total del Documento no debe ser mayor a la factura referenciada ')
      }
    }

  }

  getChanges(event: iProductInvoice) {
    
    this.credit.recalculate(event)
    console.log('---getchanges----');
    console.log(this.invoice_Ref?.footer.subtotal);
  }

  getFooter(foot: iInvoiceFooter) {
    if (this.credit.currentNC$.value) {
      this.credit.getFooter(foot, this.credit.currentNC$.value)
    }
    console.log('---footer----');
    console.log(this.invoice_Ref?.footer.subtotal);
  }

}
