import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MyErrorStateMatcher } from './app-Validador';
import { defaultLabelsValue, iErrorMessage, iFieldLabels, iRegistFormChanges } from './generic-regist-form.model';



@Component({
  selector: 'app-generic-regist-form',
  templateUrl: './generic-regist-form.component.html',
  styleUrls: ['./generic-regist-form.component.scss']
})
export class GenericRegistFormComponent implements OnInit, OnDestroy {

  form: FormGroup
  hide: boolean = true
  public matcher = new MyErrorStateMatcher();

  @Input() labelsConfig: iFieldLabels = defaultLabelsValue
  @Input() submitLabel: string = 'Registrarse'
  @Output() changes: EventEmitter<iRegistFormChanges> = new EventEmitter();
  
  private _changesSubscription: Subscription;

  constructor (
    public formBuilder: FormBuilder,
  ) { 
    this.form = this.formBuilder.group( {
      name: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl( '', [
        Validators.required,
        Validators.pattern( '(?=\\D*\\d)(?=[^a-z]*[a-z]).{8,30}' ),
        Validators.minLength( 8 ) ] ),
      confirmPwd: new FormControl( '', [ Validators.required ] ),
      acept: new FormControl( false, [ Validators.required ])
    }, { validator: this.checkPasswords } );
    
    this._changesSubscription = this.form.valueChanges.pipe(
      distinctUntilChanged( ( x, y ) => JSON.stringify( x ) === JSON.stringify( y ) ),
      debounceTime(1000)
    ).subscribe( values => {
      this.changes.emit( {
        values, valid: this.form.valid
      } )
    })
    
  }

  ngOnInit(): void {
    
  }

  errorMessage( field: keyof iFieldLabels, errors: iErrorMessage[] ) {
    let errorList = this.form.controls[ field ].errors
    return !errorList ? ''
      : Object.keys( errorList ).map( type => {
          return errors.find(e => e.errorType === type )?.message || ''
        })
  }

  checkPasswords(group: FormGroup): ValidationErrors | null {
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPwd.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  // async onSubmit() {
  //   this.submit.emit(this.form.getRawValue())
  // }

  ngOnDestroy(): void {
    this._changesSubscription.unsubscribe()
  }

}
