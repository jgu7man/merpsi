import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AngularFirestore } from '@angular/fire/firestore';
import { startWith, map, filter, switchMap, take, tap, distinctUntilKeyChanged, distinctUntilChanged, first } from 'rxjs/operators';
import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ClientCreationModel } from '../../clients/clients.model';
import { ClientsService } from '../../clients/clients.service';
import { MatDialog } from '@angular/material/dialog';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { ClientFormComponent, ClientFormDialog } from '../../clients/client-form/client-form.component';

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
