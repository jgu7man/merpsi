import firebase from 'firebase/app'
import { Product, ProductModel, StoreReferenceModel } from '../products/products.model';

export class ArqueoModel {
  startDate: Date | firebase.firestore.Timestamp;
  endDate?: Date | firebase.firestore.Timestamp;
  
  recordCount: number;
  newProducts: number;
  deletedProducts: number;
  id: string;
  active: boolean;
  leftovers: iArqueoDiffs
  missings: iArqueoDiffs

  constructor (
    public store_id: string,
  ) {
    this.startDate = new Date()
    this.id = `${this.startDate.getTime()}`
    this.recordCount = 0
    this.newProducts = 0
    this.deletedProducts = 0
    this.active = true
    this.leftovers = {
      acc: 0,
      count: 0,
      valueAcc: 0,
    }
    this.missings = {
      acc: 0,
      count: 0,
      valueAcc: 0,
    }
  }
}

export interface iArqueoUpdate extends Pick<ArqueoModel,
  | 'recordCount'
  | 'newProducts'
  | 'leftovers'
  | 'missings'>
{ }

export class ArqueoRecord {

  public diffs: number
  public leftovers: number
  public missings: number
  public moneyDiffs: number
  public newProduct: boolean = false
  public productId: string
  // public last?: Product.DataReference
  // public identificadores: string[]
  constructor (
    public product: Product.DataReference,
    public storeStateUpdate: StoreReferenceModel,
    public lastStoreState?: StoreReferenceModel,
  ) {
    
    this.productId = storeStateUpdate.UPC
    this.diffs = lastStoreState?.stock
      ? storeStateUpdate.stock - lastStoreState.stock
      : storeStateUpdate.stock
    this.leftovers = this.diffs > 0 ? this.diffs : 0
    this.missings = this.diffs < 0 ? this.diffs : 0
    this.moneyDiffs = this.diffs !== 0 ? this.diffs * storeStateUpdate.unit_cost : 0
   
    if ( !this.product.stored ) this.newProduct = true
  }
}

export class DeleteRecord {
  public diffs: number
  public missings: number
  public moneyDiffs: number
  
  constructor (
    public product: Product.DataReference,
    public lastStoreState?: StoreReferenceModel,
  ) {
    this.diffs = 0 - (lastStoreState?.stock || 0)
    this.missings =  (lastStoreState?.stock || 0)
    this.moneyDiffs = 0 - ((lastStoreState?.stock || 0) * (lastStoreState?.unit_cost || 0))
  }
}

export interface iArqueoDiffs {
  acc: number;
  count: number;
  valueAcc: number;
}
