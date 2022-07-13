import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { FooterCreditoDebitoService } from '../../shared/footer-note/footer-notes.service';
import { DetailsConceptService } from '../../shared/invoice-details/invoice-details.service';
import { SalesInvoiceReadingModel } from '../../sales-invoices/sales-invoice.model';
import { iStub } from '../../stubs-invoice/stub.model';
import { StubService } from '../../stubs-invoice/stub.service';
import { TaxesService } from '../../taxes/taxes.service';
import { DebitNoteService } from '../debit-note.service';

@Component({
  selector: 'app-create-debit-note',
  templateUrl: './create-debit-note.component.html',
  styleUrls: ['./create-debit-note.component.scss']
})
export class CreateDebitNoteComponent implements OnInit, OnDestroy {

  stubsList: iStub[] = [];
  stubSelect: iStub | null = null;
  emition_date: FormControl = new FormControl('', [Validators.required])
  nroStub: string = '';
  invoiceId: string = '';
  invoice: SalesInvoiceReadingModel | null = null;
  origin: any;
  @Output() submited: EventEmitter<any> = new EventEmitter();
  
  constructor(
    public stub: StubService,
    public debit: DebitNoteService,
    public invoiceConcept: DetailsConceptService,
    public footer: FooterCreditoDebitoService,
    private _alert: MxAlert,
    private _activatedRoute: ActivatedRoute,
    private _taxes: TaxesService,
  ) {
    this._activatedRoute.params.subscribe(params => {
      this.invoiceId = params.invoiceId
    })
    this.stub.list$.pipe(
    ).subscribe(stubs => {
      stubs.forEach(stub => {
        if (stub.active && stub.type == 'debit' && (stub.currentIndex < stub.endIndex)) {
          this.stubsList.push(stub);
        }
      })
      this.debit.stubList$.next(this.stubsList)

    })
    console.log(this.stubsList)

  }
  ngOnDestroy(): void {
    this._taxes.leave()
  }

  async ngOnInit(): Promise<void> {
      if (this.invoiceId){
        this.debit.getInvoice(this.invoiceId)
        this.debit.setFooter()
      }
  }
  

  


  async save() {      
    this.debit.saveDebitNote()
    if ( this.debit.origin == 'creacion' ){
      this.submited.emit()
    }
  }

  

}
