import { createDate, FireRef, FireTime } from "src/app/models/firestore.model"
import { Manager } from "../../admin/managers/manager.model"
import { iInvoiceFooter, iProductInvoice } from "../invoices/invoice.model"
import { Sales, SalesInvoiceModel } from "../sales-invoices/sales-invoice.model"

export class DebitNoteModel {
  date_emition: FireTime = createDate(new Date())

  constructor(
    public id: string,
    /** Informacion de la factura */
    public invoice: Sales.invoice,
    /**Informacion del Manager  */
    public manager:  Manager.invoice,
    /**Array de los conceptos de la Nota de Debito */
    public details: iProductInvoice[],
    /**Informacion del footer de la Nota de debito */
    public footer?: iInvoiceFooter,
  ) {
    this.invoice = invoice
    this.id = id
    this.manager = manager
    this.details = details
    this.footer = footer ? footer : footerEmpty
  }
}

const footerEmpty = {
  subtotal: 0,
  discount: 0,
  taxes: [],
  totalTaxes: 0,
  shipping: 0,
  total: 0,
}