import firebase from 'firebase/app'
import { FireRef } from 'src/app/models/firestore.model';
import { Product, ProductModel, StoreReferenceModel, StoreReference } from '../products/products.model';

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

export class UpdateRecord {

  public diffs: number
  public leftovers: number
  public missings: number
  public moneyDiffs: number
  public NEW: boolean
  public UPC: string

  constructor (
    public productRef: FireRef<Product.DataReference>,
    public state: StoreReference.stateUpdate,
    NEW?: boolean,
  ) {

    this.UPC = state.UPC
    this.diffs = state?.stock_update !== undefined
      ? state.stock - state.stock_update
      : state.stock
    this.leftovers = this.diffs > 0 ? this.diffs : 0
    this.missings = this.diffs < 0 ? this.diffs : 0
    this.moneyDiffs = this.diffs !== 0 ? this.diffs * state.unit_cost : 0
    this.NEW = NEW || false
  }
}

export class DeleteRecord {
  public diffs: number
  public missings: number
  public moneyDiffs: number

  constructor (
    public productRef: FireRef<Product.DataReference>,
    public state?: StoreReferenceModel,
  ) {
    this.diffs = 0 - (state?.stock || 0)
    this.missings =  (state?.stock || 0)
    this.moneyDiffs = 0 - ((state?.stock || 0) * (state?.unit_cost || 0))
  }
}

export interface iArqueoDiffs {
  acc: number;
  count: number;
  valueAcc: number;
}
