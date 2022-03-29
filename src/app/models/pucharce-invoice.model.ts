import { AngularFirestore } from "@angular/fire/firestore";
import firebase from "firebase/app";
import { FireTime } from "./firestore.model";
import { Product, ProductModel } from "./products.model";
import { iTax } from "./taxes.model";


/** Modelo para crear una factura de compra */
export class PurchaseInvoiceModel {
  /** Momento de registro de la factura */
  public registered_date: FireTime;
  /** Productos comprados */
  public details: iProductPurchased[] = []

  /** Fecha de la compra */
  public purshase_date: Date = new Date()
  /** Folio de la factura (Generado por el proveedor) */
  public invoice_ID: string = ''
  /** Método de pago */
  public payment_method: string = ''
  /** Balances y cálculos ya procesados */
  public footer: iInvoiceFooter

  constructor (
    /** Proveedor de la factura: CRF o referencia de firestore */
    public provider: firebase.firestore.DocumentReference, 
    /** ID de la Sede a la que se agregará la compra */
    public store: firebase.firestore.DocumentReference,
    /** Manager que está agregando la compra */
    public manager: firebase.firestore.DocumentReference,
    
	) {
		this.registered_date = firebase.firestore.Timestamp.fromDate( new Date() );
    this.footer = {
      subtotal: 0,
      discount: 0,
      taxes: [],
      shipping: 0,
      total: 0,
    }
  }
  
  
}

/** Modelo de consulta de una factura de compra  */
interface iInvoice extends Omit<PurchaseInvoiceModel, "purshase_date"> {
	purshase_date: firebase.firestore.Timestamp;
}

/** Modelo de consulta de balances de factura */
export interface iInvoiceFooter {
  /** Suma de los montos de los productos */
  subtotal: number;
  /** Descuento aplicado a la compra en moneda */
  discount: number;
  /** Lista de impuestos aplicados a la compra */
  taxes: iTax[];
  /** Costo generado por envío */
  shipping: number;
  /** Total de restar descuentos e impuestos y agregado de costo de envío */
	total: number;
}

/** Modelo de agregado de productos a la factura de compra */
export class ProductPurchasedModel implements Product.MainData {
  /** Costo unitario del producto comprado*/
  public unit_cost: number = 0
  /** Cantidad de productos comprados */
  public cant: number = 0
  /** Resultado de multiplicar cantidad por costo unitario del producto */
  public amount: number;
  UPC: string
  reference: string
  description: string
  brand: string
  measure_unit: string
  document_ref?: firebase.firestore.DocumentReference

  constructor (
    /** Referencia del producto comprado (Debe seleccionarse de la lista de productos registrados de la empresa) */
    concept: firebase.firestore.DocumentSnapshot<ProductModel>
  ) {

    let data = concept.data()!

		this.amount = this.unit_cost * this.cant;
    this.UPC = data.UPC
    this.reference = data.reference
    this.description = data.description
    this.brand = data.brand
    this.measure_unit = data.measure_unit
    this.document_ref = concept.ref
	}
}


interface iProductPurchased extends ProductPurchasedModel {}

interface iPurchaseInvoice extends PurchaseInvoiceModel {}
