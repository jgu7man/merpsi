import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { iSede } from 'src/app/modules/admin/stores/sede.model';
import { SedesService } from 'src/app/modules/admin/stores/sedes.service';

@Component({
  selector: 'app-counting-initialization',
  templateUrl: './counting-initialization.dialog.html',
  styleUrls: ['./counting-initialization.dialog.scss']
})
export class CountingInitializationDialog  {

  almacenIdCtrl: FormControl = new FormControl( '', [ Validators.required ] )
  selected?: iSede
  constructor (
    public dialog: MatDialogRef<CountingInitializationDialog>,
  ) {
 
  }
  


}
