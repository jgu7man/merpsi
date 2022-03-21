import { Component, OnDestroy, OnInit } from '@angular/core';
import { MxLoginFields, RestorePasswordDialog } from '@marxa/auth';
import { MatDialog } from "@angular/material/dialog";
import { distinctUntilChanged } from "rxjs/operators";
import { Router } from '@angular/router';
import { MxRestorePasswordLabels } from '@marxa/auth/lib/models/labels.model';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './panel-login.component.html',
  styleUrls: ['./panel-login.component.scss']
})
export class PanelLoginComponent implements OnInit, OnDestroy {

  /** Suscripción de los cambios de autenticación */
  private _authSubscription: Subscription

  constructor(
    private _dialog: MatDialog,
    private _auth: AuthService,
    private _router: Router
  ) {  

    /* Suscripción a los cambios de estado de autenticación */
    this._authSubscription = this._auth.authUser$.pipe(
      distinctUntilChanged( ( x, y ) => JSON.stringify( x ) == JSON.stringify( y ))
    ).subscribe( user => {
      if ( user ) {
        if ( user.businesses.length == 1 ) {
          this._router.navigate(['business', user.businesses[0]])
        } else {
          this._router.navigate(['/profile', user.uid])
        }
      }
    } )

  }

  ngOnInit(): void {
  }

  async onSubmit(manager: MxLoginFields) {
    console.log(manager);
    this._auth.login(manager)
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

  ngOnDestroy() {
    this._authSubscription.unsubscribe()
  }

}
