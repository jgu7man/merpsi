import { createDate, FireRef, FireTime } from "src/app/models/firestore.model";
import { Product } from "../../inventory/products/products.model";
import { SalesInvoiceModel } from "../sales-invoices/sales-invoice.model";
import { Invoice } from "../shared/invoice.model";
import { AppliedTaxModel, iAppliedTax, TaxModel } from "../shared/taxes/taxes.model";

/**
 *Modelo Para crear una nota de credito Nota de Credito 
 *
 * @export
 * @class CreditNoteModel
 */
export class CreditNoteModel {
  // Fecha de Emision
  emition_date: FireTime = createDate(new Date())
  //Referencia de la Factura
  invoiceRef: FireRef<SalesInvoiceModel> | null = null
  footer: Invoice.footer
  /*Lista de Conceptos */
  details: NoteCredit.concept[]

  constructor (
    public invoiceId: string,
    //Nro de Documento (segun el Talonario)
    public id: string,
    public manager: Invoice.manager,
    // concepto del documento: Disminucion, Anulacion, Devolucion
    public context: NoteCredit.context,
    details: ProductNoteModel[],
    footer: FooterNoteModel,
  ) {
    this.details = details.map(details => {
      return details.getdata()
    })
    this.footer = footer.getdata()
  }

}

export class ProductNoteModel {
  /** Precio unitaio de venta */
  public unit_price: number = 0
  /** Costo unitario del producto comprado */
  public unit_cost: number = 0
  /** Cantidad de productos comprados */
  public cant: number = 0
  public store: string | null
  product: Product.MainData
  transfer_fee?: Invoice.concept.transfer | null

  constructor(
    //data?: Invoice.concept,
    cant: number,
    unit_price: number,
    store:string | null,
    product: Product.MainData,
    public stock: number = 0,
  ) {
    this.cant =  cant
    this.unit_price = unit_price
    this.store = store
    this.stock = stock
    this.product = product
    this.transfer_fee = null
  }

  /** Resultado de multiplicar cantidad por costo unitario del producto */
  get amount(): number {
    return this.unit_price * (this.cant || 1)
  }

  getdata(): Invoice.concept {
    let { getdata: concept, ...object } = this
    return {
      ...object,
      product: this.product,
      amount: this.amount
    }
  }
}
/**
 *Informacion de los totales de la nota de Credito
 *
 * @export
 * @class FooterNoteModel
 */
export class FooterNoteModel {
  public subtotal: number = 0
  public discount: number = 0
  public shipping: number = 0
  public taxes: iAppliedTax[] = []

  constructor(
    data?: Invoice.footer,
    details: NoteCredit.concept[] | null = null,
    public amount_invoice: number | null = null,
    taxes?: TaxModel[]

  ) {
    this.subtotal = details ? details.reduce((acc, item) => acc + item.amount, 0) : 0
    this.discount = data ? data.discount : 0
    this.shipping = data ? data.shipping : 0
    this.taxes = taxes ? this.calcTaxes(taxes): []
  }

  /*Calcula los impuestos cuando el subtotal cambia */
  calcTaxes(taxes: TaxModel[]){
    return taxes.map(tax =>{
      return new AppliedTaxModel(tax, this.subtotal)
    })
  }

  // Calcula el monto total de los impuestos
  get taxesAmount(): number {
    return this.taxes.reduce((total, tax) => total + tax.amount, 0)
  }
  /** Total de restar descuentos e impuestos y agregando de costo de envío */
  get total(): number {
    let totalNC = ((this.subtotal + this.shipping) + this.taxesAmount) - this.discount
    if (this.amount_invoice) {
      totalNC =  this.amount_invoice - totalNC
    }
    return Math.abs(totalNC)
  }


  /** Extracción del modelo */
  getdata(): NoteCredit.footer {
    let { getdata, ...object } = this
    let taxes = this.taxes.map(tax => {
      return { ...tax }
    })
    return { ...object, total: this.total, taxesAmount: this.taxesAmount, taxes: taxes }
  }
}


export declare namespace NoteCredit {
  // Se usa en la lectura de los documentos relacionados
  interface concept extends Omit<ProductNoteModel, 'getdata'> { }
  // se usa para la extracción del modelo en FooterNote
  interface footer extends Omit<FooterNoteModel, 'data' | 'getdata' | 'amount_invoice' | 'calcTaxes' > { }
  // conceptos de la nota de Credito
  type context = 'disminucion' | 'devolucion' | 'anulacion'

}

export interface iCreditNote extends Omit<CreditNoteModel,'getData'> {}

// Se usa para el current de la lista de conceptos
export interface iProductNote extends Omit<ProductNoteModel,'getData'> {}
