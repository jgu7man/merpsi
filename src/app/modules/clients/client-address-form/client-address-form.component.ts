import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { listenChanges } from 'src/app/models/operators-chains.model';
import { Client, ClientCreationModel } from '../clients.model';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'mx-client-address-form',
  templateUrl: './client-address-form.component.html',
  styleUrls: ['./client-address-form.component.scss']
})
export class ClientAddressFormComponent implements OnInit, OnDestroy {

 @Input() client: ClientCreationModel | null = null

  addressForm: FormGroup = new FormGroup( {
    streetName: new FormControl( '' ),
    streetNumber: new FormControl( '' ),
    neighborhood: new FormControl( '' ),
    city: new FormControl( '' ),
    state: new FormControl( '' ),
    zipCode: new FormControl( '' ),
    country: new FormControl( '')
  } );

  private _formSubscription: Subscription


  constructor(
    private _clients: ClientsService
  ) {
    this._formSubscription = this.addressForm.valueChanges
      .pipe(listenChanges(500))
      .subscribe((changes: Client.address) => {
        this._clients.addressForm$.next(changes)
        let { pristine, valid } = this.addressForm
        this._clients.valid$.next(!pristine && valid)
      })
  }

  ngOnInit(): void {
    //this.client = this._clients.current$.value
    if ( this.client ) {
      let address = this.client.address
      if ( address ) this.addressForm.patchValue( address )
    }
  }

  cleanForm(): void {
    this.addressForm.patchValue({
      streetName: '',
      streetNumber: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    });
    this.addressForm.markAsPristine()
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe()
  }

}
