import { Injectable } from '@angular/core';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';

@Injectable({
  providedIn: 'root'
})
export class DatabasePathsService {


  CRF: string = this._cache.getDataKey( 'eid' )!
  
  
  constructor(
    private _cache: MxCache,
  ) { }

    get taxesGlobalRef(){
      return `_admin/taxes`
    }

    get businessCRF(){
      return `businesses/${this.CRF}`
    }

    get managerRef(){
      return `${this.businessCRF}/managers`
    }

    get storeRef(){
      return `${this.businessCRF}/store`
    }

    get clientRef(){
      return `${this.businessCRF}/clients`
    }
    
    get creditNoteRef(){
      return `${this.businessCRF}/credit_notes`
    }

    get productsRef(){
      return `${this.businessCRF}/products`
    }

    get salesRef(){
      return `${this.businessCRF}/sales`
    }
    
    get debitNoteRef(){
      return `${this.businessCRF}/debit_notes`
    }

    get purchasesRef(){
      return `${this.businessCRF}/purchases`
    }

    get configRef(){
      return `${this.businessCRF}/config`
    }
    
    get providersRef(){
      return `${this.businessCRF}/providers`
    }
    
    get stubRef(){
      return `${this.configRef}/stubs`
    }
    
    get productCategoriesRef(){
      return `${this.configRef}/product_categories`
    }

    get taxesRef(){
      return `${this.configRef}/taxes`
    }
    
    get mesureUnitsRef(){
      return `${this.configRef}/mesure_units`
    }


    get productCountingsRef() { 
      return `${this.businessCRF}/product_countings`
    }

    
}
