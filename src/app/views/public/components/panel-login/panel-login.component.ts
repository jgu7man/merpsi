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
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: './panel-login.component.html',
  styleUrls: ['./panel-login.component.scss']
})
export class PanelLoginComponent implements OnInit {

  constructor(
    private _dialog: MatDialog,
    private _authService: AuthService
  ) {  }

  ngOnInit(): void {
  }

  async onSubmit(manager: MxLoginFields) {
    console.log(manager);
    
    this._authService.login(manager)
    

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
