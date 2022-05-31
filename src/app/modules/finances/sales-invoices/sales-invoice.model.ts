import firebase from "firebase/app"
import { createDate, FireRef, FireTime } from "src/app/models/firestore.model";
import { Invoice, InvoiceModel, ProductInvoiceModel } from '../invoices/invoice.model';

export class SalesInvoiceModel implements InvoiceModel {
  action_date: FireTime = createDate( new Date());
  registered_date: FireTime = createDate( new Date());
  details: Invoice.concept[]
  
  constructor(
    public invoiceId: string,
    public client: Invoice.client,
    public seller: string,
    public currency: string,
    public payment_method: string,
    public manager: Invoice.manager,
    concepts: ProductInvoiceModel[],
    public footer: Invoice.footer,
  
  ){
    this.invoiceId = invoiceId,
    this.client = client,
    this.seller = seller,
    this.details= concepts.map(det =>{
      return det.getdata()
    }),
    this.footer= footer,
    this.manager= manager,
    this.payment_method = payment_method,
    this.currency = currency
  }

    
}
export interface iSalesInvoice extends SalesInvoiceModel { }


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

export interface ClientInvoice{
  cip: '',
  name: '',
  email: '',
}

export declare namespace Sales{
  interface invoice{
    id: string
    ref: FireRef<SalesInvoiceModel>
  }
}