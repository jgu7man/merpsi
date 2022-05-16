import { AbstractControl, FormGroup } from "@angular/forms"

/** Item de impuesto */
export class TaxModel { 
  /** Identificador del impuesto */
  slug: string

  constructor (
    readonly index: number,
    /** Nombre del impuesto */
    public name: string,
    /** Tasa de impuesto en number */
    public rate: number,
    /** Descripción */
    public description: string = '',
  ) {
    this.slug = name.toLowerCase()
    .replace( /\s/g, '-' )
    .replace(/\//g, '-')
    .replace(/\./g, '')
    .replace(/,/g, '')
    .replace(/@/g, '-')
  }
  
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

  export interface applied {
    
  }
}

export class AppliedTaxModel extends TaxModel {
  /** Resultado de multiplicar el monto aplicado por la tasa del impuesto */
  
  amount: number
  constructor (
    /** Impuesto seleccionado */
    tax: TaxModel,
    /** Monto al cuál se le aplicará el impuesto */
    public amount_base: number = 0,
    ) {
      super(tax.index, tax.name, tax.rate)
      this.amount = this.amount_calc
    }
    
    get amount_calc() { return ((this.rate / 100) * this.amount_base) || 0}
}

// export class AppliedTaxReverseModel extends TaxModel {
//   /** Resultado de multiplicar el monto aplicado por la tasa del impuesto */
  
//   amount: number
//   constructor (
//     /** Impuesto seleccionado */
//     tax: TaxModel,
//     /** Monto al cuál se le aplicará el impuesto */
//     public total: number
//     ) {
//       super(tax.index, tax.name, tax.rate)
//       this.amount = this.amount_base
//     }
    
//     get amount_base():number { return (this.total / (1 + (this.rate / 100))) || 0}}

export interface iAppliedTax extends Omit<AppliedTaxModel,'data'>{}





