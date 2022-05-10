import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { first } from 'rxjs/operators';
import { ProductCountingModel } from './product-counting.model';
import { CountingsService } from './countings.service';
import { CountingInitializationDialog } from './counting-initialization/counting-initialization.dialog';

@Component({
  selector: 'app-countings',
  templateUrl: './countings.component.html',
  styleUrls: ['./countings.component.scss']
})
export class CountingsComponent implements OnInit {

  countingReportSelected?: ProductCountingModel
  readonly stocksFileCols: string[] = [ 'descripcion', 'unidad_medida', 'existencias', 'costoUnitario' ]
  @ViewChild('reportPanel') reportPanel!: MatDrawer

  constructor (
    public countings: CountingsService,
    private _loading: MxLoading,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  initCounting() {
    this._dialog.open( CountingInitializationDialog, {
      maxWidth: '420px'
    } ).afterClosed().pipe( first() ).subscribe( almacenId => {
      if (almacenId) this.countings.initialize(almacenId)
    })
  }

  selectCounting(counting:any) {
    this.countingReportSelected = counting
  }

  async closeReport() {
    this.reportPanel.close()
    await this._loading.waitFor(500)
    delete this.countingReportSelected

  }

}
