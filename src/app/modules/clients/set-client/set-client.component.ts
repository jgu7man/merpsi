import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientModel } from 'src/app/models/clients.model';

@Component({
  selector: 'app-set-client',
  templateUrl: './set-client.component.html',
  styleUrls: ['./set-client.component.scss']
})
export class SetClientComponent implements OnInit {

  @Input()
  client: ClientModel = new ClientModel('','','','','','','')
  clientForm: FormGroup = new FormGroup({
    name: new FormControl( '', [ Validators.required ] ),
    cellphone: new FormControl( '', [
      this.celPrefix,
      Validators.required,
      Validators.minLength( 10 ),
      Validators.maxLength( 10 )
    ] ),
    city: new FormControl( '' ),
    email: new FormControl( '', [Validators.email]),
    identification: new FormControl( '' ),
    facebookId: new FormControl( '' ),
  })

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(){

  }


  celPrefix( control: AbstractControl ):
  { [ key: string ]: boolean } | null {
    let number = control.value as string
    return !number.startsWith('3') ? {'prefix': true} : null;
}
  
}
