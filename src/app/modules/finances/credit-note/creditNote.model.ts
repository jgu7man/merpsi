import { createDate, FireTime } from "src/app/models/firestore.model";
import { iInvoiceFooter, invoiceFooter, iProductInvoice } from "../invoices/invoice.model";

export class creditNoteModel{
  date_emition:FireTime = createDate(new Date())
  invoiceIdRef:string
  invoiceId:string
  manager:string
  total:number
  footer: iInvoiceFooter
  details: iProductInvoice[]
  constructor(
    date:creditNoteModel
  )
  {
    this.invoiceIdRef = date.invoiceIdRef
    this.invoiceId = date.invoiceId
    this.manager = date.manager
    this.total = date.total
    this.footer = date.footer
    this.details = date.details
  }

}