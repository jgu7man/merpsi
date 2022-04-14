import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DeleteSedeDialog } from './delete-sede/delete-sede.dialog';
import { iSede } from './sede.model';
import { SedesService } from './sedes.service';

@Component({
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.scss']
})
export class SedesComponent implements OnInit {

  sedes$: Observable<iSede[]>
  constructor(
    private _dialog: MatDialog,
    private _sedes: SedesService
  ) {
    this.sedes$ = this._sedes.listenAll()
   }

  ngOnInit(): void {
  }

  onDeleteItem(item: iSede) {
    this._dialog.open(DeleteSedeDialog)
      .afterClosed().subscribe(confirmation => {
        if (confirmation) {
        this._sedes.delete(item)
      }
    })
  }

}

