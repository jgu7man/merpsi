import { createDate, FireDoc, FireRef, FireTime } from "src/app/models/firestore.model";
import { Product } from "../../inventory/products/products.model";
import { Invoice, InvoiceFooter } from "../invoices/invoice.model";
import { SalesInvoiceModel } from "../sales-invoices/sales-invoice.model";
import { AppliedTaxModel, iAppliedTax, TaxModel } from "../taxes/taxes.model";

export class CreditNoteModel {
  date_emition: FireTime = createDate(new Date())
  invoiceId: string
  invoiceRef: FireRef<SalesInvoiceModel> | null = null
  id: string
  manager: Invoice.manager
  concept: string
  footer: Invoice.footer
  details: NoteCredit.concept[]
  constructor(
    invoiceId: string,
    noteId: string,
    manager: Invoice.manager,
    concept: string,
    details: ProductNoteModel[],
    footer: FooterNoteModel,
  ) {
    this.invoiceId = invoiceId
    this.id = noteId
    this.manager = manager
    this.concept = concept
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
  public cant?: number = 0
  public store: string | null
  product: Product.MainData

  constructor(
    data: Invoice.concept,
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
    data?: Invoice.footer,
    details?: NoteCredit.concept[] | null,
    public amount_invoice?: number | null,
    taxes?: TaxModel[]

  ) {
    this.subtotal = details ? details.reduce((acc, item) => acc + item.amount, 0) : 0
    this.discount = data ? data.discount : 0
    this.shipping = data ? data.shipping : 0
    this.taxes = taxes ? this.calcTaxes(taxes): []
  }

  calcTaxes(taxes: TaxModel[]){
    return taxes.map(tax =>{
      return new AppliedTaxModel(tax, this.subtotal)
    })
  }
  get taxesAmount(): number {
    return this.taxes.reduce((total, tax) => total + tax.amount, 0)
  }
  /** Total de restar descuentos e impuestos y agregado de costo de envío */
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
  interface concept extends Omit<ProductNoteModel, 'getdata'> { }
  interface footer extends Omit<FooterNoteModel, 'data' | 'getdata' | 'amount_invoice' | 'calcTaxes' > { }


}

export class FoooterdecreaseModel {
  public subtotal: number = 0
  public discount: number = 0
  public shipping: number = 0
  public taxes: iAppliedTax[] = []
  public total: number = 0
  constructor(
    data?: Invoice.footer,
    totalInvoice?: number

  ) {
    this.subtotal = data ? data.subtotal : 0
    this.discount = data ? data.discount : 0
    this.shipping = data ? data.shipping : 0
    this.taxes = data ? data.taxes : []
    this.total = totalInvoice ? this.getTotal(totalInvoice) : this.gettotales()
  }
  get taxesAmount(): number {
    return this.taxes.reduce((total, tax) => total + tax.amount, 0)
  }
  /** Total de restar descuentos e impuestos y agregado de costo de envío */
  gettotales(): number {
    return ((this.subtotal + this.shipping) + this.taxesAmount) - this.discount
  }

  getTotal(invoice: number): number {
    let total = ((this.subtotal + this.shipping) + this.taxesAmount) - this.discount
    return total - invoice
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

export interface iCreditNote extends CreditNoteModel {
  
}
