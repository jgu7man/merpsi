import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import Swal from 'sweetalert2';
import { FooterService } from '../../invoices/footer-invoice/footer.service';
import { iProductInvoice } from '../../invoices/invoice.model';
import { SalesInvoiceModel } from '../../sales-invoices/sales-invoice.model';
import { SalesService } from '../../sales-invoices/sales.service';
import { iStub, StubModel } from '../../stubs-invoice/stub.model';
import { StubService } from '../../stubs-invoice/stub.service';
import { AppliedTaxModel } from '../../taxes/taxes.model';
import { TaxesService } from '../../taxes/taxes.service';
import { CreditNoteService } from '../credit-note.service';

@Component({
  selector: 'app-form-credit-note',
  templateUrl: './form-credit-note.component.html',
  styleUrls: ['./form-credit-note.component.scss']
})
export class FormCreditNoteComponent implements OnInit, OnDestroy{
  

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
  stubList: iStub[] = []
  stubSelect: iStub | null = null
  prefix: string = ''


  constructor(
    public sales: SalesService,
    public credit: CreditNoteService,
    public stub: StubService,
    private _cache: MxCache,
    private _activatedRoute: ActivatedRoute,
    private _alert: MxAlert,
    private _footer: FooterService,
    private _taxes: TaxesService,
  ) {
    this._activatedRoute.params.subscribe(params => {
      this.conceptNC = params.tipo
      this.invoiceId = params.invoiceId
    })
    this.stub.list$.pipe().subscribe( list => {
      list.forEach(d => {
          if (d.active && d.currentIndex < d.endIndex && d.type === 'credit') {
            this.stubList.push(d)
          }
        })
    })
  }
  ngOnDestroy(): void {
    this._taxes.leave()
    this.prefix =''
    this.stubSelect = null
    this.stubList = []
  }

  async ngOnInit(): Promise<void> {
    try {
      if ( !this.invoiceId ) throw { message: 'No existe invoiceId' }
      this.invoice_Ref = await this.credit.getInvoice(this.invoiceId)
      this.credit.nextCurrent(this.invoice_Ref)
      this.creditNoteForm.patchValue({
        concept: this.conceptNC,
        invoiceIdRef: this.invoice_Ref!.invoiceId
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
      let taxe: any = []
      /* destructuracion de taxes para que no se quede el modelo */
      noteCredit.footer.taxes.forEach(tax => { taxe.push({...tax}) })
      noteCredit.footer.taxes = taxe
      
        await this.credit.saveCreditNote(this.credit.currentNC$.value)
        /**Se actualiza el index current en el talonario seleccionado */
    if (this.stubSelect) {
      this.stubSelect.currentIndex = this.stubSelect.currentIndex + 1
      this.stub.update(this.stubSelect)
    }
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

  selectStub(stub: MatSelectChange) {
    this.stubSelect = stub.value
    if ( this.credit.currentNC$.value){
      if (this.stubSelect){
      let nro = this.stubSelect.prefix + '-' + ((this.stubSelect.currentIndex || 0) + 1)
      this.prefix = nro
      this.credit.updateCurrent('id',nro)
      }

    }

  }

  

}
