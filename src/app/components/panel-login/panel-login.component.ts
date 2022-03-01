import { Component, OnInit } from '@angular/core';
import { MxAuth, MxLoginFields, RestorePasswordDialog } from '@marxa/auth';
import { MxAlert, MxCache } from "@marxa/devkit";
import { MatDialog } from "@angular/material/dialog";
import firebase from 'firebase/app'
import { take, takeWhile } from "rxjs/operators";
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { PersonalService } from 'src/app/services/personal.service';
import { UsuarioModel } from 'src/app/models/personal.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxRestorePasswordLabels } from '@marxa/auth/lib/models/labels.model';

@Component({
  templateUrl: './panel-login.component.html',
  styleUrls: ['./panel-login.component.scss']
})
export class PanelLoginComponent implements OnInit {

  constructor(
    private _auth: MxAuth,
    private _cache: MxCache,
    private _dialog: MatDialog,
    private _alert: MxAlert,
    private _router: Router,
    private _afAuth: AngularFireAuth,
    private _personal: PersonalService,
    private _afs: AngularFirestore
  ) {
    this._auth.userCollection = 'admins'
    this._auth.onLoggedRedirectRoute = '/dashboard'
    this._auth.listenForErros.subscribe(error => {
      this._alert.message(error)
    })
    this._auth.user$.pipe(take(1)).subscribe(user => {
      if (user) this._router.navigate(['/dashboard'])
    })
  }

  ngOnInit(): void {
  }

  async onSubmit(fields: MxLoginFields) {
    await this._afAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION)

    let userDoc = await this._afs.doc(`admins/${fields.email}`).ref.get()
    if (userDoc.exists) {
      let user = userDoc.data() as UsuarioModel
      if (user.password === fields.password) {
        this._personal.create(user)
       } else {
        this._alert.message('La contraseña no coincide. Si no puedes recuperar tu contraseña, tendrás que te creen la cuenta de nuevo.')
        return
      }
    } else {
      this._auth.emailSignIn(fields.email,  fields.password)
        .then( async (logged) => {
          if (logged) {
            let { email, displayName, uid, photoURL } = logged
            let userRef = this._afs.doc(`admins/${uid}`).ref
            let rol = await (await userRef.get()).get('rol')
            if (rol == 'revoke') {
              this._auth.signOut()
              this._alert.message('No tienes accesos a esta plataforma.')
            } else {
              let user = { email, displayName, uid, photoURL, lastAccess: new Date() } as UsuarioModel
              this._cache.updateData('user', user)
              this._personal.update(user)
              this._alert.notify('sesión iniciada')
            }
          }
        })
    }

  }

  onRestore() {
    this._dialog.open(RestorePasswordDialog, {
      width: '450px',
      data: <MxRestorePasswordLabels>{
        requiredLabel: 'Este dato es necesario',
        confirmationMessage: 'Un mensaje fue enviado a tu correo'
      }
    })
  }

}
