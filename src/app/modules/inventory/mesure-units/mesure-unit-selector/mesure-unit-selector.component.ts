import { MesureUnitModel } from 'src/app/modules/inventory/mesure-units/mesure-unit.model';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { listenChanges } from 'src/app/models/operators-chains.model';
import { MesureUnitsService } from '../mesure-units.service';

@Component({
  selector: 'app-mesure-unit-selector',
  templateUrl: './mesure-unit-selector.component.html',
  styleUrls: ['./mesure-unit-selector.component.scss']
})
export class MesureUnitSelectorComponent implements OnInit, OnDestroy {

  @Input() index?: number
  public selectorCtrl: FormControl = new FormControl( null );
  private _selectorSubscription: Subscription
  @Output() changes: EventEmitter<number> = new EventEmitter()

  constructor (
    public mesureUnits: MesureUnitsService
  ) { 
    this._selectorSubscription = this.selectorCtrl
      .valueChanges
      .pipe( listenChanges() )
      .subscribe( changes => {
        this.changes.emit(changes);
    })
  }

  ngOnInit(): void {
    if ( this.index ) {
      let value = this.mesureUnits.list$.value[this.index]
      this.selectorCtrl.setValue( value );
    }
  }

  ngOnDestroy(): void {
    this._selectorSubscription?.unsubscribe()
  }

}
