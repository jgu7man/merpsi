import { Injectable } from '@angular/core';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { BehaviorSubject } from 'rxjs';
import { TaxesService } from '../../taxes/taxes.service';
import { FooterService } from '../footer-invoice/footer.service';
import { Invoice, ProductInvoiceModel } from '../invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceConceptService {

  details$ = new BehaviorSubject<ProductInvoiceModel[]>([])
  constructor(
    private _footer: FooterService,
    private _alert: MxAlert,
    private _taxes: TaxesService
  ) { }

  /**
   *  Metodo usado para actualizar el los cambios que llegan desde el formulario 
   * @param changes cambios que llegan desde el formulario (cantidad y precio unitario)
   * @param concept concepto de la fila
   */
  update(changes: { cant: number, unit_price: number }, concept: ProductInvoiceModel) {
    console.log(changes);
    let subtotal = 0
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

  get subtotal(): number {
    let details = this.details$.value
    let subtotal = details.reduce( (subtotal,det) => subtotal + det.amount,0)
    return subtotal
  }

  delete(concept: ProductInvoiceModel) {
    try {
      if (!this.details$.value) throw { message: ' No existe los detalles' }
      if (!this._footer.currentfoot$.value) throw { message: ' No existe el footer' }

      /* Se filtra el array de detalles para excluir el concepto que se elimino */
      let details = this.details$.value.filter(c => c.product.UPC !== concept.product.UPC)
      /* Actualizamos los detalles con la informacion del filtrado */
      this.details$.next(details)
      
      let foot =  this._footer.currentfoot$.value
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

  get recalculateTaxes(){
    if (!this._footer.currentfoot$.value) throw { message: ' No existe el footer' }
    let subtotal = this._footer.currentfoot$.value.subtotal
    let taxes = this._taxes.applidedTaxes
    taxes.map( tax=> {
      this._taxes.calcTax(tax,subtotal)
    })
    return this._taxes.applidedTaxes
  }
}
