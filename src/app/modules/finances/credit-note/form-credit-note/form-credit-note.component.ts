import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MxAlert } from '@marxa/devkit';
import { FooterCreditoDebitoService } from '../../shared/footer-note/footer-notes.service';
import { DetailsConceptService } from '../../shared/invoice-details/invoice-details.service';
import { SalesService } from '../../sales-invoices/sales.service';
import { iStub } from '../../shared/stubs/stub.model';
import { CreditNoteService } from '../credit-note.service';
import { StubService } from '../../shared/stubs/stub.service';
import { TaxesService } from '../../shared/taxes/taxes.service';

@Component({
  selector: 'app-form-credit-note',
  templateUrl: './form-credit-note.component.html',
  styleUrls: ['./form-credit-note.component.scss']
})
export class FormCreditNoteComponent implements OnInit, OnDestroy {
  stubList: iStub[] = []
  nroStub: string = ''
  @Output() submited: EventEmitter<any> = new EventEmitter()


  constructor(
    public sales: SalesService,
    public credit: CreditNoteService,
    public stub: StubService,
    public footer_service: FooterCreditoDebitoService,
    public footer: FooterCreditoDebitoService,
    public invoiceConcept: DetailsConceptService,
    private _activatedRoute: ActivatedRoute,
    private _alert: MxAlert,
    private _taxes: TaxesService,
   

  ) {
    /* Recibo los parametros que llegan desde la URL */
    this._activatedRoute.params.subscribe(params => {
      this.credit.contextNC = params.tipo
      this.credit.invoiceId = params.invoiceId
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
    this.stubList = []
    this.credit.stubSelect$.next(null)
  }

  async ngOnInit(): Promise<void> {
    try {
      if (this.credit.invoiceId){
        await this.credit.getInvoice(this.credit.invoiceId)
        this.setFooter()
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
  setFooter(){
    if (!this.credit.contextNC) throw { message: ' No Se tiene el contexto'}
    this.credit.setFooter(this.credit.contextNC)
  }
  async save() {

    this.credit.saveCreditNote()
    
    if (this.credit.origin == 'creation'){
      this.submited.emit()
    }
  }

  selected(stub: iStub) {
    this.nroStub = stub.prefixIndexCurrent
  }


}
