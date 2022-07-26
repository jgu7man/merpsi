import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { iBusiness } from '../models/empresa.model';
import { ProviderModel } from '../modules/inventory/providers/provider.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(
    private _afs: AngularFirestore  ) { }


  /**
   * metodo para validar si una empresa existe
   *
   * @param {string} CRF
   * @return {*}  {(Promise<iBusiness | null>)}
   * @memberof BusinessService
   */
  async validateBusiness(CRF: string) {
    try{
      let business_result = await this._afs.doc<iBusiness>(`businesses/${CRF}`).ref.get();
      console.log(business_result.data())
        let provider = business_result.exists ? new ProviderModel(business_result.data()!,business_result.ref) : null
       
      return provider
     
    }catch (error: any){
      Swal.fire( {
        icon: 'error',
        text: error.message
      } )

     return null
    }
  }
}
