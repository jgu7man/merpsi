import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { iManagerRegist } from 'src/app/models/manager.model';
import { AuthService } from 'src/app/services/auth.service';
import { iRegistFormChanges } from '../generic-regist-form/generic-regist-form.model';

@Component({
  templateUrl: './regist.component.html',
  styleUrls: ['./regist.component.scss']
})
export class RegistComponent implements OnInit {


  registForm: FormGroup = new FormGroup( {
    country: new FormControl('', [Validators.required]),
    CRF: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    businessName: new FormControl('', [Validators.required]),
    type: new FormControl( 'juridica', [ Validators.required ] ),
  } )
  
  register?: iManagerRegist
  managerFormValid: boolean = false
  
  constructor (
    private _auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  onManagerFormChanges(event: iRegistFormChanges) {
    this.register = event.values
    this.managerFormValid = event.valid
  }

  async onSubmit() {
    console.log( this.register )
    console.log(this.registForm.value)
    await this._auth.regist(this.registForm.value,this.register!)

  }

}
