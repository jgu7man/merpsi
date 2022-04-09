import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManagerModel } from 'src/app/modules/admin/personal/manager.model';
import { UsuarioModel } from 'src/app/models/personal.model';
import { PersonalService } from 'src/app/modules/admin/personal/personal.service';
import { DeleteUsuarioDialog } from './delete-usuario/delete-usuario.dialog';
import { MxIndex } from 'libs/@marxa/index/src/public-api';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';

@Component({
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit, OnDestroy {

  personal: ManagerModel[] = []
  businessCRF: string = this._cache.getDataKey('eid')!

  constructor(
    private _personal: PersonalService,
    private _dialog: MatDialog,
    public index: MxIndex,
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

  onDeleteItem(item: UsuarioModel) {
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
