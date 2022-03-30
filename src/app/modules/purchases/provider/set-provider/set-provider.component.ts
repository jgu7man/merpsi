import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { iCountry } from 'src/app/models/country.model';
import { iProvider, ProviderModel } from 'src/app/models/provider.model';
import { AdminService } from 'src/app/services/admin.service';
import { BusinessService } from 'src/app/services/business.service';
import Swal from 'sweetalert2';
import firebase from 'firebase/app'
import { iBusiness } from 'src/app/models/empresa.model';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-set-provider',
  templateUrl: './set-provider.component.html',
  styleUrls: ['./set-provider.component.scss']
})
export class SetProviderComponent implements OnInit, OnDestroy {

  private _providerSuscription?: Subscription
  private _provider_: BehaviorSubject<ProviderModel> = new BehaviorSubject(new ProviderModel());

  @Input() set provider(pro: ProviderModel) { this._provider_.next(pro); }
  get provider() { return this._provider_.getValue() }

  @Input() crf_: any | null = null

  @Output() submited: EventEmitter<void> = new EventEmitter();

  public countryList: iCountry[] = []
  showForm: boolean = false
  selected: boolean = false
  providerRef: firebase.firestore.DocumentReference<iBusiness> | null = null

  provider_: iProvider | null = null

  /** variable que contiene el pais seleccionado */
  selectedCountry?: iCountry

  providerForm: FormGroup = new FormGroup({
    country: new FormControl('', [Validators.required]),
    CRF: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    businessName: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
  })

  constructor(
    private _admin: AdminService,
    private _provider: ProviderService,
    private _business: BusinessService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.providerRef = null;
    this.countryList = await this._admin.getCountry()

    /** nos suscribimos a los cambios de proveedor y patcheamos los valos al formulario, y le inyectamos el pais en la variable selectedCountry */
    this._providerSuscription = this._provider_.pipe(
      distinctUntilChanged((x, y) => JSON.stringify(x) == JSON.stringify(y))
    ).subscribe(async prv => {
      if (prv) {
        this.providerForm.patchValue(prv)
        this.selectedCountry = this.countryList.find(c => c.alpha3 == prv.country)
        //se valida que si la data que se inyecta al formulario no viene vacia se muestra todo el formulario deshabilitado
        if (prv.CRF != '') {
          this.showForm = true;
          // valida que si el proveedor es una empresa registrada en merpsi actualiza los datos del mismo
          if (prv.businessRef != null) {

            let provider: ProviderModel | null = await this._business.validateBusiness(prv.CRF)
            if (provider) {
              this._provider.create(provider, provider.businessRef!)
              console.log("el proveedor se acaba de actualizadar")
              this.providerForm.patchValue(provider)
              this.disableForm()
            }
          } else {
            this.providerForm.controls.CRF.disable()
          }
        }
      }
    })

    if (this.crf_ != null) {
      this.providerForm.patchValue({ CRF: this.crf_.crf })
    }


  }

  /**
   * Funcion que guarda el proveedor
   */
  async onSubmit() {
    await this._provider.create(this.providerForm.getRawValue(), this.providerRef)
    Swal.fire("El proveedor se ha guardado con exito")
    //console.log(this.providerRef)
    

    this.submited.emit()

  }

  /**
   * funcion que busca una empresa en base de datos por el crf
   * @param crf
   */
  async searchProvider(crf: string) {
    if (crf.length > 4) {
      // se busca la empresa en la base de datos
      let providerDoc = await this._business.validateBusiness(crf)

      // si la empresa no existe en la base de datos se muestra el formulario con los campos vacios
      if (providerDoc == null) {
        this.showForm = true
        this.cleanForm()

      } else {
        
        Swal.fire({
          text: "Encontramos a este Proveedor: " + providerDoc?.businessName.toUpperCase() + " Deseas agregarlo?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'agregar'
        }).then(async (result) => {
          if (result.isConfirmed) {
            /** Mostramos el formulario completo prellenado y deshabilitado */
            this.providerForm.patchValue(providerDoc!)
            this.selectedCountry = this.countryList.find(c => c.alpha3 == providerDoc!.country)
            this.disableForm()
            this.showForm = true
            this.providerRef = providerDoc!.businessRef
          } else {
            /** Mostramos el resto de los campos del formulario vacio */
            this.showForm = true
            this.cleanForm()
          }
        })

      }
    }

  }

  /**
   * funcion que se encarga de buscar el pais por el codigo alpha3 que se le envia
   * @param event
   */
  countrySelected(event: MatSelectChange) {
    this.selectedCountry = this.countryList.find(c => c.alpha3 == event.value)
  }

  cleanForm() {
    this.providerForm.patchValue({
      country: '',
      name: '',
      businessName: '',
      type: '',
    })
  }

  disableForm() {
    this.providerForm.controls.country.disable()
    this.providerForm.controls.name.disable()
    this.providerForm.controls.businessName.disable()
    this.providerForm.controls.type.disable()
    this.providerForm.controls.CRF.disable()
  }

  ngOnDestroy() {
    if (this._providerSuscription) {
      this._providerSuscription.unsubscribe()
    }
  }

}
