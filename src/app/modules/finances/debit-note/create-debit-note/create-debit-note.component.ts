import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { skip } from 'rxjs/operators';
import { Manager } from 'src/app/modules/admin/managers/manager.model';
import { PersonalService } from 'src/app/modules/admin/managers/personal.service';
import { CreditNoteService } from '../../credit-note/credit-note.service';
import { InvoiceFooterModel, iProductInvoice } from '../../invoices/invoice.model';
import { SalesInvoiceModel } from '../../sales-invoices/sales-invoice.model';
import { iStub } from '../../stubs-invoice/stub.model';
import { StubService } from '../../stubs-invoice/stub.service';
import { TaxesService } from '../../taxes/taxes.service';
import { DebitNoteModel } from '../debit-note.model';
import { DebitNoteService } from '../debit-note.service';

@Component({
  selector: 'app-create-debit-note',
  templateUrl: './create-debit-note.component.html',
  styleUrls: ['./create-debit-note.component.scss']
})
export class CreateDebitNoteComponent implements OnInit, OnDestroy {

  stubsList: iStub[] = [];
  stubSelect: iStub | null = null;
  date_emition: FormControl= new FormControl( '', [ Validators.required ] )
  nroStub: string = '';
  invoiceId: string = '';
  invoice_Ref: SalesInvoiceModel | null = null;

  constructor(
    public stub: StubService,
    public debit:DebitNoteService,
    public manager: PersonalService,
    private _alert: MxAlert,
    private _activatedRoute: ActivatedRoute,
    private _taxes: TaxesService

  ) { 
    this._activatedRoute.params.subscribe(params => {
      this.invoiceId = params.invoiceId
    })
    this.stub.list$.pipe(
    ).subscribe( stubs => {
      stubs.forEach(stub => {
        if (stub.active && stub.type == 'debit' && (stub.currentIndex < stub.endIndex)){
          this.stubsList.push( stub );
        }
      })
    })
    console.log(this.stubsList)

  }
  ngOnDestroy(): void {
    this._taxes.leave()
  }

  async ngOnInit(): Promise<void> {
    try {
      if ( !this.invoiceId ) throw { message: 'No existe invoiceId' }
      this.invoice_Ref = await this.debit.getInvoice(this.invoiceId)
      if ( !this.invoice_Ref ) throw { message: 'No se encontro la factura'}
      this.debit.footer$.next(new InvoiceFooterModel())
    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
    
  }

  seletedStub(stub: MatSelectChange){
    try {
      this.stubSelect = stub.value
      if (!this.stubSelect) throw { message: 'No se cargo el talonario'}
      this.nroStub =  this.stubSelect.prefix + this.index
    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
    
  }

  get index(){
    if (!this.stubSelect) throw { message: 'No se cargo el talonario'}
    return this.stubSelect.currentIndex + 1
  }

  getChanges(event: iProductInvoice) {
    this.debit.recalculate(event)
    
  }

  async save(){
    try {
      if ( !this.manager.current) throw { message: 'No se ha iniciado la sesion'}
      if ( !this.debit.details$.value) throw { message: 'No existe el detalle'}
      if ( !this.debit.footer$.value) throw { message: 'No existe el footer'}
      
      let taxesList: any[] = []
      this.debit.footer$.value.taxes.forEach(tax => {
        taxesList.push({...tax})
      })
      this.debit.footer$.value.taxes = taxesList
      this._taxes.applidedTaxes = taxesList
     // this.debit.footer$.value.taxes = {...this.debit.footer$.value.taxes}
      let ref =this.manager.managerRef
      let manager: Manager.invoice = {
        nombre: this.manager.current.name,
        ref
      }
      let invoice = {
        id: this.invoiceId,
        ref: this.debit.getInvoiceRef(this.invoiceId)
      }
      
     let debit: DebitNoteModel = new DebitNoteModel(invoice,this.nroStub,manager,this.debit.details$.value,this.debit.footer$.value)
     console.log(debit);
     
     this.debit.saveDebitNote(debit)
      /* se Actualiza el talonario*/
     if (this.stubSelect) {
      this.stubSelect.currentIndex = this.index
      this.stub.update(this.stubSelect)
    }

    this._alert.notify('La Nota de debito ha sido guardado con exito!')

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
