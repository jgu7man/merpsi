import { AbstractControl, FormGroup } from "@angular/forms"

/** Item de impuesto */
export class TaxModel { 
  constructor (
    readonly index: number,
    /** Nombre del impuesto */
    public name: string,
    /** Tasa de impuesto en `float` */
    public rate: number,
    /** Descripción */
    public description: string = '',
  ){}
}

export interface GlobalTax extends Omit<TaxModel, 'index'> {
  /** País en clave alpha2 del impuesto para el producto */
  readonly country: string,
}

export namespace Tax {
  
  export type data = Omit<TaxModel, 'index'>
  
  export interface form extends FormGroup {
    value: Tax.data,
    controls: {
      name: AbstractControl,
      rate: AbstractControl,
      description: AbstractControl
    }
  }

  export interface list {
    list: TaxModel[]
  }
}

export class TaxAmountModel {
  /** Nombre del impuesto */
  readonly name: string
  /** Tasa de impuesto en `float` */
  readonly rate: number = 0
  /** Monto al cuál se le aplicará el impuesto */
  public applied_amount: number = 0
  /** Resultado de multiplicar el monto aplicado por la tasa del impuesto */
  get amount() { return (this.rate * this.applied_amount) || 0}

  constructor (
    /** Impuesto seleccionado */
    tax: TaxModel,
  ) {
    // this.amount = tax.rate * applied_amount
    this.name = tax.name
    this.rate = tax.rate
  }
}

export namespace TaxAmount {

  export type data = Omit<TaxAmountModel, 'name' | 'rate'>


  export interface iTaxAmount {
    /** Nombre del impuesto */
    name: string,
    /** Tasa de impuesto en `float` */
    rate: number,
    /** Valor resultado del impuesto */
    amount: number
  }


}


