import { Product, ProductInvoiceModel, ProductModel } from './products.model'
import firebase from "firebase/app"
import { FireDoc, FireRef } from './firestore.model';
import { ClientModel } from './clients.model';
import { iInvoiceFooter, InvoiceModel, InvoiceStore } from './invoice.model';
import { iSede } from './sede.model';

export class SalesInvoiceModel implements InvoiceModel {
  public client: FireDoc<ClientModel> | ''
  public seller: string | ''
  public date_expiration : firebase.firestore.Timestamp | ''
  public currency: string | ''
  constructor (
    salesI?:SalesInvoiceModel
    ) {
      this.registered_date = new Date()
      this.client = salesI?.client || ''
      this.seller = salesI?.seller || ''
      this.date_expiration = salesI?.date_expiration || ''
      this.currency = salesI?.currency || ''
    }
    
    public invoice_ID?: string;
    public document_date?: Date;
    //public store?: InvoiceStore;
    public details?: ProductInvoiceSalesModel[];
    public payment_method?: string;
    public footer?: iInvoiceFooter;
    public manager?: string;
    public registered_date: Date | firebase.firestore.Timestamp;
}
export interface iInvoice extends SalesInvoiceModel { }

export class ProductInvoiceSalesModel implements ProductInvoiceModel{
  public store: FireRef<iSede> | ''
  constructor(
    concept: FireDoc<ProductModel>,
    store: FireRef<iSede> | ''
  ){
    let data = concept.data()! 
    this.amount = this.unit_cost * this.cant
    this.UPC = data.UPC
    this.reference = data.reference
    this.description = data.description
    this.brand = data.brand
    this.measure_unit = data.measure_unit
    this.document_ref = concept.ref
    this.store = store || ''
  }
  public unit_cost: number = 0
  public cant: number = 0
  public amount: number;
  UPC: string;
  reference: string;
  description: string;
  brand: string;
  measure_unit: string;
  document_ref?: firebase.firestore.DocumentReference<firebase.firestore.DocumentData> | undefined;
  
}
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
