import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { PersonalService } from 'src/app/modules/admin/managers/personal.service';
import { FooterNoteModel } from '../../credit-note/creditNote.model';
import { FooterCreditoDebitoService } from '../../shared/footer-note/footer-notes.service';
import { DetailsConceptService } from '../../shared/invoice-details/invoice-details.service';
import { CreditDebitNoteDialogComponent } from '../../sales-invoices/create-invoice-sales/credit-debit-note.dialog/credit-debit-note.dialog.component';
import { iSalesInvoice, SalesInvoiceModel, SalesInvoiceReadingModel } from '../../sales-invoices/sales-invoice.model';
import { iStub } from '../../stubs-invoice/stub.model';
import { StubService } from '../../stubs-invoice/stub.service';
import { AppliedTaxModel, TaxModel } from '../../taxes/taxes.model';
import { TaxesService } from '../../taxes/taxes.service';
import { DebitNoteModel, NoteDebit } from '../debit-note.model';
import { DebitNoteService } from '../debit-note.service';
import { Invoice } from '../../shared/invoice.model';

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
  invoice_Ref: SalesInvoiceModel | null = null;
  invoice: SalesInvoiceReadingModel | null = null;
  origin: any;
  @Output() submited: EventEmitter<any> = new EventEmitter();
  
  constructor(
    public stub: StubService,
    public debit: DebitNoteService,
    public manager: PersonalService,
    public invoiceConcept: DetailsConceptService,
    public footer: FooterCreditoDebitoService,
    private _alert: MxAlert,
    private _activatedRoute: ActivatedRoute,
    private _taxes: TaxesService,
    private _dialog: MatDialog,
    private _router: Router,
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
    try {
      console.log(this.invoiceId);
      
      if (this.invoiceId){
        this.invoice_Ref = await this.debit.getInvoice(this.invoiceId)
        
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
  setFooter() {
    if (!this.invoice_Ref) throw { message: 'No se encontro la factura' }
    let footer_tax = this.invoice_Ref.footer.taxes
        let taxs: TaxModel[] = footer_tax.map(tax => { return new TaxModel(0, tax.name, tax.rate) })
        let det = this.invoiceConcept.details_Notes$.value
        let amount = det.reduce((acc, item) => acc + item.amount, 0)
        let amount_tax = 0
        taxs.map(tax => {
          amount_tax = amount_tax + (new AppliedTaxModel(tax, amount)).amount
        })
        amount = amount + amount_tax
        this.footer.footer$.next(new FooterNoteModel(this.invoice_Ref.footer, this.invoiceConcept.details_Notes$.value, amount, taxs))
        console.log(this.footer.footer$.value);
        console.log(this.invoiceConcept.details_Notes$.value);
  }

  seletedStub(data: MatSelectChange) {
    try {
      this.debit.stubSelect$.next(data.value)
      if (!this.debit.stubSelect$.value) throw { message: ' No existe el talonario' }
      let stub = this.debit.stubSelect$.value
      stub.prefixIndexCurrent = stub.prefix + ((stub.currentIndex || 0) + 1)
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
      if (!this.manager.current) throw { message: 'No se ha iniciado la sesion' }
      if (!this.invoiceConcept.details_Notes$.value) throw { message: 'No existe el detalle' }
      if (!this.footer.footer$.value) throw { message: 'No existe el footer' }
      if (!this.invoice_Ref) throw { message: 'No existe la factura de referencia' }
      if (!this.debit.stubSelect$.value) throw { message: 'No existe el talonario' }

      if (this.footer.footer$.value.total > 0) {
        const manager: Invoice.manager = {
          id: this.manager.current.uid!,
          name: this.manager.current.name,
          ref: this.manager.managerRef
        }
        
        const debit: DebitNoteModel = new DebitNoteModel(
          this.invoice_Ref.invoiceId,
          this.debit.stubSelect$.value.prefixIndexCurrent,
          manager,
          this.invoiceConcept.details_Notes$.value,
          this.footer.footer$.value
        )
        this.debit.saveDebitNote(debit)
        this._alert.notify('La Nota de debito ha sido guardado con exito!')

        if ( this.origin == 'creation'){
          this.submited.emit()
        }else{
          this._router.navigate([`business/${this.debit.businessCRF}/finances/sales`])
        }
    
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

  getValue(invoice: iSalesInvoice){
    try {
      if (!this.debit.businessCRF)  throw { message: 'No Se ha iniciado sesion'}
      this.invoice = new SalesInvoiceReadingModel(invoice,this.debit.businessCRF)
      this._dialog.open(
        CreditDebitNoteDialogComponent,{
          width: '1200px',
          height: '400px',
          data: {
            document: 'debit',
            invoice:  this.invoice,
            origin: 'creation'
          }
      }).afterClosed().subscribe( data =>{
        this.invoiceId = data.invoiceId
        this.origin = data.origin
        this.invoice_Ref = invoice  
        this.setFooter()      
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

}
