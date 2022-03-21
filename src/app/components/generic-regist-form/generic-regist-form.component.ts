import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MyErrorStateMatcher } from './app-Validador';
import { defaultLabelsValue, iErrorMessage, iFieldLabels, iRegist, iRegistFormChanges, RegistForm } from './generic-regist-form.model';



@Component({
  selector: 'app-generic-regist-form',
  templateUrl: './generic-regist-form.component.html',
  styleUrls: ['./generic-regist-form.component.scss']
})
export class GenericRegistFormComponent implements OnInit, OnDestroy {

  /** Modelo del formulario */
  public form: RegistForm
  /** Muestra o esconde la contraseña */
  public hide: boolean = true
  /** Comparador de contraseñas */
  public matcher = new MyErrorStateMatcher();
  /** Pre-llenado de campos del formulario de registro */
  @Input() value?: iRegist | Partial<iRegist>
  /** Configuración de etiquetas y textos del formulario */
  @Input() labelsConfig: iFieldLabels = defaultLabelsValue
  /** Texto del botón submit */
  @Input() submitLabel: string = 'Registrarse'
  /** Controla si los campos pre-llenados serán deshabilitados */
  @Input() disablePrefilled: boolean = false
  /** Notifica de los cambios del formulario y si el formulario es válido*/
  @Output() changes: EventEmitter<iRegistFormChanges> = new EventEmitter();
  /** Propiedad para controlar la suscripción de los cambios del formulario */
  private _changesSubscription: Subscription;

  constructor (
    public formBuilder: FormBuilder,
  ) { 
    this.form = this.formBuilder.group( {
      name: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl( '', [
        Validators.required,
        /* Patrón que sólo permite números y letras, que requiere numeros y letras  */
        Validators.pattern( '(?=\\D*\\d)(?=[^a-z]*[a-z]).{8,30}' ),
        /* Patrón que valida que la contraseña no sea menor a 8 caracteres */
        Validators.minLength( 8 ) ] ),
      confirmPwd: new FormControl( '', [ Validators.required ] ),
      acept: new FormControl( false, [ Validators.required ])
    }, { validator: this.checkPasswords } ) as RegistForm;
    
    this._changesSubscription = this.form.valueChanges.pipe(
      distinctUntilChanged( ( x, y ) => JSON.stringify( x ) === JSON.stringify( y ) ),
      debounceTime(1000)
    ).subscribe( values => {
      this.changes.emit( {
        values: this.form.getRawValue(), valid: this.form.valid
      } )
    })
    
  }

  ngOnInit(): void {
    if ( this.value ) {
      this.form.patchValue( this.value )
      Object.keys(this.value).forEach( key => {
        this.form.controls[key as keyof iRegist].disable()
      })
    }
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

  ngOnDestroy(): void {
    this._changesSubscription.unsubscribe()
  }

}
