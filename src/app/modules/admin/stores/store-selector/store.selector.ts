import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { listenChanges } from 'src/app/models/operators-chains.model';
import { iSede } from '../sede.model';
import { SedesService } from '../sedes.service';

@Component({
  selector: 'app-store-selector',
  templateUrl: './store.selector.html',
  styleUrls: ['./store.selector.scss']
})
export class StoreSelector implements OnInit, OnDestroy{

  @Input() store?: iSede
  storeCtrl: FormControl = new FormControl( null, [ Validators.required ] )
  private changesSubscription: Subscription
  @Output() changes: EventEmitter<iSede> = new EventEmitter()

  constructor (
    public stores: SedesService
  ) { 
    this.changesSubscription = this.storeCtrl
      .valueChanges.pipe( listenChanges( 500 ))
      .subscribe(changes => this.changes.emit(changes))
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.changesSubscription.unsubscribe()
  }

}
