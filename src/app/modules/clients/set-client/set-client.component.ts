import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ClientModel } from 'src/app/models/clients.model';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-set-client',
  templateUrl: './set-client.component.html',
  styleUrls: ['./set-client.component.scss']
})
export class SetClientComponent implements OnInit {


  private _client: BehaviorSubject<ClientModel> = new BehaviorSubject(new ClientModel());
  @Input() set client(cli: ClientModel) { this._client.next(cli); }
  get client() { return this._client.getValue() }
  @Output() saved: EventEmitter<any> = new EventEmitter()


  private dataSubscription!: Subscription
  //@Input() client: ClientModel = new ClientModel()
  clientForm: FormGroup = new FormGroup({
    name: new FormControl( '', [ Validators.required ] ),
    cellphone: new FormControl( '', [
      this.celPrefix,
      Validators.required,
      Validators.minLength( 10 ),
      Validators.maxLength( 10 )
    ] ),
    cip: new FormControl( '' ),
    email: new FormControl( '', [Validators.email]),
    facebookId: new FormControl( '' ),
  })

  constructor(
    private _clientService: ClientsService,
  ) { }

  ngOnInit(): void {
    this.dataSubscription =
    this._client.pipe(distinctUntilChanged()).subscribe(data => {
      if(data) this.clientForm.patchValue(data)
    })
  }

  onSubmit(): void {
  this.client = {...this.client, ...this.clientForm.getRawValue()}
  this._clientService.save(this.client)
  console.log(this.client)
  console.log(this.clientForm.controls.value)
  this.clientForm.patchValue(new ClientModel())
  this.saved.emit()
  }


  celPrefix( control: AbstractControl ):
  { [ key: string ]: boolean } | null {
    let number = control.value as string
    return !number.startsWith('3') ? {'prefix': true} : null;
}
  
}
