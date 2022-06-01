import { createDate, FireDoc, FireRef, FireTime } from "src/app/models/firestore.model";
import { Product } from "../../inventory/products/products.model";
import { Invoice, InvoiceFooter } from "../invoices/invoice.model";
import { SalesInvoiceModel } from "../sales-invoices/sales-invoice.model";
import { iAppliedTax } from "../taxes/taxes.model";

export class CreditNoteModel {
  date_emition: FireTime = createDate(new Date())
  invoiceId: string
  invoiceRef: FireRef<SalesInvoiceModel> | null = null
  id: string
  manager: string
  concept: string
  footer: NoteCredit.footer
  details: NoteCredit.concept[]
  constructor(
    invoiceId: string,
    noteId: string,
    manager: string,
    concept: string,
    details: NoteCredit.concept[],
    footer: InvoiceFooter,
  ) {
    this.invoiceId = invoiceId
    this.id = noteId
    this.manager = manager
    this.concept = concept
    this.details = details
    this.footer = footer
  }

}

export class ProductNoteModel {
  /** Precio unitaio de venta */
  public unit_price: number = 0
  /** Costo unitario del producto comprado */
  public unit_cost: number = 0
  /** Cantidad de productos comprados */
  public cant?: number = 0
  public store: string | null
  product: Product.MainData

  constructor(
    data: Invoice.concept | NoteCredit.concept,
    public stock: number = 0,
  ) {
    this.cant = data.cant || 0
    this.unit_price = data.unit_price
    this.store = data.store
    this.stock = data.stock
    this.product = data.product
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

export class FooterNoteModel {
  public subtotal: number = 0
  public discount: number = 0
  public shipping: number = 0
  public taxes: iAppliedTax[] = []
  constructor(
 data?: Invoice.footer
  ) {
    this.subtotal = data ?  data.subtotal : 0
    this.discount = data ?  data.discount : 0
    this.shipping = data ?  data.shipping : 0
    this.taxes = data ?  data.taxes : []
  }
  get taxesAmount(): number {
    return this.taxes.reduce((total, tax) => total + tax.amount, 0)
  }
  /** Total de restar descuentos e impuestos y agregado de costo de envío */
  get total(): number {
    return ((this.subtotal + this.shipping) + this.taxesAmount) - this.discount
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
  interface concept extends Omit<ProductNoteModel, 'getdata'> { }
  interface footer extends Omit<FooterNoteModel, 'getdata'> { }

}

