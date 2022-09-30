import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { ClientCreationModel } from '../../clients/clients.model';
import { ClientsService } from '../../clients/clients.service';
import { MatDialog } from '@angular/material/dialog';
import { MxCache } from '@marxa/devkit';
import { ClientFormDialog } from '../../clients/client-form/client-form.component';

@Component({
  selector: 'app-client-searcher',
  templateUrl: './client-searcher.component.html',
  styleUrls: ['./client-searcher.component.scss']
})
export class ClientSearcherComponent implements OnInit {

  businessRef = this._cache.getDataKey( 'eid' )
  emptyList: boolean = false;
  clientSelected?: ClientCreationModel
  @Output() selected: EventEmitter<ClientCreationModel> = new EventEmitter()

  constructor(
    private _clients: ClientsService,
    private _dialog: MatDialog,
    private _cache: MxCache,
  ) { }

  ngOnInit(): void {
  }

  getValue(client: ClientCreationModel){
    this.clientSelected = client
    this.selected.emit( client )
  }

  getList(product: ClientCreationModel[]){
    this.emptyList = product.length == 0 ? true : false
  }

  createClient() {
    this._dialog.open( ClientFormDialog )
      .afterClosed().pipe( first() )
      .subscribe( client => {
        if ( client ) {
          this.clientSelected = client
          this.selected.emit( client )
        }
      })
  }


  ngOnDestroy() {
  }

}
