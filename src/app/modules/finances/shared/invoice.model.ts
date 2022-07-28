import { FireTime, FireRef } from "../../../models/firestore.model"
import { Product } from "../../inventory/products/products.model"
import { iSede } from "../../admin/stores/sede.model"
import { iManager } from "../../admin/managers/manager.model"
import { iProvider } from "../../inventory/providers/provider.model"
import { iAppliedTax } from "./taxes/taxes.model"


/**
 *Esta Interfaz se usa en el modelo de sales-invoice y purchase-invoice. 
Son los datos en común que comparten ambos modelos. Es mas que todo informativo
 *
 * @export
 * @interface InvoiceModel
 */
export interface InvoiceModel {
  /** folio de la factura */
  invoiceId: string
  /** fecha de la factura */
  action_date: FireTime
  /** fecha de registro */
  registered_date: FireTime
  /** Lista de conceptos que incluirá la factura */
  details: Invoice.concept[];
  /** Cálculos de totales de la factura */
  footer: Invoice.footer
  /** Metodos de pagos */
  payment_method: string
  /** Tipo de moneda */
  currency: string
  /** usuario registrado*/
  manager: Invoice.manager
}

/**
 *Modelo para crear un concepto que sera usado en cualquiera 
  de los documentos (Factura de: Compra y Venta, Notas de Credito y Debito)
 *
 * @export
 * @class ProductInvoiceModel
 */
export class ProductInvoiceModel {
  /** Precio unitaio de venta */
  public unit_price: number = 0
  /** Costo unitario del producto comprado */
  public unit_cost: number = 0
  /** Cantidad de productos comprados */
  public cant: number = 0
  public store: string | null
  product: Product.MainData

  constructor(
    /** Referencia del producto comprado (Debe seleccionarse de la lista de productos registrados de la empresa) */
    product_doc: Product.DataReference,
    store: string | null,
    public stock: number = 0,
    public transfer_fee?: Invoice.concept.transfer | null,
    unit_price?: number,
  ) {
    this.store = store || null
    this.stock = stock || 0
    let { UPC, reference, description, brand, measure_unit } = product_doc
    this.product = {
      UPC,
      reference,
      description,
      brand: brand || '',
      measure_unit: measure_unit || 0,
    }
    this.transfer_fee = transfer_fee || null
    this.unit_price = unit_price || 0
  }



  /** Resultado de multiplicar cantidad por costo unitario del producto */
  get amount(): number {
    return this.unit_price * (this.cant || 1)
  }

  /** Extracción del modelo */
  getdata(): Invoice.concept {
    delete this.transfer_fee
    let { getdata: concept, ...object } = this
    return {
      ...object,
      product: this.product,
      amount: this.amount
    }
  }
}


/** Modelo que genera los totales generales de los documentos */
export class InvoiceFooter {
  constructor(
    /** Suma de los montos de los productos */
  public subtotal: number = 0,
  /** Descuento aplicado a la compra en moneda */
  public discount: number = 0,
  /** Costo generado por envío */
  public shipping: number = 0,
  /** Lista de impuestos aplicados a la compra */
  public taxes: iAppliedTax[] = [],
  ){

  }
  
  /** Total acumulado de los impuestos aplicados */
  get taxesAmount(): number {
    return this.taxes.reduce((total, tax) => total + tax.amount, 0)
  }
  /** Total de restar descuentos e impuestos y agregado de costo de envío */
  get total(): number {
    return ((this.subtotal + this.shipping) + this.taxesAmount) - this.discount
  }
  /** Extracción del modelo */
  getdata(): Invoice.footer {
    let { getdata, ...object } = this
    let taxes = this.taxes.map(tax => {
      return { ...tax }
    })
    return { ...object, total: this.total, taxesAmount: this.taxesAmount, taxes: taxes }
  }

}


export declare namespace Invoice {

  interface doc extends Omit<InvoiceModel,
    'data' | 'footer'
  > {
    details: concept[],
    store: store,
    footer: footer
  }

  interface manager extends propertyRef {
    ref: FireRef<iManager>
  }

  interface propertyRef {
    id: string
    name: string
  }

  interface store extends propertyRef {
    ref: FireRef<iSede> | null // !!! FIX
  }

  interface provider {
    name: string
    CRF: string
    ref: FireRef<iProvider> | null // !!! FIX
  }

  interface client extends propertyRef {
    CRF: string
    //ref: FireRef<ClientModel>
  }

  interface additionalInfo {
    seller: string,
    currency: string,
    payment_method: string
  }

  interface concept extends Omit<ProductInvoiceModel, 'getdata'> { }

  namespace concept {
    interface transfer {
      store: store,
      fee: number
    }
  }

  interface footer extends Omit<InvoiceFooter, 'getdata' | 'data' | "amount_invoice"> { }

}


