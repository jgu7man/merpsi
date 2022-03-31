import { Product, ProductInvoiceModel } from './products.model'
import firebase from "firebase/app"
import { FireRef } from './firestore.model';
import { ClientModel } from './clients.model';
import { iInvoiceFooter, InvoiceModel, InvoiceStore } from './invoice.model';
import { ProductPurchasedModel } from './pucharce-invoice.model';

export class SalesInvoiceModel implements InvoiceModel {
  
  constructor (
    salesI?:SalesInvoiceModel
    ) {
      this.registered_date = new Date()
    }
    
    public invoice_ID?: string;
    public document_date?: Date;
    public store?: InvoiceStore;
    public client?: string;
    public details?: ProductPurchasedModel[];
    public payment_method?: string;
    public footer?: iInvoiceFooter;
    public manager?: string;
    public registered_date: Date | firebase.firestore.Timestamp;
}
export interface iInvoice extends SalesInvoiceModel { }

export interface iFacturaDatos {
  fecha: Date | firebase.firestore.Timestamp,
  doc_externo: string,
  proveedor: string,
  sede: string,
  forma_pago: string,
  concepto: string,
  comprador: string,
  cantidades: number,
  subtotal: number,
  descuento: number,
  iva: number,
  total: number,
}

export interface iProductSales extends ProductInvoiceModel {}
