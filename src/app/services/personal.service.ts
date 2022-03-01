import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MxAuth } from '@marxa/auth';
import { MxAlert, MxCache } from '@marxa/devkit';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UsuarioModel } from '../models/personal.model';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  constructor(
    private _afs: AngularFirestore,
    private _afAuth: AngularFireAuth,
    private _alert: MxAlert,
    private _cache: MxCache,
    private _router: Router
  ) { }

  getAll(): Observable<UsuarioModel[]> {
    return this._afs.collection<UsuarioModel>('admins').valueChanges()
      .pipe(
        map(list => {
          const users: UsuarioModel[] = []
          list.forEach( user => {
            users.push(new UsuarioModel(user))
          })
          return users
        }),
        catchError(error => {
          console.error(error);
          this._alert.error('No se logró cargar la lista del personal', error)
          return of([])
        })
      )
  }

  async update(user: UsuarioModel) {
    try {
      await this._afs.collection<UsuarioModel>('admins').doc(user.uid)
        .update({ ...user })
      this._alert.notify('Usuario actualizado')
      return
    } catch (error) {
      console.error(error)
      this._alert.error('No se logró guardar', error)
      return
    }
  }

  async add(user: UsuarioModel) {
    try {
      let {email, ...usuario} = user
      await this._afs.collection('admins')
        .doc(email)
        .set({
          ...usuario, email,
          displayName: `${usuario.nombre} ${usuario.apellido}`,
          registered: new Date(),
        })
      this._alert.notify('Usuario agregado')
      return

    } catch (error) {
      console.error(error)
      this._alert.error('No se pudo crear la cuenta', error)
      return
    }
  }

  async create(user: UsuarioModel) {
    try {
      let {email, password} = user
      let created = await this._afAuth.createUserWithEmailAndPassword(email, password as string)
      if (created.user) {
        user.uid = created.user.uid
        user.lastAccess = new Date()
        delete user.password
        await this._afs.doc(`admins/${created.user.uid}`).set({ ...user })
        await this._afs.doc(`admins/${email}`).ref.delete()
        this._alert.notify('Cuenta creada')
        this._cache.updateData('user', user)
        this._router.navigate(['/dashboard'])

      } else {
        this._alert.message('NO se otorgaron credenciales. Error desconocido')
        return
      }


    } catch (error: any) {
      console.error(error)
      if (error.code === 'auth/email-already-in-use') {
        this._alert.message('Este correo ya está en uso, elige otro')
      } else {
        this._alert.error('No se pudo crear la cuenta de autenticación. Esto puede deberse a problemas con internet o permisos para hacerlo', error)
      }
    }
  }

  async revoke(user: UsuarioModel) {
    try {
      this._afs.collection('admins').doc(user.uid).update({ rol: 'revoke' })
      this._alert.notify('Se revocaron los accesos')
      return
    } catch (error) {
      console.error(error)
      this._alert.error('No  se pudo revocar accesos', error)
      return
    }
  }


}
