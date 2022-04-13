import { MesureUnitModel } from 'src/app/models/mesure-unit.model';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MesureUnitsService } from 'src/app/services/mesure-units.service';
import { listenChanges } from 'src/app/models/operators-chains.model';

@Component({
  selector: 'app-mesure-unit-selector',
  templateUrl: './mesure-unit-selector.component.html',
  styleUrls: ['./mesure-unit-selector.component.scss']
})
export class MesureUnitSelectorComponent implements OnInit, OnDestroy {

  @Input() value?: MesureUnitModel
  public selectorCtrl: FormControl = new FormControl( null );
  private _selectorSubscription: Subscription
  @Output() changes: EventEmitter<MesureUnitModel> = new EventEmitter()

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
    if(this.value) this.selectorCtrl.setValue(this.value);
  }

  ngOnDestroy(): void {
    this._selectorSubscription?.unsubscribe()
  }

}
