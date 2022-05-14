import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Client, ClientModel } from '../../clients/clients.model';
import { ClientsService } from '../../clients/clients.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {

  @Input() client?: ClientModel

  clienteForm: Client.form = new FormGroup({
    name: new FormControl('Maria Mechita', [Validators.required]),
    cellphone: new FormControl('3121234567', [Validators.required]),
    email: new FormControl('mariamechita@gmail.com'),
    CRF: new FormControl('MECH862409HSA'),
  }) as Client.form

  @Output() onClose: EventEmitter<any> = new EventEmitter()

  constructor(
    private _clientes: ClientsService,
  ) { }

  ngOnInit(): void {
    if (this.client) {
      this.clienteForm.patchValue({
        CRF: this.client.CRF,
        name: this.client.name,
        email: this.client.contact?.email ,
        cellphone: this.client.contact?.cellphone,
      })
    }
  }

  async onSubmit() {
    const client = this.clienteForm.value

    if ( !this.client ) {
      this.client = new ClientModel(
        client.name,
        client.CRF,
        client.email,
        client.cellphone,
      )
    } else {
      this.client.name = client.name
      this.client.contact = {
        ...this.client.contact,
        email: client.email,
        cellphone: client.cellphone,
      }
    }


    /* Manda a guardar */
    let savedClient = await this._clientes.save(this.client)


    this.onClose.emit( savedClient )
    this.clienteForm.setValue({
      CRF: "",
      cellphone: "",
      email: "",
      name: "",
    })
  }
}


@Component({
  template: `
    <mat-dialog-content>
      <div class="row">
        <div class="col s11">
          <app-client-form
          (onClose)="dialog.close($event)"
          ></app-client-form>
        </div>
        <div class="col s1">
          <button mat-icon-button (click)="dialog.close()">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-raised-button color="primary">text</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./client-form.component.scss']
})

export class ClientFormDialog implements OnInit {
  constructor (
    // @Inject( MAT_DIALOG_DATA ) data: any,
    public dialog: MatDialogRef<ClientFormDialog>
  ) { }

  ngOnInit() { }
}
