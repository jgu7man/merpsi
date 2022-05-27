import firebase from "firebase/app";
import { FireTime, createDate } from "../../../models/firestore.model";
import { Invoice, InvoiceModel, ProductInvoiceModel } from "../invoices/invoice.model";


/** Modelo para crear una factura de compra */
export class PurchaseInvoiceModel implements InvoiceModel {
  
  registered_date: firebase.firestore.Timestamp = createDate(new Date())
  invoiceId: string;
  action_date: firebase.firestore.Timestamp;
  provider: Invoice.provider
  store: Invoice.store;
  details: Invoice.concept[];
  footer: Invoice.footer;
  payment_method: string | undefined;
  currency: string | undefined;
  manager: Invoice.manager
  constructor (
  invoiceId: string,
  action_date: Date,
  provider: Invoice.provider,
  store: Invoice.store,
  details: Invoice.concept[],
  footer: Invoice.footer,
  payment_method: string | undefined,
  currency: string | undefined,
  manager: Invoice.manager
  ) {
    this.invoiceId = invoiceId;
    this.action_date = createDate(action_date);
    this.provider = provider;
    this.store = store;
    this.details = details;
    this.footer = footer;
    this.manager = manager;
  }

}

export interface iPurchaseInvoice extends PurchaseInvoiceModel{

}



