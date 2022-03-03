import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BusinessModel } from '../models/empresa.model';
import { iManagerRegist, ManagerModel } from '../models/manager.model';
import { BusinessService } from './business.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor (
    private _afAuth: AngularFireAuth,
    private _afs: AngularFirestore,
    private _router: Router,
    private _business: BusinessService
  ) { }


  /**
   * Registra una nueva empresa con la información de un manager
   *
   * @param {BusinessModel} business Modelo de empresa
   * @param {iManagerRegist} register Los datos del usuario que registra la empresa
   * @returns {*}  {Promise<void>}
   */
  async regist( business: BusinessModel, register: iManagerRegist ): Promise<void> {
    try {
      
      /*validamos que el CRF (clave de registro fiscal) no exista en base de datos */
      let business_result = await this._business.validateBusiness(business.CRF)
      if ( !business_result ) {

        throw { message: 'El CRF que estas registrando ya existe'}
      } 
      
      /* Se deconstruye el objeto manager para obtener los datos necesarios */
      let {email, password} = register

      /* Paso 1: Registrar en Firebase Auth */
      const credentials = await this._afAuth.createUserWithEmailAndPassword( email, password ).catch( error => {
        console.error(error);
        throw {message:'Falló la creación de la cuenta'}
      } )
      
      /* Validamos la existencia de user y credenciales */
      if ( !credentials.user ) {
        let error = { message: 'No se obtuvieron las credenciales de Firebase' }
        console.error(error);
        throw error
      }

      /* Creamos el modelo del manager */
      let manager = new ManagerModel(email, register.name, credentials.user.uid )
      
      /* Paso 2: Crear la empresa */
      const businessRef = this._afs.doc( `businesses/${business.CRF}` )
      
      /* Ya que firestore no acepta objetos tipo class, se deconstruye la clase y se envía como objeto */
      await businessRef.set( { ...business } );
      
      /* Paso 3: Guardar el manager en la sub-colección de managers */
      await businessRef.collection('managers').doc( credentials.user.uid )
        .set({...manager})
      
      /* Paso 4: Redirección a el dashboard */
      this._router.navigate(['dashboard'])
      
    

    /* IMPORTANTE: Hacer return para terminar la promesa */
    return

    } catch (error: any) {
      /* Cerrar la sesión en cualquier error */
      this._afAuth.signOut()
      
      Swal.fire( {
        icon: 'error',
        text: error.message
      } )

      return 
    }
  }

}
