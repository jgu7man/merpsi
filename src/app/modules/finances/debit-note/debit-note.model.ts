import { createDate, FireRef, FireTime } from "src/app/models/firestore.model"
import { Manager } from "../../admin/managers/manager.model"
import { FooterNoteModel, NoteCredit, ProductNoteModel } from "../credit-note/creditNote.model"
// import { iInvoiceFooter, iProductInvoice } from "../invoices/invoice.model"
import { SalesInvoiceModel } from "../sales-invoices/sales-invoice.model"
import { Invoice } from "../shared/invoice.model"

/**
 *Modelo para crear una Nota de Debito
 *
 * @export
 * @class DebitNoteModel
 */
export class DebitNoteModel {
  /* Fecha de emision*/
  emition_date: FireTime = createDate(new Date())
  /* Numero de Documnto (segun talonario) */
  id: string
  manager: Invoice.manager
  footer: NoteCredit.footer
  details: NoteDebit.concept[]
  constructor(
    /* referencia de la factura asociada */
    public invoiceId: string,
    id: string,
    manager: Invoice.manager,
    details: ProductNoteModel[],
    footer: FooterNoteModel,
  ) {
    this.id = id
    this.manager = manager
    this.details = details.map(details => {
      return details.getdata()
    })
    this.footer = footer.getdata()
  }
}

export declare namespace NoteDebit {
  // conceptos a los cuales se aplicara la nota de debito
  interface concept extends Omit<ProductNoteModel, 'getdata'> { }
  interface footer extends Omit<FooterNoteModel, 'data' | 'getdata' | 'totalInvoice' | 'calcTaxes' > { }
}

export interface iDebitNote extends DebitNoteModel{}
