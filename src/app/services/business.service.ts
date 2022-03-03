import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { iBusiness } from '../models/empresa.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(
    private _afs: AngularFirestore,
  ) { }


  /**
   *metodo para validar si una empresa existe
   *
   * @param {string} CRF
   * @return {*}  {(Promise<iBusiness | null>)}
   * @memberof BusinessService
   */
  async validateBusiness(CRF: string):Promise<iBusiness | null> {
    try{
      let business_result = await this._afs.doc<iBusiness>(`business/${CRF}`).ref.get();
       
      return business_result.exists ? business_result.data()! : null
     
    }catch (error: any){
      Swal.fire( {
        icon: 'error',
        text: error.message
      } )

     return null
    }
  }
}
