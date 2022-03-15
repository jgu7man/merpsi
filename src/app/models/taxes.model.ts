
/** Item de impuesto */
export interface iTax {
  /** País en clave alpha2 del impuesto para el producto */
  readonly country: string,
  /** Tasa de impuesto en `float` */
  rate: number,
  /** Nombre del impuesto */
  name: string,
}

export class TaxAmountModel {
  /** Nombre del impuesto */
  public name: string
  /** Tasa de impuesto en `float` */
  public rate: number
  /** Resultado de multiplicar el monto aplicado por la tasa del impuesto */
  public amount

  constructor (
    /** Impuesto seleccionado */
    tax: iTax,
    /** Monto al cuál se le aplicará el impuesto */
    applied_amount: number,
  ) {
    this.amount = tax.rate * applied_amount
    this.name = tax.name
    this.rate = tax.rate
  }
}

export interface iTaxAmount {
  /** Nombre del impuesto */
  name: string,
  /** Tasa de impuesto en `float` */
  rate: number,
  /** Valor resultado del impuesto */
  amount: number
}