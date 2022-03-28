import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductModel } from '../models/products.model';
import { ProductPurchasedModel, PurchaseInvoiceModel } from '../models/pucharce-invoice.model';
import firebase from "firebase/app";


@Injectable({
  providedIn: 'root'
})
export class PuchaseInvoiceService {

  constructor(
    private _afs: AngularFirestore
  ) { }

  create( invoice : PurchaseInvoiceModel){

    //this._afs.collection<PurchaseInvoiceModel>(``).set({invoice})
  }

  addProduct(productRef: firebase.firestore.DocumentReference, cant: number, cost: number) {

    return new ProductPurchasedModel(cost, cant, productRef)

  }

}
