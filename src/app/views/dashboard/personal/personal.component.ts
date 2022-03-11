import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManagerModel } from 'src/app/models/manager.model';
import { UsuarioModel } from 'src/app/models/personal.model';
import { PersonalService } from 'src/app/services/personal.service';
import { DeleteUsuarioDialog } from './delete-usuario/delete-usuario.dialog';

@Component({
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  personal: ManagerModel[] = []

  constructor(
    private _personal: PersonalService,
    private _dialog: MatDialog
  ) {
    this._personal.getAll().subscribe( users => {
      this.personal = users
    })
   }

  ngOnInit(): void {
  }

  onDeleteItem(item: UsuarioModel) {
    this._dialog.open(DeleteUsuarioDialog)
      .afterClosed().subscribe(confirmation => {
        if (confirmation) {
        this._personal.revoke(item)
      }
    })
  }

}
