import { Component, OnInit } from '@angular/core';
import { MxCrudPanelColumns } from 'libs/@marxa/crud-panel/src/lib/mx-crud-panel.model';
import { MesureUnitsService } from './mesure-units.service';

@Component({
  selector: 'app-mesure-units',
  templateUrl: './mesure-units.component.html',
  styleUrls: ['./mesure-units.component.scss']
})
export class MesureUnitsComponent implements OnInit {

  readonly columns: MxCrudPanelColumns[] = [
    { id: 'name', displayName: 'Nombre' },
    { id: 'symbol', displayName: 'Símbolo' },
    { id: 'description', displayName: 'Descripción' },
  ]

  constructor (
    public mesureUnits: MesureUnitsService
  ) { }

  ngOnInit(): void {
  }

}
