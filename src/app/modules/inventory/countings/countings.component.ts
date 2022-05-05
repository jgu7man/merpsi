import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { first } from 'rxjs/operators';
import { ArqueoModel } from './arqueo.model';
import { ArqueosService } from './arqueos.service';
import { CountingInitializationDialog } from './counting-initialization/counting-initialization.dialog';

@Component({
  selector: 'app-countings',
  templateUrl: './countings.component.html',
  styleUrls: ['./countings.component.scss']
})
export class CountingsComponent implements OnInit {

  arqueoSelected?: ArqueoModel
  readonly stocksFileCols: string[] = [ 'descripcion', 'unidad_medida', 'existencias', 'costoUnitario' ]
  @ViewChild('balancingPanel') balancingPanel!: MatDrawer

  constructor (
    public productBalancings: ArqueosService,
    private _loading: MxLoading,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  initArqueo() {
    this._dialog.open( CountingInitializationDialog, {
      maxWidth: '420px'
    } ).afterClosed().pipe( first() ).subscribe( almacenId => {
      if (almacenId) this.productBalancings.initialize(almacenId)
    })
  }

  selectArqueo(arqueo:any) {
    this.arqueoSelected = arqueo
  }

  async closeArqueo() {
    this.balancingPanel.close()
    await this._loading.waitFor(500)
    delete this.arqueoSelected

  }

}
