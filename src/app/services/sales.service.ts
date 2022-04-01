import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { ClientModel } from '../models/clients.model';
import { FireDoc } from '../models/firestore.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  businessCRF: string = this._cache.getDataKey('eid')!

  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
  ) { }

  async findClient(name: string){
    /**autocomplete */
  }
}
