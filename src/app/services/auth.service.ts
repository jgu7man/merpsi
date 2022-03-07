import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { catchError, distinctUntilChanged, first, map, switchMap, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { BusinessModel } from '../models/empresa.model';
import { iManager, iManagerLogin, iManagerRegist, ManagerModel } from '../models/manager.model';
import { BusinessService } from './business.service';
import firebase from 'firebase/app'
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  /** Observable de el usuario autenticado */
  user$: Observable<iManager | null> = new Observable();
  /** Estado actualizado de los cambios del usuario autenticado */
  userState$ = new BehaviorSubject<iManager | null>( null )

  constructor (
    private _afAuth: AngularFireAuth,
    private _afs: AngularFirestore,
    private _router: Router,
    private _business: BusinessService
  ) { 
    
    this.authVerification()
  }

  authVerification() {
    /*  Método para cargar el usuario autenticado de manera asíncrona */
    this.user$ = this._afAuth.authState.pipe(
      switchMap( user => {
        /* Si user no es null consulta a el usuario autenticado y su data, de lo contrario también emite null */
        return user ?
          this.retriveManager( user.uid )  :
          of( null );
      } ),
      distinctUntilChanged((x, y) => JSON.stringify(x) == JSON.stringify(y)),
      tap( user => {
        /* Si no existe el usuario, redirige a el login */
        if ( !user ) this._router.navigate( [ '/login' ] );
        /* Guarda la data en BehaivorSubject */
        this.userState$.next( user )

      } )
    )
  }


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
      if ( business_result ) {

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
      let manager = new ManagerModel(email, register.name, credentials.user.uid,business.CRF )
      
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

  async login({ email, password }: iManagerLogin) {
    try {
      // para cerrar sesion cuando se cierre la pestaña del navegador
      await this._afAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION)

      const credentials = await this._afAuth.signInWithEmailAndPassword(email, password)
      const uid = credentials.user?.uid
      if (uid) {
        var manager = await this.retriveManager(uid).pipe(first()).toPromise()

        console.log( manager )
        if (manager && manager?.businesses.length==0) {
          Swal.fire( {
            icon: 'warning',
            text: 'No tienes acceso a ninguna Empresa'
          })
        }
      
        this._router.navigate(['/dashboard'])
        return manager
      } else {
        let error = { message: 'No se pudo iniciar sesión, Lamentamos los inconvenientes técnicos. Intenta de nuevo o más tarde' }
        throw error
      }


    } catch (error: any) {

      console.error(error)
      this._afAuth.signOut()

      Swal.fire({
        icon: 'error',
        text: error.message
      })
      return
    }

  }

  /** Retorna la primera cuenta de manager que obtiene al buscar por email
   * @param {string} uid
   * @returns {*}
   */
  retriveManager( uid: string ) {
    return this._afs.collectionGroup<ManagerModel>('managers',
      ref => ref.where('uid', '==', uid)).get()
      .pipe(
        map(list => {
        if (list.docs.length > 0) {
          let documento = list.docs[0].data()
          let manager: iManager = {
            ...documento,
            registered: documento.registered as firebase.firestore.Timestamp,
            businesses: list.docs.map(doc => doc.data().CRF || '') 
          }
          return manager
        } else  return null
      } ),
        catchError( ( error, user ) => {
          console.log( error )
          Swal.fire({
            icon: 'error',
            text: error.message
          })
          throw error
        } )
      )
  }

  signOut() {
    this._afAuth.signOut()
  }
}
