import { Injectable } from '@angular/core';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { BehaviorSubject } from 'rxjs';
import { CreditNoteService } from '../../credit-note/credit-note.service';
import { ProductNoteModel } from '../../credit-note/creditNote.model';
import { TaxModel } from '../../taxes/taxes.model';
import { TaxesService } from '../../taxes/taxes.service';
import { FooterCreditoDebitoService } from '../footer-credito-debito/footer-credito-debito.service';
import { FooterService } from '../footer-invoice/footer.service';
import { Invoice, InvoiceFooter, ProductInvoiceModel } from '../invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceConceptService {

  details$ = new BehaviorSubject<ProductInvoiceModel[]>([])
  details_Notes$ = new BehaviorSubject<ProductNoteModel[]>([])
  details_invoice$ = new BehaviorSubject<Invoice.concept[]>([])
  constructor(
    private _footer: FooterService,
    private _footer_note: FooterCreditoDebitoService,
    private _alert: MxAlert,
    private _taxes: TaxesService,
   // private _credito: CreditNoteService
  ) { }

  /**
   *  Metodo usado para actualizar el los cambios que llegan desde el formulario 
   * @param changes cambios que llegan desde el formulario (cantidad y precio unitario)
   * @param concept concepto de la fila
   */
  update(changes: { cant: number, unit_price: number }, concept: ProductInvoiceModel | Invoice.concept, document: string = '',concept_NC: string = '') {
    console.log(changes);
    let subtotal = 0
   
    if ( document == 'credit' || document == 'debit'){
        if (this.details_Notes$.value) {
          let details = this.details_Notes$.value.map((d) => {
            if (d.product.UPC == concept.product.UPC) {
              d.cant = changes.cant
              d.unit_price = changes.unit_price
            }
            subtotal += d.amount
            return d
          })
          this.details_Notes$.next(details)
        }
        if (!this._footer_note.footer$.value) throw { message: ' No existe el footer_invoice' }
        let foot = this._footer_note.footer$.value
        /*Se le informa al footer el subtotal de todos los conceptos*/
        foot.subtotal = subtotal
        let suma = (foot.subtotal + foot.shipping) - (foot.discount)
        foot.taxes.map(tax =>{
          let taxmodel = new TaxModel(0,tax.name, tax.rate)
          return this._taxes.calcTax(taxmodel,suma)
        })
        foot.taxes = this._taxes.applidedTaxes
        this._footer_note.footer$.next(foot)
        console.log(this._footer_note.footer$.value);
        console.log(this.details_Notes$.value);
        
      }else{
      if (this.details$.value) {
        let details = this.details$.value.map((d) => {
          if (d.product.UPC == concept.product.UPC) {
            d.cant = changes.cant
            d.unit_price = changes.unit_price
          }
          subtotal += d.amount
          return d
        })
        this.details$.next(details)
      }
      if (!this._footer.currentfoot$.value) throw { message: ' No existe el footer' }
      let foot = this._footer.currentfoot$.value
      /*Se le informa al footer el subtotal de todos los conceptos*/
      foot.subtotal = subtotal
      this._footer.currentfoot$.next(foot)
      console.log(this.details$.value);
    }



  }

  get subtotal(): number {
    let details = this.details$.value
    let subtotal = details.reduce((subtotal, det) => subtotal + det.amount, 0)
    return subtotal
  }

  delete(concept: ProductInvoiceModel | Invoice.concept) {
    try {
      if (!this.details$.value) throw { message: ' No existe los detalles' }
      if (!this._footer.currentfoot$.value) throw { message: ' No existe el footer' }

      /* Se filtra el array de detalles para excluir el concepto que se elimino */
      let details = this.details$.value.filter(c => c.product.UPC !== concept.product.UPC)
      /* Actualizamos los detalles con la informacion del filtrado */
      this.details$.next(details)

      let foot = this._footer.currentfoot$.value
      /* calculamos nuevamente el subtotal de los conceptos actuales */
      foot.subtotal = this.subtotal
      foot.taxes = this.recalculateTaxes
      console.log(foot.taxes);

      this._footer.currentfoot$.next(foot)


    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
  }

  get recalculateTaxes() {
    if (!this._footer.currentfoot$.value) throw { message: ' No existe el footer' }
    let subtotal = this._footer.currentfoot$.value.subtotal
    let taxes = this._taxes.applidedTaxes
    taxes.map(tax => {
      this._taxes.calcTax(tax, subtotal)
    })
    return this._taxes.applidedTaxes
  }
}
