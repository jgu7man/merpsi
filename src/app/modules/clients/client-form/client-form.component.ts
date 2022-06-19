import { Subscription } from 'rxjs';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Client, ClientCreationModel } from '../clients.model';
import { ClientsService } from '../clients.service';
import { listenChanges } from 'src/app/models/operators-chains.model';

@Component({
  selector: 'mx-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit, OnDestroy {

  @Input() enableSubmit: boolean = true;
  @Input() enableAddress: boolean = true;
  @Input() client: ClientCreationModel | null = null;
  // client: ClientModel | null = null;

  clientForm: Client.form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    cellphone: new FormControl( '', [
      Validators.required,
      Validators.minLength( 10 ),
      Validators.maxLength( 10 )
    ] ),
    email: new FormControl(''),
    CRF: new FormControl(''),
  } ) as Client.form
  private _formSubscription: Subscription

  @Output() submited: EventEmitter<any> = new EventEmitter()

  constructor(
    public clients: ClientsService,
  ) {
    this._formSubscription = this.clientForm.valueChanges
      .pipe(listenChanges( 500 ))
      .subscribe( (changes: Client.RegistData ) => {
        this.clients.registForm$.next( changes )
        let { pristine, valid } = this.clientForm
        this.clients.valid$.next( !pristine && valid )
      })
  }

  ngOnInit(): void {
   // this.client = this.clients.current$.value
    if (this.client) {
      this.clientForm.patchValue({
        CRF: this.client.CRF,
        name: this.client.name,
        email: this.client.contact?.email ,
        cellphone: this.client.contact?.cellphone,
      })
    }
  }

  async onSubmit() {

    /* Manda a guardar */
    let savedClient = await this.clients.save()
    this.submited.emit( savedClient )

    this.clientForm.setValue( {
      CRF: "",
      cellphone: "",
      email: "",
      name: "",
    })
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe()
  }
}


@Component({
  template: `
    <mat-dialog-content>
      <div class="row">
        <div class="col s1"></div>
        <div class="col s10">
          <mx-client-form
          [enableSubmit]="false"
          ></mx-client-form>
        </div>
        <div class="col s1">
          <button mat-icon-button (click)="dialog.close()">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions class="center">
      <button mat-raised-button
      color="primary"
      [disabled]="!clients.valid$.value"
      (click)="onSubmit()"
      >Guardar</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./client-form.component.scss']
})

export class ClientFormDialog implements OnInit {
  constructor (
    // @Inject( MAT_DIALOG_DATA ) data: any,
    public dialog: MatDialogRef<ClientFormDialog>,
    public clients: ClientsService
  ) { }

  ngOnInit() { }

  async onSubmit() {
    let client = await this.clients.save()
    this.dialog.close(client)
  }
}
