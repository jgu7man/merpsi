import firebase from "firebase/app";
import { iTax } from "./taxes.model";

/** Modelo para crear una factura de compra */
export class PurchaseInvoiceModel {
  /** Momento de registro de la factura */
  public registered_date: Date;
  /** Productos comprados */
  public details: iProductPurchased[]

  constructor (
    /** Proveedor de la factura: CRF o referencia de firestore */
    public provider: firebase.firestore.DocumentReference, 
    /** ID de la Sede a la que se agregará la compra */
    public store: firebase.firestore.DocumentReference,
    /** Manager que está agregando la compra */
    public manager: firebase.firestore.DocumentReference,
    /** Productos comprados */
    details: ProductPurchasedModel[],
    /** Fecha de la compra */
    public purshase_date: Date,
    /** Folio de la factura (Generado por el proveedor) */
    public invoice_ID: string,
    /** Método de pago */
		public payment_method: string,
    /** Balances y cálculos ya procesados */
		public footer: iInvoiceFooter
	) {
		this.registered_date = new Date();
    /* Forzamos a que los details sean interface */
    this.details = details.map( p => ({...p})) 
  }
  
  
}

/** Modelo de consulta de una factura de compra  */
interface iInvoice extends Omit<PurchaseInvoiceModel, "purshase_date" | "registered_date"> {
	registered_date: firebase.firestore.Timestamp;
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
export class ProductPurchasedModel {
  /** Resultado de multiplicar cantidad por costo unitario del producto */
	public amount: number;

  constructor (
    /** Costo unitario del producto comprado*/
    public unit_cost: number,
    /** Cantidad de productos comprados */
    public cant: number,
    /** Referencia del producto comprado (Debe seleccionarse de la lista de productos registrados de la empresa) */
    public reference: firebase.firestore.DocumentReference
  ) {
		this.amount = this.unit_cost * this.cant;
	}
}


interface iProductPurchased extends ProductPurchasedModel {}

interface iPurchaseInvoice extends PurchaseInvoiceModel {}
