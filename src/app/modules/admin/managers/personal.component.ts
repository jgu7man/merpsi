import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteUsuarioDialog } from './delete-usuario/delete-usuario.dialog';
import { MxIndex } from 'libs/@marxa/index/src/public-api';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { MxCrudPanelColumns } from 'libs/@marxa/crud-panel/src/lib/mx-crud-panel.model';
import { ManagerModel } from './manager.model';
import { PersonalService } from './personal.service';
import { UserModel } from './personal.model';

@Component({
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit, OnDestroy {

  personal: ManagerModel[] = []
  businessCRF: string = this._cache.getDataKey( 'eid' )!
  columns: MxCrudPanelColumns[] = [
    { id: 'name', displayName: 'Nombre' },
    { id: 'email', displayName: 'Email' }
  ]

  constructor(
    public index: MxIndex,
    private _personal: PersonalService,
    private _dialog: MatDialog,
    private _cache: MxCache
  ) {
    // this._personal.getAll().subscribe( users => {
    //   this.personal = users
    // })
    // this._index.page$.subscribe(this.personal)
    const path = `businesses/${this.businessCRF}/managers`
    this.index.initIndex(path, 'name', 20)
   }

  ngOnInit(): void {
  }

  onDeleteItem(item: UserModel) {
    this._dialog.open(DeleteUsuarioDialog)
      .afterClosed().subscribe(confirmation => {
        if (confirmation) {
        this._personal.revoke(item)
      }
    })
  }

  ngOnDestroy(): void {
    this.index.leave()
  }

}
