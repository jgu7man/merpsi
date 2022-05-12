import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { catchError, distinctUntilChanged, first, map, mergeMap, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { BusinessModel } from '../models/empresa.model';
import { iManager, iManagerLogin, iManagerRegist, ManagerModel } from '../modules/admin/managers/manager.model';
import { BusinessService } from './business.service';
import firebase from 'firebase/app'
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { MxTest } from 'libs/@marxa/devkit/test/mx-test.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  /** Observable de el usuario autenticado */
  authUser$: Observable<iManager | null> = new Observable();
  /** Estado actualizado de los cambios del usuario autenticado */
  userState$ = new BehaviorSubject<iManager | null>( null )

  private _CRF = this._cache.getDataKey( 'eid' )

  constructor (
    private _afAuth: AngularFireAuth,
    private _afs: AngularFirestore,
    private _router: Router,
    private _business: BusinessService,
    private _loading: MxLoading,
    private _test: MxTest,
    private _cache: MxCache,
  ) {
    // this._test.testOn( this.regist )
    //   .then( async ( {business, regist} ) => {
    //     console.log( await this.regist(business, regist))
    //   } )
    //   .catch( console.error )

    this.authVerification()
  }

  authVerification() {
    /*  Método para cargar el usuario autenticado de manera asíncrona */
    this.authUser$ = this._afAuth.authState.pipe(
      switchMap( user => {
        /* Si user no es null consulta a el usuario autenticado y su data, de lo contrario también emite null */
        return user ?
          this.retriveManager( user.uid )  :
          of( null );
      } ),
      distinctUntilChanged((x, y) => JSON.stringify(x) == JSON.stringify(y)),
      mergeMap( user => {
        /* Si no existe el usuario, redirige a el login */
        if ( !user ) this._router.navigate( [ '/login' ] );
        /* Guarda la data en BehaivorSubject */
        this.userState$.next( user )
        return this.userState$

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

      /* Validamos que el CRF (clave de registro fiscal) no exista en base de datos */
      let business_result = await this._business.validateBusiness(business.CRF)
      if ( business_result ) {
        throw { message: 'El CRF que estas registrando ya existe'}
      }

      /* Se deconstruye el objeto manager para obtener los datos necesarios */
      let {email, password} = register

      /* Paso 1: Registrar en Firebase Auth */
      const credentials = await this._afAuth
        .createUserWithEmailAndPassword( email, password )
        .catch( error => {
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
      let manager = new ManagerModel(
                      email,
                      register.name,
                      credentials.user.uid,
                      business.CRF
                    )

      /* Paso 2: Crear la empresa */
      const businessRef = this._afs.doc( `businesses/${business.CRF}` )

      /* Ya que firestore no acepta objetos tipo class, se deconstruye la clase y se envía como objeto */
      await businessRef.set( { ...business } );

      /* Paso 3: Guardar el manager en la sub-colección de managers */
      await businessRef
        .collection( 'managers' )
        .doc( credentials.user.uid )
        .set({...manager})

      /* Paso 4: Redirección a el dashboard */
      this._router.navigate(['d'])



      /* IMPORTANTE: Hacer return para terminar la promesa */
      return

    } catch ( error: any ) {
      // console.log( error )
      /* Cerrar la sesión en cualquier error */
      this._afAuth.signOut()

      Swal.fire( {
        icon: 'error',
        text: error.message
      } )

      throw error
    }
  }

  async login({ email, password }: iManagerLogin) {
    try {
      /* Para cerrar sesion cuando se cierre la pestaña del navegador */
      await this._afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)

      /* Inicio de sesión con email para obtener credenciales de firebase */
      const credentials = await this._afAuth
        .signInWithEmailAndPassword( email, password )

      const uid = credentials.user?.uid
      if (uid) {
        var manager = await this.retriveManager(uid).pipe(first()).toPromise()

        if ( manager ) {
          if ( manager.businesses.length == 1 ) {
            this._router.navigate(['/business', manager.businesses[0]])

          } else {
            this._router.navigate( [ '/profile', manager.uid ] )
            if ( manager.businesses.length == 0 ) {
              Swal.fire( {
                icon: 'warning',
                text: 'No tienes acceso a ninguna Empresa'
              } )
            }
          }

          return manager

        } else  throw { message: 'No se encontró el usuario en la base de datos' }
      } else throw {
        message: `
          No se pudo iniciar sesión,
          Lamentamos los inconvenientes técnicos.
          Intenta de nuevo o más tarde
        `
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
  retriveManager( uid: string, ref: boolean = false ) {
    return this._afs.collectionGroup<iManager>('managers',
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
          return ref ? documento : manager
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
  /**
  * Metodo que crea la cuenta del manager (en auth) y actualiza el manager
  *
  * @param {iManagerRegist} register
  * @param {string} CRF_
  * @return {*}
  * @memberof AuthService
  */
  async registManagerInvited(register: iManagerRegist,CRF_: string) {
    try{
      let {email,password} = register

      /* Se busca en base de datos la informacion con la cual se hizo la invitacion */
      let managerRef =  this._afs.doc<ManagerModel>( `businesses/${CRF_}/managers/${email}`).ref
      let managerDoc = await managerRef.get()
      console.log( managerDoc.exists, managerDoc.data() )

      if ( managerDoc.exists ) {

        /* Se crea la cuenta en auth  */
        const credentials = await this._afAuth.createUserWithEmailAndPassword( email, password ).catch( error => {
          throw {message:'Falló la creación de la cuenta', error}
        } )

        /* Validamos la existencia de user y credenciales */
        if ( !credentials.user ) {
          let error = { message: 'No se obtuvieron las credenciales de Firebase' }
          console.error(error);
          throw error
        }

        /* Se obtiene el rol y la sede a la que se asigno el manager  */
        let {rol,sede} = managerDoc.data() as ManagerModel;

        /* Se guarda la informacion del manager pero ahora con el uid como referencia  */
        await this._afs.collection(`businesses/${CRF_}/managers/`).doc(credentials.user.uid).set({
          CRF:CRF_,
          email: register.email,
          lastAccess: new Date(),
          name: register.name,
          registered: new Date(),
          rol:rol,
          sede: rol == 'propietario' ? '*' : sede,
          uid: credentials.user.uid
        })

        /* Eliminamos el registro que se guardo anteriormente  */
        await managerRef.delete()

        this._router.navigate(['login'])

      }else {
        throw { message: 'No se encontró esta petición quizá se perdió o ya se aceptó antes'}
      }
      return
    }catch ( error: any ) {
      Swal.fire(error.message);
      return console.error(error);
    }
  }


}
